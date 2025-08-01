import { IsArray, IsString, ArrayNotEmpty, MaxLength, IsUrl, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

export class ImageDto {
  @IsString()
  @IsUrl()
  url: string;

  @IsString()
  public_id: string;
}

export class CreateArticleDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ImageDto)
  images: ImageDto[];

  @IsString()
  @MaxLength(100, { message: '标题不能超过100字' })
  title: string;

  @IsString()
  @MaxLength(800, { message: '正文不能超过800字' })
  content: string;
} 