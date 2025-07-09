import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article } from './schemas/article.schema';
import { CreateArticleDto } from './dto/create-article.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<Article>,
  ) {}

  async create(createArticleDto: CreateArticleDto, userId: string) {
    const created = new this.articleModel({
      ...createArticleDto,
      user: userId,
    });
    return created.save();
  }

  async findByUser(userId: string) {
    return this.articleModel.find({ user: userId }).sort({ createdAt: -1 }).exec();
  }
}
