import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  /**
   * User registration interface
   * @param createUserDto User registration information
   * @returns Registered user information
   */
  @Post('add')
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  /**
   * Query user information interface
   * @param id User ID
   * @returns User information or null
   */
  @Get('detail/:id')
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne(id);
    if (!user) {
      return { message: 'User not found' };
    }
    return user;
  }


  @Get('list')
  async findAll() {
    return this.userService.findAll();
  }
}