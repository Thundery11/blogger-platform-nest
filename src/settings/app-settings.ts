// import { config } from 'dotenv';

import { BadRequestException, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { HttpExceptionFilter } from '../infrastucture/exception-filters/exception.filter';

// config();

// export type EnvironmentVariable = { [key: string]: string | undefined };
// export type EnvironmentsTypes =
//   | 'DEVELOPMENT'
//   | 'STAGING'
//   | 'PRODUCTION'
//   | 'TESTING';
// export const Environments = ['DEVELOPMENT', 'STAGING', 'PRODUCTION', 'TESTING'];

// export class EnvironmentSettings {
//   constructor(private env: EnvironmentsTypes) {}

//   getEnv() {
//     return this.env;
//   }

//   isProduction() {
//     return this.env === 'PRODUCTION';
//   }

//   isStaging() {
//     return this.env === 'STAGING';
//   }

//   isDevelopment() {
//     return this.env === 'DEVELOPMENT';
//   }

//   isTesting() {
//     return this.env === 'TESTING';
//   }
// }

// class AppSettings {
//   constructor(
//     public env: EnvironmentSettings,
//     public api: APISettings,
//   ) {}
// }

// class APISettings {
//   // Application
//   public readonly APP_PORT: number;

//   // Database
//   public readonly MONGO_CONNECTION_URI: string;

//   constructor(private readonly envVariables: EnvironmentVariable) {
//     // Application
//     this.APP_PORT = this.getNumberOrDefault(envVariables.APP_PORT!, 7840);

//     // Database
//     this.MONGO_CONNECTION_URI =
//       envVariables.MONGO_CONNECTION_URI ?? 'mongodb://localhost/nest';
//   }

//   private getNumberOrDefault(value: string, defaultValue: number): number {
//     const parsedValue = Number(value);

//     if (isNaN(parsedValue)) {
//       return defaultValue;
//     }

//     return parsedValue;
//   }
// }

// const env = new EnvironmentSettings(
//   (Environments.includes(process.env.ENV!.trim())
//     ? process.env.ENV!.trim()
//     : 'DEVELOPMENT') as EnvironmentsTypes,
// );

// const api = new APISettings(process.env);
// export const appSettings = new AppSettings(env, api);

export const appSettings = (app) => {
  app.enableCors();
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      transform: true,
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
};
