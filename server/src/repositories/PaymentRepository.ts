import { Payment } from "@prisma/client";
import { BaseRepository } from "./BaseRepository";
import { prisma } from "../config/db";

export class PaymentRepository extends BaseRepository<Payment> {
  constructor() {
    super(prisma.payment);
  }
}
