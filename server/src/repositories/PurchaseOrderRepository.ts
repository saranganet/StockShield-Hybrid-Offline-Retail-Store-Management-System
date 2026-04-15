import { BaseRepository } from "./BaseRepository";
import { PurchaseOrder } from "@prisma/client";
import { prisma } from "../config/db";

export class PurchaseOrderRepository extends BaseRepository<PurchaseOrder> {
  constructor() {
    super(prisma.purchaseOrder);
  }

  async findAllWithDetails() {
    return await prisma.purchaseOrder.findMany({
      include: {
        supplier: true,
        purchaseOrderItems: { include: { product: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findByIdWithDetails(id: string) {
    return await prisma.purchaseOrder.findUnique({
      where: { id },
      include: {
        supplier: true,
        purchaseOrderItems: { include: { product: true } }
      }
    });
  }
}
