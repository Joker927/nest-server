import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  /**
   * 用户注册接口
   * @param createUserDto 用户注册信息
   * @returns 注册成功的用户信息
   */
  @Post('add')
  async create(@Body() createUserDto: CreateUserDto) {
    // return this.userService.create(createUserDto);
    return { id: 1, name: 2 }
  }

  /**
   * 查询用户信息接口
   * @param id 用户ID
   * @returns 用户信息
   */
  @Get('detail/:id')
  async findOne(@Param('id') id: string) {
    // return this.userService.findOne(+id);
    return id;
  }
}