import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../../users/module/users.module';
import { AuthService } from '../application/auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from '../strategies/local.strategy';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { AuthController } from '../api/auth.controller';
import { BasicStrategy } from '../strategies/basic.strategy';
import { jwtConstants } from '../constants/constants';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [
    CqrsModule,
    UsersModule,
    PassportModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.JWT_SECRET,
      signOptions: { expiresIn: '1000m' },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, BasicStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
