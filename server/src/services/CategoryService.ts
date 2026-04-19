import { CategoryRepository } from "../repositories/CategoryRepository";
import { CreateCategoryDTO, UpdateCategoryDTO } from "../dtos/CategoryDTO";

export class CategoryService {
  private categoryRepository: CategoryRepository;

  constructor() {
    this.categoryRepository = new CategoryRepository();
  }

  async getAllCategories() {
    return await this.categoryRepository.findAll();
  }

  async getCategoryById(id: string) {
    const category = await this.categoryRepository.findById(id);
    if (!category) throw new Error("Category not found");
    return category;
  }

  async createCategory(data: CreateCategoryDTO) {
    return await this.categoryRepository.create(data);
  }

  async updateCategory(id: string, data: UpdateCategoryDTO) {
    await this.getCategoryById(id); // Ensure exists
    return await this.categoryRepository.update(id, data);
  }

  async deleteCategory(id: string) {
    await this.getCategoryById(id); // Ensure exists
    return await this.categoryRepository.delete(id);
  }
}
