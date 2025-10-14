import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto/category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = this.categoriesRepository.create(createCategoryDto);
    return await this.categoriesRepository.save(category);
  }

  async findAll(): Promise<Category[]> {
    return await this.categoriesRepository.find();
  }

  async findOne(id: string): Promise<Category> {
    return await this.categoriesRepository.findOne({ where: { id } });
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    await this.categoriesRepository.update(id, updateCategoryDto);
    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.categoriesRepository.delete(id);
  }

  async seedDefaultCategories(): Promise<void> {
    const defaultCategories: Array<{
      name: string;
      type: 'income' | 'expense';
      icon: string;
      color: string;
    }> = [
      { name: "Зарплата", type: "income", icon: "💰", color: "chart-2" },
      { name: "Фриланс", type: "income", icon: "💻", color: "chart-2" },
      { name: "Инвестиции", type: "income", icon: "📈", color: "chart-2" },
      { name: "Продукты", type: "expense", icon: "🛒", color: "chart-3" },
      { name: "Транспорт", type: "expense", icon: "🚗", color: "chart-3" },
      { name: "Развлечения", type: "expense", icon: "🎮", color: "chart-3" },
      { name: "Здоровье", type: "expense", icon: "🏥", color: "chart-3" },
      { name: "Образование", type: "expense", icon: "📚", color: "chart-3" },
    ];

    for (const categoryData of defaultCategories) {
      const existingCategory = await this.categoriesRepository.findOne({
        where: { name: categoryData.name, type: categoryData.type }
      });
      
      if (!existingCategory) {
        const category = this.categoriesRepository.create(categoryData);
        await this.categoriesRepository.save(category);
      }
    }
  }
}
