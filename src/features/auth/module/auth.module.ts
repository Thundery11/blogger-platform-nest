import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../../users/module/users.module';
import { jwtConstants } from '../../../settings/app-settings';
import { AuthService } from '../application/auth.service';
import { AuthGuard } from '../../../infrastucture/guards/auth.guard';
import { AuthContoller } from '../api/auth.controller';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from '../strategies/local.strategy';
import { JwtStrategy } from '../strategies/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.JWT_SECRET,
      signOptions: { expiresIn: '10m' },
    }),
  ],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    LocalStrategy,
    JwtStrategy,
  ],
  controllers: [AuthContoller],
  exports: [AuthService],
})
export class AuthModule {}
