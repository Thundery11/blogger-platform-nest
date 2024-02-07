import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
// import { applyAppSettings, setAppPipes } from './settings/apply.app.settings';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // applyAppSettings(app);
  // setAppPipes(app);
  app.enableCors();
  // const config = new DocumentBuilder()
  //   .setTitle('blogger-platform')
  //   .setDescription('The blogger-platform API description')
  //   .setVersion('1.0')
  //   .addTag('blogger-platform')
  //   .build();
  // const document = SwaggerModule.createDocument(app, config);
  // SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
