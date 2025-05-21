import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';

@Injectable()
export default class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findCategoriesByUserId(userId: number) {
    return this.categoryRepository.find({
      relations: ['user'],
      where: { user: { id: userId } },
    });
  }
}
