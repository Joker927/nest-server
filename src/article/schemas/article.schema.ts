import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Article extends Document {
  @Prop({ required: true, type: String })
  user: string; // 用户id

  @Prop({ required: true, type: [String] })
  images: string[];

  @Prop({ required: true, maxlength: 100 })
  title: string;

  @Prop({ required: true, maxlength: 800 })
  content: string;
}

export const ArticleSchema = SchemaFactory.createForClass(Article); 