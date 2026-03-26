import { prisma } from "../config/db";
import { PurchaseOrderRepository } from "../repositories/PurchaseOrderRepository";

export class PurchaseOrderService {
  private poRepository: PurchaseOrderRepository;

  constructor() {
    this.poRepository = new PurchaseOrderRepository();
  }

  async getAll() {
    return await this.poRepository.findAllWithDetails();
  }

  async getById(id: string) {
    const po = await this.poRepository.findByIdWithDetails(id);
    if (!po) throw new Error("Purchase Order not found");
    return po;
  }

  async createPO(supplierId: string, items: { productId: string, quantity: number, unitCost: number }[]) {
    let totalAmount = 0;
    const poItems = items.map(item => {
      totalAmount += item.quantity * item.unitCost;
      return {
        product: { connect: { id: item.productId } },
        quantity: item.quantity,
        unitCost: item.unitCost
      };
    });

    return await prisma.purchaseOrder.create({
      data: {
        supplierId,
        totalAmount,
        status: "CREATED",
        purchaseOrderItems: {
          create: poItems
        }
      },
      include: {
        supplier: true,
        purchaseOrderItems: true
      }
    });
  }

  async markAsReceived(id: string, userId: string) {
    return await prisma.$transaction(async (tx) => {
      const po = await tx.purchaseOrder.findUnique({
        where: { id },
        include: { purchaseOrderItems: true }
      });

      if (!po) throw new Error("Purchase Order not found");
      if (po.status === "RECEIVED") throw new Error("Purchase Order is already received");

      // Update PO status
      const updatedPo = await tx.purchaseOrder.update({
        where: { id },
        data: { status: "RECEIVED" }
      });

      // Update product stock and log audit/movement
      for (const item of po.purchaseOrderItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stockQuantity: { increment: item.quantity } }
        });

        await tx.stockMovement.create({
          data: {
            productId: item.productId,
            quantity: item.quantity,
            movementType: "IN"
          }
        });
      }

      await tx.auditLog.create({
        data: {
          userId,
          action: "RECEIVE_PURCHASE_ORDER",
          metadata: JSON.stringify({ purchaseOrderId: id, itemsReceived: po.purchaseOrderItems?.length || 0 })
        }
      });

      return updatedPo;
    });
  }
}
