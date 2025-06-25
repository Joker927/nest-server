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

  private validateIdCard(idCard: string): boolean {
    if (!idCard) return false; // 不允许空值
    return /^\d{17}[0-9Xx]$/.test(idCard);
  }

  async create(createUserDto: CreateUserDto): Promise<{ message: string; user?: User }> {
    const { userName, phone, idCard, email, password } = createUserDto;

    //自动生成userId,且验证userId是否存在,不可重复  
    let userId = 'user' + Date.now();
    createUserDto.userId = userId;

    if (!userName) {
      createUserDto.userName = '';
    }

    if (!this.validatePhone(phone)) {
      throw new HttpException('手机号不合法', HttpStatus.BAD_REQUEST);
    }

    if (!this.validateIdCard(idCard)) {
      throw new HttpException('身份证号不合法', HttpStatus.BAD_REQUEST);
    }

    // 使用 Supabase 进行用户注册
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    console.log("🚀 ~ UserService ~ create ~ data:", JSON.stringify(data))

    if (error || !data.user) {
      throw new HttpException('注册失败', HttpStatus.BAD_REQUEST);
    }

    // 将 Supabase 用户 ID 存入用户数据
    createUserDto.supabaseUserId = data.user?.id;

    const createdUser = new this.userModel(createUserDto);
    await createdUser.save();

    return {
      message: '注册成功，请前往邮箱确认', user: createdUser
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
}