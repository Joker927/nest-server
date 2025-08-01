import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
export class Image {
  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  public_id: string;
}

@Schema({ timestamps: true })
export class Article extends Document {
  @Prop({ required: true, type: String })
  user: string; // 用户id

  @Prop({ required: true, type: [Image] })
  images: Image[];

  @Prop({ required: true, maxlength: 100 })
  title: string;

  @Prop({ required: true, maxlength: 800 })
  content: string;

  // 显式声明 timestamps 字段
  createdAt: Date;
  updatedAt: Date;
}

export const ArticleSchema = SchemaFactory.createForClass(Article); 