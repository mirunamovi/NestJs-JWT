import { Module } from '@nestjs/common';
import { UsersModule } from './users.module';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AppService } from 'src/app.service';
import { AppController } from 'src/app.controller';

@Module({
  imports: [UsersModule],
  providers: [UsersService, AppService],
  controllers: [UsersController, AppController],
  exports: [UsersService]
})
export class UsersHttpModule {}
