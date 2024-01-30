import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setAppPipes } from './common/settings/apply.app.settings';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setAppPipes(app);

  app.enableCors();
  await app.listen(3000);
}
bootstrap();
