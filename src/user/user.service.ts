import { Injectable, HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';
import { supabase } from '../supabase.config';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) { }


  // 验证手机号合法性
  private validatePhone(phone: string): boolean {
    if (!phone) return false; // 不允许空值
    return /^1[3-9]\d{9}$/.test(phone);
  }

  // 验证邮箱合法性
  private validateEmail(email: string): boolean {
    if (!email) return false; // 不允许空值
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  async create(createUserDto: CreateUserDto): Promise<{ message: string; user?: User }> {
    const { userName, phone, email, password } = createUserDto;
    //验证邮箱合法性，并且不允许重复
    if (!this.validateEmail(email)) {
      throw new HttpException('邮箱不合法', HttpStatus.BAD_REQUEST);
    }
    const existingUser = await this.userModel.find({ email }).exec();
    if (existingUser.length > 0) {
      throw new HttpException('邮箱已被注册', HttpStatus.BAD_REQUEST);
    }

    //自动生成userId,且验证userId是否存在,不可重复  
    let userId = 'user' + Date.now();
    createUserDto.userId = userId;

    if (!userName) {
      createUserDto.userName = 'test' + Date.now();
    }

    if (!this.validatePhone(phone)) {
      throw new HttpException('手机号不合法', HttpStatus.BAD_REQUEST);
    }

    // 使用 Supabase 进行用户注册
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error || !data.user) {
      throw new HttpException('注册失败', HttpStatus.BAD_REQUEST);
    }

    // 将 Supabase 用户 ID 存入用户数据
    createUserDto.supabaseUserId = data.user?.id;

    const createdUser = new this.userModel(createUserDto);
    await createdUser.save();

    return {
      message: '注册成功，请登录', user: createdUser
    };
  }

  async login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw new UnauthorizedException(error.message);
    if (!data.session) throw new UnauthorizedException('登录失败');

    return {
      accessToken: data.session.access_token,
      user: data.user,
    };
  }

  async findOne(id: string): Promise<User | null> {
    return this.userModel.findOne({ userId: id }).exec();
  }


  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async getProfile(accessToken: string) {
    const { data, error } = await supabase.auth.getUser(accessToken);
    if (error || !data.user) throw new UnauthorizedException('Token无效');

    const user = await this.userModel.findOne({
      supabaseUserId: data.user.id,
    }).exec()

    return user;
  }

  async getProfileByUser(user: any) {
    if (!user || !user.id) throw new UnauthorizedException('用户信息无效');
    // 这里假设 user.id 是 supabaseUserId，如果不是请根据实际 token 内容调整
    const dbUser = await this.userModel.findOne({ supabaseUserId: user.id }).exec();
    if (!dbUser) throw new UnauthorizedException('用户不存在');
    return dbUser;
  }
}