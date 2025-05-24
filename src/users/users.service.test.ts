import { UsersService } from './users.service';
import { Test } from '@nestjs/testing';
import { User } from '../entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { fakeUser } from '../util/fakers';
import type { Repository } from 'typeorm';

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: Repository<User>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: { findOne: jest.fn().mockResolvedValue(fakeUser) },
        },
      ],
    }).compile();

    usersService = moduleRef.get(UsersService);
    usersRepository = moduleRef.get(getRepositoryToken(User));
  });

  describe('findOne', () => {
    it('should get data from db"', async () => {
      const result = await usersService.findOne(111);

      expect(result).toEqual(fakeUser);
      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { id: 111 },
      });
    });
  });
});
