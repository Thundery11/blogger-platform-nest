import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/application/users.service';
import bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string) {
    const user = await this.usersService.findUserByLogin(username);
    if (!user) {
      throw new NotFoundException();
    }
    const password = bcrypt.compareSync(pass, user?.passwordHash);
    if (!password) {
      return null;
    }

    const { passwordHash, ...result } = user;
    return result;
  }

  async login(user: any) {
    const payload = { username: user.login, sub: user.id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
