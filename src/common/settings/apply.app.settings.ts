import { INestApplication, ValidationPipe } from '@nestjs/common';

export const setAppPipes = (app: INestApplication) => {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      stopAtFirstError: true,

      exceptionFactory: (errors) => {
        const customErrors = [];
        errors.forEach((e) => {
          const constraintKeys = Object.keys(e.constraints);
          constraintKeys.forEach((cKey) => {
            const msg = e.constraints[cKey];
            customErrors.push({ key: e.property, message: msg });
          });
        });
      },
    }),
  );
};
