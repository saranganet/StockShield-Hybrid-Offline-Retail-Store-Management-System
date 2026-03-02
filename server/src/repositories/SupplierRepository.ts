import { BaseRepository } from "./BaseRepository";
import { Supplier } from "@prisma/client";
import { prisma } from "../config/db";

export class SupplierRepository extends BaseRepository<Supplier> {
  constructor() {
    super(prisma.supplier);
  }
}
