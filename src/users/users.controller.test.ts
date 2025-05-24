import { UsersService } from './users.service';
import { Test } from '@nestjs/testing';
import { fakeUser } from '../util/fakers';
import { UsersController } from './users.controller';
import { CreateUserDto } from '../dto/create-user.dto';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UsersController],
    })
      .useMocker((token) => {
        if (token === UsersService) {
          return {
            create: jest.fn(),
            findOne: jest.fn().mockResolvedValue(fakeUser),
          };
        }
      })
      .compile();

    usersService = moduleRef.get(UsersService);
    usersController = moduleRef.get(UsersController);
  });

  describe('findOne', () => {
    it('should get data from service"', async () => {
      const result = await usersController.findOne('111');

      expect(result).toEqual(fakeUser);
      expect(usersService.findOne).toHaveBeenCalledWith(111);
    });
  });

  describe('create', () => {
    it('should call create in service"', async () => {
      const dto: CreateUserDto = {
        name: fakeUser.name,
        email: fakeUser.email,
        password: fakeUser.password,
      };

      await usersController.create(dto);

      expect(usersService.create).toHaveBeenCalledWith(dto);
    });
  });
});
