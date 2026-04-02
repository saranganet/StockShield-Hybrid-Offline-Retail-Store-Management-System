import { Request, Response } from "express";
import { PurchaseOrderService } from "../services/PurchaseOrderService";
import { AuthRequest } from "../middlewares/authMiddleware";

export class PurchaseOrderController {
  private poService: PurchaseOrderService;

  constructor() {
    this.poService = new PurchaseOrderService();
  }

  getAll = async (req: Request, res: Response) => {
    try {
      const pos = await this.poService.getAll();
      res.json(pos);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const po = await this.poService.getById(req.params.id!);
      res.json(po);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const { supplierId, items } = req.body;
      const po = await this.poService.createPO(supplierId, items);
      res.status(201).json(po);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  receive = async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
      const po = await this.poService.markAsReceived(req.params.id!, req.user.id);
      res.json(po);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
}
