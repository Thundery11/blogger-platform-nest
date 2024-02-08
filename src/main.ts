import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './infrastucture/exception-filters/exception.filter';
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
  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: false,
      exceptionFactory: (errors) => {
        const errorsForResponse: { message: string; field: string }[] = [];
        errors.forEach((e) => {
          const constraintsKeys = Object.keys(e.constraints!);
          constraintsKeys.forEach((cKey) => {
            errorsForResponse.push({
              message: e.constraints![cKey],
              field: e.property,
            });
          });
        });
        throw new BadRequestException(errorsForResponse);
      },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3000);
}
bootstrap();
