import { StockMovement } from "@prisma/client";
import { BaseRepository } from "./BaseRepository";
import { prisma } from "../config/db";

export class StockMovementRepository extends BaseRepository<StockMovement> {
  constructor() {
    super(prisma.stockMovement);
  }
}
