import { Product } from "@prisma/client";
import { BaseRepository } from "./BaseRepository";
import { prisma } from "../config/db";

export class ProductRepository extends BaseRepository<Product> {
  constructor() {
    super(prisma.product);
  }

  // Override to include categories in search if needed
  async findAll(): Promise<Product[]> {
    return await this.model.findMany({
      include: {
        category: true,
      },
    });
  }

  async findById(id: string): Promise<Product | null> {
    return await this.model.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });
  }
}
