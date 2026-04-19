import { Request, Response } from "express";
import { SalesService } from "../services/SalesService";

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
      const sale = await this.salesService.getSaleById(req.params["id"]!);
      res.json(sale);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      // In a real app, userId would come from the auth middleware (jwt)
      // For now, we'll expect it in the body or use a dummy one if not provided
      const userId = req.body.userId || "dummy-user-id"; 
      
      const sale = await this.salesService.processSale(userId, req.body);
      res.status(201).json(sale);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
}
