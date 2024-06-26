import { BadRequestException, ForbiddenException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
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
import { MailerService } from '@nestjs-modules/mailer';
import { v4 as uuidv4 } from 'uuid';


@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService, 
    private jwtService: JwtService,
    private configService: ConfigService,
    private readonly mailerService: MailerService

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

  async signIn(data: CreateAuthDto) {
    const user = await this.usersService.findOneByEmail(data.email);
    const { accessToken, refreshToken } = await this.getTokens(user._id, user.name);
    return {
      accessToken,
      refreshToken,
    };
  }


  async logout() {
    console.log("am intrat in logout din authservice backend");
    return {};
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
          expiresIn: '1d',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          name,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '2d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken
    };
  }

  async refreshTokens(userId: ObjectId, refreshToken: string) {
    const user = await this.usersService.findById(userId);
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');
    const refreshTokenMatches = await argon2.verify(
      user.refreshToken,
      refreshToken,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(user._id, user.email);
    await this.updateRefreshToken(user.email, tokens.refreshToken);
    return tokens;
  }

}