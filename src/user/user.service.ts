import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
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