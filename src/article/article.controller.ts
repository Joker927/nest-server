import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { AuthGuard } from '../auth/auth.guard';
import { Request } from 'express';

@Controller('article')
export class ArticleController {
    constructor(private readonly articleService: ArticleService) { }

    @Post('add')
    @UseGuards(AuthGuard)
    async addArticle(
        @Body() createArticleDto: CreateArticleDto,
        @Req() req: Request,
    ) {
        // user信息由AuthGuard挂载
        const user = (req as any).user;
        const userId = user?.id || user?.sub || user?.user_id;
        if (!userId) throw new Error('用户信息获取失败');
        const article = await this.articleService.create(createArticleDto, userId);
        return { success: true, data: article };
    }

    @Post('articleListList')
    @UseGuards(AuthGuard)
    async getMyArticles(@Req() req: Request) {
        const user = (req as any).user;
        const userId = user?.id || user?.sub || user?.user_id;
        if (!userId) throw new Error('用户信息获取失败');
        const articles = await this.articleService.findByUser(userId);
        return { success: true, data: articles };
    }
}
