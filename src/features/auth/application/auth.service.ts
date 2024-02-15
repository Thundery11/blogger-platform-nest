import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/application/users.service';
import bcrypt from 'bcrypt';
import { Types } from 'mongoose';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(loginOrEmail: string, pass: string) {
    const user = await this.usersService.findUserByLoginOrEmail(loginOrEmail);
    if (!user) {
      return null;
    }
    console.log(user);
    const password = bcrypt.compareSync(pass, user?.passwordHash);
    if (!password) {
      return null;
    }

    return user;
  }

  async login(user: any) {
    const payload = { login: user.login, sub: user._id.toString() };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
