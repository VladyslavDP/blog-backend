import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { AllExceptionsFilter } from '@app/common/filters';
import { TagModule } from '@app/modules/tag/tag.module';
import { PostModule } from '@app/modules/post/post.module';
import { AuthModule } from '@app/modules/auth/auth.module';
import { StorageModule } from '@app/modules/storage/storage.module';

async function bootstrap() {
  initializeTransactionalContext();

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    allowedHeaders: '*',
    methods: '*',
    credentials: true,
    exposedHeaders: ['Content-Disposition'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  const httpAdapter = app.get(HttpAdapterHost);

  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  const swaggerDocs = [
    {
      title: 'Blog Core API',
      description: 'Blog Core API description',
      version: 'v1',
      endpoint: 'swagger',
      include: [TagModule, AuthModule, PostModule, StorageModule],
    },
  ];

  const apiPrefix = process.env.API_PREFIX;

  swaggerDocs.forEach((doc) => {
    const config = new DocumentBuilder()
      .setTitle(doc.title)
      .setDescription(doc.description)
      .setVersion(doc.version)
      .addBearerAuth({ name: 'api', type: 'http', in: 'header' })
      .build();

    const document = SwaggerModule.createDocument(app, config, {
      include: doc.include,
    });

    SwaggerModule.setup(
      apiPrefix ? apiPrefix + '/' + doc.endpoint : doc.endpoint,
      app,
      document,
      {
        jsonDocumentUrl: apiPrefix
          ? apiPrefix + '/' + doc.endpoint
          : doc.endpoint + '/json',
      },
    );
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
