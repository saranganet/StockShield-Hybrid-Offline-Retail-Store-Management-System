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
    return await this.salesInvoiceRepository.findAllWithDetails();
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
          product: { connect: { id: item.productId } },
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

  async getDashboardStats() {
    const salesInvoices = await prisma.salesInvoice.aggregate({
      _sum: { totalAmount: true }
    });
    
    // Orders (From PurchaseOrders)
    const pendingOrders = await prisma.purchaseOrder.count({ where: { status: 'CREATED' } });
    const receivedOrders = await prisma.purchaseOrder.count({ where: { status: 'RECEIVED' } });
    
    // Stock (Products)
    const totalProductsCount = await prisma.product.count();
    const lowStockItems = await prisma.product.count({ where: { stockQuantity: { lt: 10, gt: 0 } } });
    const outOfStockItems = await prisma.product.count({ where: { stockQuantity: 0 } });
    const inStockItems = await prisma.product.aggregate({ _sum: { stockQuantity: true } });

    // Recent Products for Table
    const recentProducts = await prisma.product.findMany({
      take: 5,
      orderBy: { updatedAt: 'desc' },
      include: { category: true }
    });
    
    return {
      totalSales: Number(salesInvoices._sum.totalAmount || 0),
      orders: {
        pending: pendingOrders,
        completed: receivedOrders,
        total: pendingOrders + receivedOrders
      },
      stock: {
        totalItems: totalProductsCount,
        inStock: totalProductsCount - lowStockItems - outOfStockItems,
        lowStock: lowStockItems,
        outOfStock: outOfStockItems,
        totalVolume: inStockItems._sum.stockQuantity || 0
      },
      recentProducts
    };
  }
}
