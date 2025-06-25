import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop()
  userId: string;

  @Prop()
  userName: string;

  @Prop()
  phone: string;

  @Prop()
  idCard: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  supabaseUserId: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
