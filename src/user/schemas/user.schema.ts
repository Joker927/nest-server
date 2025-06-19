import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ unique: true })
  userId: string;

  @Prop()
  userName: string;

  @Prop()
  avatar: string;

  @Prop()
  age: number;

  @Prop()
  phone: string;

  @Prop()
  idCard: string;

  @Prop()
  gender: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
