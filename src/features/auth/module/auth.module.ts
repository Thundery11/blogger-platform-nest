import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../../users/module/users.module';
import { AuthService } from '../application/auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from '../strategies/local.strategy';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { AuthController } from '../api/auth.controller';
import { BasicStrategy } from '../strategies/basic.strategy';
import { jwtConstants, tokensLivesConstants } from '../constants/constants';
import { CqrsModule } from '@nestjs/cqrs';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { LoginUserUseCase } from '../application/use-cases/login-user-use-case';
import { MongooseModule } from '@nestjs/mongoose';
import {
  SecurityDevices,
  SecurityDevicesSchema,
} from '../../security-devices/domain/security-devices-entity';
import { SecurityDevicesRepository } from '../../security-devices/infrastructure/security-devices.repository';
import { SecurityDevicesService } from '../../security-devices/application/security-devices.service';

const useCases = [LoginUserUseCase];
@Module({
  imports: [
    CqrsModule,
    UsersModule,
    PassportModule,
    ThrottlerModule.forRoot([
      {
        ttl: 10000,
        limit: 5,
      },
    ]),
    JwtModule.register({
      global: false,
      secret: jwtConstants.JWT_SECRET,
      signOptions: { expiresIn: tokensLivesConstants['10sec'] },
    }),
    MongooseModule.forFeature([
      {
        name: SecurityDevices.name,
        schema: SecurityDevicesSchema,
      },
    ]),
  ],

  providers: [
    AuthService,
    LocalStrategy,
    SecurityDevicesRepository,
    SecurityDevicesService,
    ...useCases,
    JwtStrategy,
    BasicStrategy,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
