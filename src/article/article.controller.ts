import { Controller, Post, Body, UseGuards, Req, Get, Param, BadRequestException } from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { AuthGuard } from '../auth/auth.guard';
import { Request } from 'express';
import { Public } from '../utils/public.decorator';


@Controller('article')
export class ArticleController {
    constructor(private readonly articleService: ArticleService) { }

    @Post('add')
    @UseGuards(AuthGuard)
    async addArticle(
        @Body() createArticleDto: CreateArticleDto,
        @Req() req: Request,
    ) {
        try {
            // user信息由AuthGuard挂载
            const user = (req as any).user;
            const userId = user?.id || user?.sub || user?.user_id;
            if (!userId) throw new BadRequestException('用户信息获取失败');

            const article = await this.articleService.create(createArticleDto, userId);
            return {
                success: true,
                message: '文章创建成功',
                data: article
            };
        } catch (error) {
            return {
                success: false,
                message: error.message,
                data: null
            };
        }
    }

    @Post('list')
    @UseGuards(AuthGuard)
    async getMyArticles(@Req() req: Request) {
        try {
            const user = (req as any).user;
            const userId = user?.id || user?.sub || user?.user_id;
            if (!userId) throw new BadRequestException('用户信息获取失败');

            const articles = await this.articleService.findByUser(userId);
            return {
                success: true,
                message: '获取文章列表成功',
                data: articles
            };
        } catch (error) {
            return {
                success: false,
                message: error.message,
                data: null
            };
        }
    }

    @Post('all')
    @Public()
    async getAllArticles(@Body('pageNum') pageNum: number, @Body('pageSize') pageSize: number) {
        try {
            if (!pageNum || !pageSize) throw new BadRequestException('分页参数不能为空');
            const result = await this.articleService.findAllWithPagination(pageNum, pageSize);
            return {
                success: true,
                message: '获取所有文章成功',
                data: result
            };
        } catch (error) {
            return {
                success: false,
                message: error.message,
                data: null
            };
        }
    }

    @Get('detail/:id')
    @UseGuards(AuthGuard)
    async getArticleDetail(@Param('id') id: string) {
        try {
            const article = await this.articleService.findById(id);
            return {
                success: true,
                message: '获取文章详情成功',
                data: article
            };
        } catch (error) {
            return {
                success: false,
                message: error.message,
                data: null
            };
        }
    }
}
