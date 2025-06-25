import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  /**
   * @param createUserDto 
   * @returns 
   */
  @Post('add')
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    return this.userService.login(body.email, body.password);
  }

  /**
   * @param id User ID
   * @returns 
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

  @Post('userInfo')
  getProfile(@Body() body: { token: string; }) {
    return this.userService.getProfile(body.token);
  }
}