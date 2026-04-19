import { Category } from "@prisma/client";
import { BaseRepository } from "./BaseRepository";
import { prisma } from "../config/db";

export class CategoryRepository extends BaseRepository<Category> {
  constructor() {
    super(prisma.category);
  }
}
