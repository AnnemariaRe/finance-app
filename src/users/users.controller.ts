import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

@Controller('users')
@ApiTags('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiCreatedResponse({ type: User })
  async create(@Body() createUserDto: CreateUserDto) : Promise<User> {
    return await this.usersService.create(createUserDto);
  }

  @Get(':id')
  @ApiOkResponse({ type: User })
  async findOne(@Param('id') id: string) : Promise<User> {
    return await this.usersService.findOne(+id);
  }
}

