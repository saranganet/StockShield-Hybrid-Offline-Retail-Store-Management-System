import { PrismaClient } from "@prisma/client";

class Database {
  private static instance: PrismaClient;

  private constructor() {}

  public static getInstance(): PrismaClient {
    if (!Database.instance) {
      Database.instance = new PrismaClient({
        datasources: {
          db: {
            url: process.env["DATABASE_URL"]
          }
        }
      });
    }
    return Database.instance;
  }
}

export const prisma = Database.getInstance();
