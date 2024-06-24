import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { MailerService } from '@nestjs-modules/mailer';
import { v4 as uuidv4 } from 'uuid';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';
import * as bcrypt from 'bcryptjs';
//import { nanoid } from 'nanoid';

@Injectable()
export class ForgotPasswordService {
  constructor(
    private readonly usersService: UsersService,
    private readonly mailerService: MailerService,
  ) {}

  async sendPasswordResetEmail(email: string): Promise<void> {

    console.log("sendPasswordResetEmail.email: " + email);
    
    const { nanoid } = require('nanoid');
    const passCode = nanoid(6); ///////////////////

    const token = await this.usersService.setResetToken(email, passCode);
   // const resetUrl = `http://192.168.0.106:4000/forgot-password?token=${token}`;
   // let newpassword = "12345678";
   console.log("sendPasswordResetEmail.passCode: " + passCode);
   console.log("sendPasswordResetEmail.token: " + token);

    await this.mailerService.sendMail({
      to: email,
      from: process.env.MAIL_USER, // sender address
      subject: 'Password Reset Request',
    //  template: './reset-password', // The name of the template file without extension
    //  context: { // Data to be sent to template
      //  resetUrl,
      text: 'New temporary password', // plaintext body
    
      // html: `

      // <body>
      //   <h1 style="color: green">Hello from PeakGeek</h1>
      //   <p></p>
      //   <p>Please click below if you want to reset your password</p>
      //   <button onclick=\"send()\">Reset</button>
      //   <p><a>The new password is: ${newpassword} </a></p>
      //   <p>You can change your password after login</p>
      //   <p>If you did not request the change you can safely ignore it.</p>   
        
        
      //   <script type=\"text/javascript\">
      //     function send() {
      //         const json = {
      //             "email": "${email}",
      //             "password" : "${newpassword}",
      //         };

      //       fetch("http://192.168.0.106:4000/forgot-password/reset-password/", {
      //           method: "POST",
      //           headers: {
      //               "Content-Type": "application/json",
      //             },
      //           body: JSON.stringify(json),
      //         });
      //       }
      //     </script>

      // </body>
      // `
    //  html: `
    //   <p>Hello from PeakGeek,</p>
    //   <p>Please click below if you want to reset your password</p>
    //   <form action="${resetUrl}" method="post" enctype='json'>
    //           <input type="submit"  />
    //   </form>
    //   <p><a>The new password is: ${passCode} </a></p>
    //   <p>You can change your password after login</p>
    //   <p>If you did not request the change you can safely ignore it.</p>
    //   `
    html: `
    <p>Hello from PeakGeek,</p>
    <p><a>The new password is: ${passCode} </a></p>
    <p>You can change this password after login</p>
    <p>If you did not request the change you can safely ignore it.</p>
    `

    });
    
  }

  async resetPassword(email: string, newPassword: string): Promise<void> {
    console.log("email in resetpassword fp " +     email);

    const user = await this.usersService.findOneByEmail(email);
    console.log("user in resetpassword fp " + user);
    console.log("newPassword in resetpassword fp " + newPassword);
    let newPassword_h =  newPassword;
    newPassword_h = await bcrypt.hash(newPassword, 10);

    await this.usersService.updatePassword(user, newPassword_h);
  }

  async resetPasswordCode(email: string, passCode: string): Promise<void> {
    console.log("email in resetPasswordCode fp " +     email);
    console.log("passCode in resetPasswordCode fp " +     passCode);

    let resetToken =  passCode;
    resetToken = await bcrypt.hash(passCode, 10);

    const user = await this.usersService.findOneByEmail(email);

    console.log("resetToken in resetPasswordCode fp " +     resetToken);

    const validUser = await this.usersService.validateResetToken(email, passCode);
    //const validUser = await this.usersService.validateResetToken(resetToken);


    let newPassword_h =  passCode;

    console.log("user in resetPasswordCode fp " +     user);
    console.log("validUser in resetPasswordCode fp " +     validUser);


    if ((validUser) && (user)) {

      console.log("user._id in resetPasswordCode fp " +     user._id);
      console.log("validUser._id in resetPasswordCode fp " +     validUser._id);


      if(validUser._id.equals(user._id)) {

         newPassword_h = await bcrypt.hash(passCode, 10);
         await this.usersService.updatePassword(user, newPassword_h);  

      } else {
        throw new Error('User not valid');
     }
    }else {
      throw new Error('Code not valid');
    }  

  }

}
