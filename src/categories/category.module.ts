import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../entities/category.entity';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { User } from '../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, User])],
  providers: [CategoriesService],
  controllers: [CategoriesController],
})
export class CategoryModule {}
