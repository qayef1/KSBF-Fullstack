"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticlesService = void 0;
const common_1 = require("@nestjs/common");
const node_crypto_1 = require("node:crypto");
let ArticlesService = class ArticlesService {
    articles = [];
    findAll() {
        return this.articles;
    }
    findOne(id) {
        const article = this.articles.find((item) => item.id === id);
        if (!article) {
            throw new common_1.NotFoundException('Artikel tidak ditemukan');
        }
        return article;
    }
    create(dto) {
        const existing = this.articles.find((item) => item.title === dto.title);
        if (existing) {
            throw new common_1.ConflictException('Judul artikel sudah ada');
        }
        const article = {
            id: (0, node_crypto_1.randomUUID)(),
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
    update(id, dto) {
        const article = this.findOne(id);
        if (dto.title) {
            const existing = this.articles.find((item) => item.title === dto.title && item.id !== id);
            if (existing) {
                throw new common_1.ConflictException('Judul artikel sudah ada');
            }
        }
        Object.assign(article, dto);
        return article;
    }
    remove(id) {
        this.findOne(id);
        this.articles = this.articles.filter((item) => item.id !== id);
    }
};
exports.ArticlesService = ArticlesService;
exports.ArticlesService = ArticlesService = __decorate([
    (0, common_1.Injectable)()
], ArticlesService);
//# sourceMappingURL=articles.service.js.map