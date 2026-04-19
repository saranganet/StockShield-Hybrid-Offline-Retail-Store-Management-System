import { Request, Response } from "express";
import { SalesService } from "../services/SalesService";
import { AuthRequest } from "../middlewares/authMiddleware";

export class SalesController {
  private salesService: SalesService;

  constructor() {
    this.salesService = new SalesService();
  }

  getAll = async (req: Request, res: Response) => {
    try {
      const sales = await this.salesService.getAllSales();
      res.json(sales);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const sale = await this.salesService.getSaleById(req.params["id"] as string);
      res.json(sale);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  };

  getStats = async (req: Request, res: Response) => {
    try {
      const stats = await this.salesService.getDashboardStats();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  create = async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
      const userId = req.user.id;
      
      const sale = await this.salesService.processSale(userId, req.body);
      res.status(201).json(sale);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
}
