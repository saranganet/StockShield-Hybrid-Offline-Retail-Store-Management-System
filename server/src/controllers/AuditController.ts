import { Request, Response } from "express";
import { AuditService } from "../services/AuditService";

export class AuditController {
  private auditService: AuditService;

  constructor() {
    this.auditService = new AuditService();
  }

  getAll = async (req: Request, res: Response) => {
    try {
      const logs = await this.auditService.getAllLogs();
      res.json(logs);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}
