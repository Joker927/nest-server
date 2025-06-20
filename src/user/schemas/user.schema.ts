import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// 验证手机号是否合法
const validatePhone = (phone: string) => {
  // 允许空字符串
  if (!phone) return true;
  return /^1[3-9]\d{9}$/.test(phone);
};

// 验证身份证号码是否合法
const validateIdCard = (idCard: string) => {
  // 允许空字符串
  if (!idCard) return true;
  // 匹配 15 位、18 位或 17 位加 X/x 的身份证号码
  return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(idCard);
};

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

  @Prop({
    required: false, // 如果 phone 字段可选
  })
  phone: string;

  @Prop({
    required: false, // 如果 idCard 字段可选
  })
  idCard: string;

  @Prop()
  gender: string;

  // 添加一个函数，返回一个对象，对象包含 userId, userName, avatar, age, phone, idCard, gender
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
