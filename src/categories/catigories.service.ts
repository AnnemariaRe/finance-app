import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export default class CategoriesService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    ) {}

  async findCategoriesByUserId(userId: number) {
    const user  = await this.userRepository.findOne({ where: { id: userId }, relations: ['categories']});
    return user.categories;
  }
}
