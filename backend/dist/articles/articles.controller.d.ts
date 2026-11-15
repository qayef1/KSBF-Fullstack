import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
export declare class ArticlesController {
    private readonly articlesService;
    constructor(articlesService: ArticlesService);
    findAll(): import("./entities/article.entity").Article[];
    findOne(id: string): import("./entities/article.entity").Article;
    create(dto: CreateArticleDto): import("./entities/article.entity").Article;
    update(id: string, dto: UpdateArticleDto): import("./entities/article.entity").Article;
    remove(id: string): void;
}
