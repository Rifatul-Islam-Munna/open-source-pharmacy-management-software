import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import helmet from 'helmet';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import  compression from 'compression';
import { AllExceptionsFilter } from 'lib/all-exceptions.filter';
import { json, urlencoded } from 'express';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(compression());
  app.use(helmet());
  app.enableCors({origin: true, credentials: true,optionsSuccessStatus: 200});
  app.use(cookieParser());
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true, limit: '10mb' }));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );
  app.useGlobalFilters(new AllExceptionsFilter())
 

  // Only setup Swagger if not in watch mode
  if (process.env.NODE_ENV !== 'development' || process.env.ENABLE_SWAGGER === 'true') {
    const config = new DocumentBuilder()
      .setTitle('pharmacy example')
      .setDescription('The pharmacy description')
      .setVersion('1.0')
      .addTag('pharmacy')
      .build();
    
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, documentFactory);
  }
  await app.listen(process.env.PORT ??4000);
}
bootstrap();
