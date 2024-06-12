import { Controller, Post, Body } from '@nestjs/common';
import { ForgotPasswordService } from './forgot-password.service';
import { ForgotPasswordDto} from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('forgot-password')
export class ForgotPasswordController {
  constructor(private readonly forgotPasswordService: ForgotPasswordService) {}

  @Post()
  async sendResetLink(@Body() forgotPasswordDto: ForgotPasswordDto) {
    await this.forgotPasswordService.sendPasswordResetEmail(forgotPasswordDto.email);
    return { message: 'Password reset link sent' };
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    await this.forgotPasswordService.resetPassword(resetPasswordDto.token, resetPasswordDto.newPassword);
    return { message: 'Password reset successful' };
  }
}
