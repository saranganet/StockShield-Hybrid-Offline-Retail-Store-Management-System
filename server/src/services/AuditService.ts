import { AuditLogRepository } from "../repositories/AuditLogRepository";

export class AuditService {
  private auditLogRepository: AuditLogRepository;

  constructor() {
    this.auditLogRepository = new AuditLogRepository();
  }

  async getAllLogs() {
    return await this.auditLogRepository.findAllWithUsers();
  }
}
