import { ProductRepository } from "../repositories/ProductRepository";
import { CategoryRepository } from "../repositories/CategoryRepository";
import { CreateProductDTO, UpdateProductDTO } from "../dtos/ProductDTO";

export class ProductService {
  private productRepository: ProductRepository;
  private categoryRepository: CategoryRepository;

  constructor() {
    this.productRepository = new ProductRepository();
    this.categoryRepository = new CategoryRepository();
  }

  async getAllProducts() {
    return await this.productRepository.findAll();
  }

  async getProductById(id: string) {
    const product = await this.productRepository.findById(id);
    if (!product) throw new Error("Product not found");
    return product;
  }

  async createProduct(data: CreateProductDTO) {
    // Validate category exists
    const category = await this.categoryRepository.findById(data.categoryId);
    if (!category) throw new Error("Category not found");

    return await this.productRepository.create(data);
  }

  async updateProduct(id: string, data: UpdateProductDTO) {
    await this.getProductById(id); // Ensure exists
    
    if (data.categoryId) {
      const category = await this.categoryRepository.findById(data.categoryId);
      if (!category) throw new Error("Category not found");
    }

    return await this.productRepository.update(id, data);
  }

  async deleteProduct(id: string) {
    await this.getProductById(id); // Ensure exists
    return await this.productRepository.delete(id);
  }
}
