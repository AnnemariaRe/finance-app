import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { OperationType } from 'src/enums/OperationType';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findAll() {
    return this.categoryRepository.find();
  }

  async findCategoriesByUserId(userId: number) {
    return this.categoryRepository.find({
      relations: { user: true },
      where: { user: { id: userId } },
    });
  }

  async createCategory(data: {
    name: string;
    operationType: OperationType;
    userId: number;
  }) {
    const category = this.categoryRepository.create({
      name: data.name,
      operationType: data.operationType,
      user: { id: data.userId },
    });
    return this.categoryRepository.save(category);
  }
}
