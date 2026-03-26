import { SupplierRepository } from "../repositories/SupplierRepository";

export class SupplierService {
  private supplierRepository: SupplierRepository;

  constructor() {
    this.supplierRepository = new SupplierRepository();
  }

  async getAllSuppliers() {
    return await this.supplierRepository.findAll();
  }

  async getSupplierById(id: string) {
    const supplier = await this.supplierRepository.findById(id);
    if (!supplier) throw new Error("Supplier not found");
    return supplier;
  }

  async createSupplier(data: { name: string; contactInfo: string }) {
    if (!data.name || !data.contactInfo) {
      throw new Error("Name and contact information are required");
    }
    return await this.supplierRepository.create(data);
  }

  async updateSupplier(id: string, data: Partial<{ name: string; contactInfo: string }>) {
    return await this.supplierRepository.update(id, data);
  }

  async deleteSupplier(id: string) {
    return await this.supplierRepository.delete(id);
  }
}
