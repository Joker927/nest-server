import { Controller, Post, Body, Get, Param, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';
import { Request } from 'express';
import { Public } from '../utils/public.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  /**
   * @param createUserDto 
   * @returns 
   */
  @Post('add')
  @Public()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('login')
  @Public()
  login(@Body() body: { email: string; password: string }) {
    return this.userService.login(body.email, body.password);
  }


  @Get('list')
  async findAll() {
    return this.userService.findAll();
  }

  @Post('userInfo')
  getProfile(@Req() req: Request) {
    return this.userService.getProfileByUser((req as any).user);
  }
}