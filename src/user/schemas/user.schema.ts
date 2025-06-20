import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ unique: true })
  userId: string;

  @Prop({ unique: true, required: true })
  userName: string;

  @Prop()
  avatar: string;

  @Prop()
  age: number;

  //验证手机号是否合法，不合法则抛出错误
  const PHONE_VALIDATION_MESSAGE = '手机号不合法';
  @Prop({
    required: false, // 如果 phone 字段可选
    validate: {
      validator: (phone: string) => {
        // 允许空字符串
        if (!phone) return true;
        return /^1[3-9]\d{9}$/.test(phone);
      },
      message: PHONE_VALIDATION_MESSAGE,
    },
  })
  phone: string;

  @Prop()
  idCard: string;

  @Prop()
  gender: string;

  //添加一个函数，返回一个对象，对象包含userId,userName,avatar,age,phone,idCard,gender
  toResponseObject() {
    return {
      userId: this.userId,
      userName: this.userName,
      avatar: this.avatar,
      age: this.age,
      phone: this.phone,
      idCard: this.idCard,
      gender: this.gender,
    };
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
