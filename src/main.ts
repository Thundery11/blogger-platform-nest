import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { applyAppSettings, setAppPipes } from './settings/apply.app.settings';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // applyAppSettings(app);
  // setAppPipes(app);
  app.enableCors();
  const config = new DocumentBuilder()
    .setTitle('blogger-platform')
    .setDescription('The blogger-platform API description')
    .setVersion('1.0')
    .addTag('blogger-platform')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();
