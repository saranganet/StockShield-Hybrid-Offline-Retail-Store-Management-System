import { Request, Response } from "express";
import { SupplierService } from "../services/SupplierService";

export class SupplierController {
  private supplierService: SupplierService;

  constructor() {
    this.supplierService = new SupplierService();
  }

  getAll = async (req: Request, res: Response) => {
    try {
      const suppliers = await this.supplierService.getAllSuppliers();
      res.json(suppliers);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const supplier = await this.supplierService.getSupplierById(req.params.id as string);
      res.json(supplier);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const supplier = await this.supplierService.createSupplier(req.body);
      res.status(201).json(supplier);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const supplier = await this.supplierService.updateSupplier(req.params.id as string, req.body);
      res.json(supplier);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      await this.supplierService.deleteSupplier(req.params.id as string);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
}
