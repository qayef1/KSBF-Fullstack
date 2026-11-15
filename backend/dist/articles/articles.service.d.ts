import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';
export declare class ArticlesService {
    private articles;
    findAll(): Article[];
    findOne(id: string): Article;
    create(dto: CreateArticleDto): Article;
    update(id: string, dto: UpdateArticleDto): Article;
    remove(id: string): void;
}
