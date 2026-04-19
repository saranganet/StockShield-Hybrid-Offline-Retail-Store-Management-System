import { Decimal } from "@prisma/client/runtime/library";

export interface CreateProductDTO {
  name: string;
  price: number | Decimal;
  stockQuantity?: number;
  categoryId: string;
}

export interface UpdateProductDTO {
  name?: string;
  price?: number | Decimal;
  stockQuantity?: number;
  categoryId?: string;
}
