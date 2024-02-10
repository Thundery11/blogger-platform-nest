import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../../users/module/users.module';
import { jwtConstants } from '../../../settings/app-settings';
import { AuthService } from '../application/auth.service';
import { AuthGuard } from '../../../infrastucture/guards/auth.guard';
import { AuthContoller } from '../api/auth.controller';

@Module({
  imports: [
    UsersModule,
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
  ],
  controllers: [AuthContoller],
  exports: [AuthService],
})
export class AuthModule {}
