import { Module } from '@nestjs/common';
import { ForgotPasswordService } from './forgot-password.service';
import { ForgotPasswordController } from './forgot-password.controller';
import { UsersHttpModule } from 'src/users/users-http.module';

@Module({
  imports: [
    UsersHttpModule
  ],
  providers: [ForgotPasswordService],
  controllers: [ForgotPasswordController],
})
export class ForgotPasswordModule {}