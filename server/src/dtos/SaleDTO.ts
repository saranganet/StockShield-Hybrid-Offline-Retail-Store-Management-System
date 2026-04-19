import { PaymentMethod } from "@prisma/client";

export interface CreateSaleItemDTO {
  productId: string;
  quantity: number;
}

export interface CreateSaleDTO {
  items: CreateSaleItemDTO[];
  paymentMethod: PaymentMethod;
}
