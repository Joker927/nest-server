import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article } from './schemas/article.schema';
import { CreateArticleDto } from './dto/create-article.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<Article>,
  ) { }

  async create(createArticleDto: CreateArticleDto, userId: string) {
    try {
      const created = new this.articleModel({
        ...createArticleDto,
        user: userId,
      });
      const savedArticle = await created.save();
      return {
        id: savedArticle._id,
        title: savedArticle.title,
        content: savedArticle.content,
        images: savedArticle.images,
        user: savedArticle.user,
        createdAt: savedArticle.createdAt,
        updatedAt: savedArticle.updatedAt,
      };
    } catch (error) {
      throw new BadRequestException('创建文章失败: ' + error.message);
    }
  }

  async findByUser(userId: string) {
    try {
      const articles = await this.articleModel
        .find({ user: userId })
        .sort({ createdAt: -1 })
        .exec();

      return articles.map(article => ({
        id: article._id,
        title: article.title,
        content: article.content,
        images: article.images,
        user: article.user,
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
      }));
    } catch (error) {
      throw new BadRequestException('获取文章列表失败: ' + error.message);
    }
  }

  async findById(id: string) {
    try {
      const article = await this.articleModel.findById(id).exec();
      if (!article) {
        throw new BadRequestException('文章不存在');
      }
      return {
        id: article._id,
        title: article.title,
        content: article.content,
        images: article.images,
        user: article.user,
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
      };
    } catch (error) {
      throw new BadRequestException('获取文章详情失败: ' + error.message);
    }
  }

  async findAllWithPagination(pageNum: number, pageSize: number) {
    try {
      const skip = (pageNum - 1) * pageSize;
      const [articles, total] = await Promise.all([
        this.articleModel.find()
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(pageSize)
          .exec(),
        this.articleModel.countDocuments().exec(),
      ]);
      return {
        list: articles.map(article => ({
          id: article._id,
          title: article.title,
          content: article.content,
          images: article.images,
          user: article.user,
          createdAt: article.createdAt,
          updatedAt: article.updatedAt,
        })),
        total,
        pageNum,
        pageSize,
      };
    } catch (error) {
      throw new BadRequestException('获取文章分页失败: ' + error.message);
    }
  }
}
