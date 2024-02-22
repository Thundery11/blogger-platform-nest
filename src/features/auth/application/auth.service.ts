import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/application/users.service';
import bcrypt from 'bcrypt';
import { Types } from 'mongoose';
import { UsersRepository } from '../../users/infrastructure/users.repository';
import { jwtConstants } from '../constants/constants';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private usersRepository: UsersRepository,
  ) {}

  async validateUser(loginOrEmail: string, pass: string) {
    const user = await this.usersService.findUserByLoginOrEmail(loginOrEmail);
    if (!user) {
      return null;
    }
    console.log(user);
    const password = bcrypt.compareSync(pass, user?.accountData.passwordHash);
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
  async createRefreshToken(user: any) {
    const payload = { sub: user._id.toString() };
    return await this.jwtService.signAsync(payload);
  }
  async confirmEmail(code: string): Promise<boolean> {
    const user = await this.usersRepository.findUserByConfirmationCode(code);
    if (!user) return false;
    if (user.emailConfirmation.expirationDate < new Date()) return false;
    if (user.emailConfirmation.confirmationCode !== code) return false;
    if (user.emailConfirmation.isConfirmed === true) return false;
    const result = await this.usersRepository.updateConfirmation(
      user._id.toString(),
    );
    return result;
  }

  async getUserByToken(token: string) {
    try {
      const result = this.jwtService.verify(token, {
        secret: jwtConstants.JWT_SECRET,
      });

      return result.sub;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
