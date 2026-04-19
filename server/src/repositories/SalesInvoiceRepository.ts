import { SalesInvoice } from "@prisma/client";
import { BaseRepository } from "./BaseRepository";
import { prisma } from "../config/db";

export class SalesInvoiceRepository extends BaseRepository<SalesInvoice> {
  constructor() {
    super(prisma.salesInvoice);
  }

  // Include items and user in search
  async findById(id: string): Promise<SalesInvoice | null> {
    return await this.model.findUnique({
      where: { id },
      include: {
        invoiceItems: {
          include: {
            product: true
          }
        },
        user: {
          select: { name: true, email: true }
        },
        payments: true
      },
    });
  }
}
