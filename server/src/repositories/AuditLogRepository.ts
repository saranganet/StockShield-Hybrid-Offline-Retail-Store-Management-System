import { AuditLog } from "@prisma/client";
import { BaseRepository } from "./BaseRepository";
import { prisma } from "../config/db";

export class AuditLogRepository extends BaseRepository<AuditLog> {
  constructor() {
    super(prisma.auditLog);
  }

  async findAllWithUsers() {
    return await prisma.auditLog.findMany({
      include: {
        user: { select: { name: true, email: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}
