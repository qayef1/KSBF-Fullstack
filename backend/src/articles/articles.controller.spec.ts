import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { ArticlesController } from './articles.controller';
import { ArticlesModule } from './articles.module';
import { ArticlesService } from './articles.service';

describe('ArticlesController', () => {
  let controller: ArticlesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticlesController],
      providers: [ArticlesService],
    }).compile();

    controller = module.get<ArticlesController>(ArticlesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

describe('ArticlesController routes', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [ArticlesModule],
    }).compile();
    app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('creates, reads, updates, and deletes articles by UUID', async () => {
    const response = await request(app.getHttpServer())
      .post('/articles')
      .send({ title: 'Artikel pertama', content: 'Isi artikel pertama' })
      .expect(201);
    const id: unknown = response.body.id;
    expect(id).toEqual(expect.stringMatching(/^[0-9a-f-]{36}$/));
    if (typeof id !== 'string') {
      throw new Error('Article ID must be a string');
    }

    await request(app.getHttpServer())
      .get(`/articles/${id}`)
      .expect(200)
      .expect(({ body }) => expect(body.title).toBe('Artikel pertama'));
    await request(app.getHttpServer())
      .patch(`/articles/${id}`)
      .send({ title: 'Artikel baru' })
      .expect(200)
      .expect(({ body }) => expect(body.title).toBe('Artikel baru'));
    await request(app.getHttpServer()).delete(`/articles/${id}`).expect(204);
    await request(app.getHttpServer()).get(`/articles/${id}`).expect(404);
  });

  it('rejects invalid article data', async () => {
    await request(app.getHttpServer())
      .post('/articles')
      .send({ title: 'A', content: 'short' })
      .expect(400);
  });
});
