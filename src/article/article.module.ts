import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Article, ArticleSchema } from './schemas/article.schema';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Article.name, schema: ArticleSchema }]),
    ConfigModule,
  ],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
