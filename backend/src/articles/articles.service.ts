import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticlesService {
    constructor(private readonly prisma: PrismaService) {}

    findAll() {
        return this.prisma.article.findMany({
            orderBy: { createdAt: 'desc' }
        });
    }

    async findOne(id: string) {
        const article = await this.prisma.article.findUnique({ where: { id } });
        if (!article) {
            throw new NotFoundException('Artikel tidak ditemukan');
        }
        return article;
    }

    async create(dto: CreateArticleDto) {
        const existing = await this.prisma.article.findUnique({
            where: { title: dto.title }
        });
        if (existing) {
            throw new ConflictException('Judul artikel sudah ada');
        }

        return this.prisma.article.create({
            data: {
                title: dto.title,
                summary: dto.summary ?? null,
                content: dto.content,
                image: dto.image ?? null
            }
        });
    }

    async update(id: string, dto: UpdateArticleDto) {
        await this.findOne(id);
        if (dto.title) {
            const existing = await this.prisma.article.findUnique({
                where: { title: dto.title }
            });
            if (existing && existing.id !== id) {
                throw new ConflictException('Judul artikel sudah ada');
            }
        }

        return this.prisma.article.update({
            where: { id },
            data: { ...dto }
        });
    }

    async remove(id: string) {
        await this.findOne(id);
        await this.prisma.article.delete({ where: { id } });
    }
}
