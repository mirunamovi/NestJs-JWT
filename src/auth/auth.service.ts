import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/entities/user.entity';
import { CreateAuthDto } from './dto/create-auth.dto';
import { RegistrationStatus } from './registrationStatus.interface';
import { CreateUserDto } from 'src/users/dto/users.dto';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { ObjectId } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService, 
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signUp(user: CreateUserDto) {
    let status: RegistrationStatus = {
      success: true,
      message: 'user register',
    };

    try {
      const newUser = await this.usersService.register(user);
      const tokens = await this.getTokens(newUser.id, newUser.name);
      // await this.updateRefreshToken(newUser.id, tokens.refreshToken);
    } catch (err) {
      status = { success: false, message: err.message };
    }
    return status;
  }


  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);

    if (user && await user.comparePassword(password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  // async signIn(data: CreateAuthDto) {
  //   const user = await this.usersService.findOneByEmail(data.email);
  //   const tokens = await this.getTokens(user.userId, user.name);
  //   await this.updateRefreshToken(user.email, tokens.refreshToken);
  //   return tokens;
  // }

  async signIn(data: CreateAuthDto) {
    const user = await this.usersService.findOneByEmail(data.email);
    const { accessToken, refreshToken } = await this.getTokens(user.userId, user.name);
    return {
      accessToken,
      refreshToken,
    };
  }

  async logout(email: string) {
    return this.usersService.update(email, { refreshToken: null });
  }

  hashData(data: string) {
    return argon2.hash(data);
  }


  async updateRefreshToken(email: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.usersService.update(email, {
      refreshToken: hashedRefreshToken,
    });
  }

  async getTokens(userId: ObjectId, name: string) {

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          name,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          name,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(userId: ObjectId, refreshToken: string) {
    const user = await this.usersService.findOneById(userId);
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');
    const refreshTokenMatches = await argon2.verify(
      user.refreshToken,
      refreshToken,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(user.userId, user.email);
    await this.updateRefreshToken(user.email, tokens.refreshToken);
    return tokens;
  }
}