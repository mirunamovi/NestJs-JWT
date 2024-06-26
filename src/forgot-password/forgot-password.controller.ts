import { Controller, Post, Body } from '@nestjs/common';
import { ForgotPasswordService } from './forgot-password.service';
import { ForgotPasswordDto} from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import * as bcrypt from 'bcryptjs';

@Controller('forgot-password')
export class ForgotPasswordController {
  constructor(private readonly forgotPasswordService: ForgotPasswordService) {}

  @Post('send-mail')
  async sendResetLink(@Body() forgotPasswordDto: ForgotPasswordDto) {
    await this.forgotPasswordService.sendPasswordResetEmail(forgotPasswordDto.email);
    return { message: 'Password reset link sent' };
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    // let password =  resetPasswordDto.password;
    // password= await bcrypt.hash(resetPasswordDto.password, 10);
    console.log("resetPassword.password: " + resetPasswordDto.password);

    await this.forgotPasswordService.resetPassword(resetPasswordDto.email, resetPasswordDto.password);
    return { message: 'Password reset successful' };
  }
  
  @Post('submit-code')
  async submitCode(@Body() resetPasswordDto: ResetPasswordDto) {
    console.log("submitCode.email: " + resetPasswordDto.email);
    console.log("submitCode.password: " + resetPasswordDto.password);   
    await this.forgotPasswordService.resetPasswordCode(resetPasswordDto.email, resetPasswordDto.password);
    return { message: 'Code sent' };
  }




}
