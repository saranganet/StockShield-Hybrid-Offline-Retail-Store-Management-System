import { prisma } from "../config/db";
import { CreateSaleDTO } from "../dtos/SaleDTO";
import { ProductRepository } from "../repositories/ProductRepository";
import { SalesInvoiceRepository } from "../repositories/SalesInvoiceRepository";
import { AuditLogRepository } from "../repositories/AuditLogRepository";

export class SalesService {
  private productRepository: ProductRepository;
  private salesInvoiceRepository: SalesInvoiceRepository;
  private auditLogRepository: AuditLogRepository;

  constructor() {
    this.productRepository = new ProductRepository();
    this.salesInvoiceRepository = new SalesInvoiceRepository();
    this.auditLogRepository = new AuditLogRepository();
  }

  async getAllSales() {
    return await this.salesInvoiceRepository.findAll();
  }

  async getSaleById(id: string) {
    const sale = await this.salesInvoiceRepository.findById(id);
    if (!sale) throw new Error("Sale not found");
    return sale;
  }

  async processSale(userId: string, data: CreateSaleDTO) {
    return await prisma.$transaction(async (tx) => {
      let totalAmount = 0;
      const invoiceItems = [];

      // 1. Process each item
      for (const item of data.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId }
        });

        if (!product) {
          throw new Error(`Product with ID ${item.productId} not found`);
        }

        if (product.stockQuantity < item.quantity) {
          throw new Error(`Insufficient stock for product ${product.name}. Available: ${product.stockQuantity}, Requested: ${item.quantity}`);
        }

        const unitPrice = product.price;
        const subtotal = Number(unitPrice) * item.quantity;
        totalAmount += subtotal;

        // Update product stock
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stockQuantity: {
              decrement: item.quantity
            }
          }
        });

        // Record stock movement
        await tx.stockMovement.create({
          data: {
            productId: item.productId,
            quantity: item.quantity,
            movementType: "OUT"
          }
        });

        invoiceItems.push({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: unitPrice
        });
      }

      // 2. Create Sales Invoice
      const invoice = await tx.salesInvoice.create({
        data: {
          userId,
          totalAmount,
          invoiceItems: {
            create: invoiceItems
          }
        }
      });

      // 3. Create Payment
      await tx.payment.create({
        data: {
          invoiceId: invoice.id,
          amount: totalAmount,
          method: data.paymentMethod
        }
      });

      // 4. Create Audit Log
      await tx.auditLog.create({
        data: {
          userId,
          action: "CREATE_SALE",
          metadata: {
            invoiceId: invoice.id,
            totalAmount
          }
        }
      });

      return invoice;
    });
  }
}
