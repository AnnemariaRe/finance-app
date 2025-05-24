import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './global-exception.filter';
import { join } from 'path';
import hbs from 'hbs';
import session from 'express-session';
import { UnauthorizedExceptionFilter } from './unauthorized-exception.filter';
import passport from 'passport';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = new DocumentBuilder()
    .setTitle('WalletKeeper Web App')
    .setDescription('The API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(
    new GlobalExceptionFilter(),
    new UnauthorizedExceptionFilter(),
  );

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  hbs.registerPartials(join(__dirname, '..', 'views', 'partials'));
  hbs.registerHelper('startsWith', function (str, prefix) {
    return str.startsWith(prefix);
  });

  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.use((req, res, next) => {
    res.locals.currentPath = req.path;
    next();
  });

  await app.listen(process.env.PORT ?? 3000);
  logger.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
