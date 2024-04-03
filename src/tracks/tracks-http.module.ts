import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { TracksModule } from './tracks.module';
import { TracksService } from './tracks.service';
import { TracksController } from './tracks.controller';
import { UserRepository } from 'src/users/user.repository';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { AuthGuard } from 'src/auth/auth.guard';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    AuthModule,
    TracksModule
  ],
  providers: [
    UserRepository, 
    TracksService,
    AuthGuard,
    JwtService, 
    Reflector],
  controllers: [TracksController],
  exports: [JwtService, TracksService]
})
export class TracksHttpModule {}
