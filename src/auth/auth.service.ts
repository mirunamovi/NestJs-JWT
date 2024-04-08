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
      await this.updateRefreshToken(newUser.id, tokens.refreshToken);

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

  // async login(user: any) {
  //   const payload = { email: user.email, sub: user.id };
  //   return {
  //     access_token: this.jwtService.sign(payload),
  //   };
  // }

  async signIn(data: CreateAuthDto) {
    // Check if user exists
    const user = await this.usersService.findOneByName(data.name);
    if (!user) throw new BadRequestException('User does not exist');
    const passwordMatches = await argon2.verify(user.password, data.password);
    if (!passwordMatches)
      throw new BadRequestException('Password is incorrect');
    const tokens = await this.getTokens(user.userId, user.name);
    await this.updateRefreshToken(user.userId, tokens.refreshToken);
    return tokens;
  }

  async logout(userId: ObjectId) {
    return this.usersService.update(userId, { refreshToken: null });
  }

  hashData(data: string) {
    return argon2.hash(data);
  }


  async updateRefreshToken(userId: ObjectId, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.usersService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  async getTokens(userId: ObjectId, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
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
    const tokens = await this.getTokens(user.userId, user.name);
    await this.updateRefreshToken(user.userId, tokens.refreshToken);
    return tokens;
  }
}