import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) { }


  // 验证手机号合法性
  private validatePhone(phone: string): boolean {
    if (!phone) return true; // 允许空值
    return /^1[3-9]\d{9}$/.test(phone);
  }
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { phone, idCard } = createUserDto;

    if (!this.validatePhone(phone)) {
      throw new HttpException('手机号不合法1', 501);
    }

    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  // Update the return type to include null
  async findOne(id: string): Promise<User | null> {
    return this.userModel.findOne({ userId: id }).exec();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }
}