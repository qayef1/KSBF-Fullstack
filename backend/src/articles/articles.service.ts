import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';

@Injectable()
export class ArticlesService {
    private articles: Article[] = [];

    findAll(): Article[] {
        return this.articles;
    }

    findOne(id: string): Article {
        const article = this.articles.find((item) => item.id === id);
        if (!article) {
            throw new NotFoundException('Artikel tidak ditemukan');
        }
        return article;
    }

    create(dto: CreateArticleDto): Article {
        const existing = this.articles.find((item) => item.title === dto.title);
        if (existing) {
            throw new ConflictException('Judul artikel sudah ada');
        }

        const article: Article = {
            id: randomUUID(),
            title: dto.title,
            summary: dto.summary ?? null,
            content: dto.content,
            image: dto.image ?? null,
            published: true,
            createdAt: new Date()
        };

        this.articles.push(article);
        return article;
    }

    update(id: string, dto: UpdateArticleDto): Article {
        const article = this.findOne(id);
        if (dto.title) {
            const existing = this.articles.find((item) => item.title === dto.title && item.id !== id);
            if (existing) {
                throw new ConflictException('Judul artikel sudah ada');
            }
        }

        Object.assign(article, dto);
        return article;
    }

    remove(id: string): void {
        this.findOne(id);
        this.articles = this.articles.filter((item) => item.id !== id);
    }
}
