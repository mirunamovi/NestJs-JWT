import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersHttpModule } from 'src/users/users-http.module';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
// import { JwtStrategy } from './strategy/jwt.strategy';
// import { JwtStrategy } from './jwt.strategy';
import { TokenBlacklistService } from './token-blacklist.service';
import { LocalStrategy } from './strategy/local.strategy';
import { AccessTokenStrategy } from './strategy/accessToken.strategy';
import { RefreshTokenStrategy } from './strategy/refreshToken.strategy';
@Module({
  imports: [
    UsersHttpModule,
    PassportModule.register({defaultStrategy: 'jwt'}),
    // JwtModule.registerAsync({
    //   inject: [ConfigService],
    //   useFactory: (config: ConfigService) => {
    //     return {
    //       secret: config.get<string>('JWT_SECRET'),
    //       signOptions: {
    //         expiresIn: config.get<string | number>('JWT_EXPIRES')

    //     }
    //   }
    // }}),
    JwtModule.register({}),
    MongooseModule
  ],
  providers: [
    AuthService,
    TokenBlacklistService,
    // JwtStrategy, 
    LocalStrategy,
    AccessTokenStrategy, RefreshTokenStrategy
  ],
  controllers: [AuthController],
  exports: [AuthService, AccessTokenStrategy, RefreshTokenStrategy, LocalStrategy, PassportModule],
})
export class AuthModule {}