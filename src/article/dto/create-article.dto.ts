import { IsArray, IsString, ArrayNotEmpty, MaxLength, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateArticleDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsUrl({},{each:true})
  @Type(() => String)
  images: string[];

  @IsString()
  @MaxLength(100, { message: '标题不能超过100字' })
  title: string;

  @IsString()
  @MaxLength(800, { message: '正文不能超过800字' })
  content: string;
} 