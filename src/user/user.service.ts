import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

// Define a User type
type User = CreateUserDto & { id: number };

@Injectable()
export class UserService {
  // Explicitly define the type of the users array
  private users: User[] = [];

  /**
   * 创建用户
   * @param createUserDto 用户注册信息    
   * @returns 注册成功的用户信息
   */
  create(createUserDto: CreateUserDto) {
    const newUser: User = { ...createUserDto, id: this.users.length + 1 };
    this.users.push(newUser);
    return newUser;
  }

  /**
   * 根据用户ID查询用户信息
   * @param id 用户ID
   * @returns 用户信息
   */
  findOne(id: number) {
    return this.users.find(user => user.id === id); 
  }
}