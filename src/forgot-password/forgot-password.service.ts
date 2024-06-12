import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { MailerService } from '@nestjs-modules/mailer';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ForgotPasswordService {
  constructor(
    private readonly usersService: UsersService,
    private readonly mailerService: MailerService,
  ) {}

  async sendPasswordResetEmail(email: string): Promise<void> {
    const token = await this.usersService.setResetToken(email);
    const resetUrl = `http://192.168.0.109:4000/forgot-password?token=${token}`;
    

    await this.mailerService.sendMail({
      to: email,
      from: process.env.MAIL_USER, // sender address
      subject: 'Password Reset Request',
    //  template: './reset-password', // The name of the template file without extension
    //  context: { // Data to be sent to template
      //  resetUrl,
      text: 'welcome', // plaintext body
      html: '<b>welcome</b><a></a>' // HTML body content
      

    });
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.usersService.validateResetToken(token);
    if (!user) {
      throw new Error('Invalid or expired password reset token');
    }

    await this.usersService.updatePassword(user, newPassword);
  }
}