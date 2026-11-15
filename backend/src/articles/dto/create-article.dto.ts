import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateArticleDto {
    @IsString()
    @MinLength(3)
    @MaxLength(200)
    title: string;

    @IsOptional()
    @IsString()
    @MaxLength(500)
    summary?: string;

    @IsString()
    @MinLength(10)
    content: string;

    @IsOptional()
    @IsString()
    image?: string;
}
