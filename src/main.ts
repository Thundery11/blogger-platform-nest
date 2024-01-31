import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { applyAppSettings, setAppPipes } from './settings/apply.app.settings';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // applyAppSettings(app);
  // setAppPipes(app);
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
