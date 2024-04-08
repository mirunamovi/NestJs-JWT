import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login.dto';
import { CreateAuthDto } from './dto/create-auth.dto';
import { User } from 'src/users/entities/user.entity';
import { TokenBlacklistService } from './token-blacklist.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto/users.dto';
import { AccessTokenGuard } from './strategy/accessToken.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) { }

  // @Post('register')
  // @UsePipes(new ValidationPipe())
  // public async register(@Body() createUserDto: CreateUserDto) {
  //   const result = await this.authService.signUp(createUserDto);

  //   if (!result.success) {
  //     throw new HttpException(result, HttpStatus.BAD_REQUEST);
  //   }
  //   throw new HttpException(result, HttpStatus.OK);
  // }

  // @UseGuards(AuthGuard('local'))
  // @Post('login')
  // async login(@Req() req) {
  //   return this.authService.login(req.user);
  // }

  @UseGuards(AuthGuard('jwt'))
  @Get('test')
  async test() {
    return 'test';
  }

  @Post('signup')
  @UsePipes(new ValidationPipe())
  async signup(@Body() createUserDto: CreateUserDto) {
    const result = await this.authService.signUp(createUserDto);

    if (!result.success) {
      throw new HttpException(result, HttpStatus.BAD_REQUEST);
    }
    throw new HttpException(result, HttpStatus.OK);
  }

  @UseGuards(AuthGuard('local'))
  @Post('signin')
  signin(@Body() data: CreateAuthDto) {
    return this.authService.signIn(data);
  }

  @UseGuards(AccessTokenGuard)
  @Get('logout')
  logout(@Req() req) {
    this.authService.logout(req.user);
  }
}