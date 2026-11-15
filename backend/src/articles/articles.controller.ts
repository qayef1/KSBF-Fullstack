import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Controller('articles')
export class ArticlesController {
    constructor(private readonly articlesService: ArticlesService) {}

    @Get()
    findAll() {
        return this.articlesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.articlesService.findOne(id);
    }

    @Post()
    create(@Body() dto: CreateArticleDto) {
        return this.articlesService.create(dto);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateArticleDto) {
        return this.articlesService.update(id, dto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id') id: string) {
        return this.articlesService.remove(id);
    }
}