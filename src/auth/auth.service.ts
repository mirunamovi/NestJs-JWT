import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/entities/user.entity';
import { CreateAuthDto } from './dto/create-auth.dto';
import { RegistrationStatus } from './registrationStatus.interface';
import { CreateUserDto } from 'src/users/users.dto';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService, 
    private jwtService: JwtService) {}

  // async login(loginAuthDto: LoginAuthDto): Promise<{ token: string }> {
  //   const { email, password } = loginAuthDto;

  //   const user = await this.usersService.findOneByEmail(email);
  //   if(!user){
  //     throw new UnauthorizedException('Invalid email');
  //   }

  //   const isPasswordMatched = await bcrypt.compare(password, user.password);

  //   if(!isPasswordMatched){
  //     throw new UnauthorizedException('Invalid password');
  //   }
  //   const token = this.jwtService.sign({id: user.userId})
  //   console.log(token);
  //   // return { token };
  //   return {token}
  // }


  // async signUp(createAuthDto: CreateAuthDto): Promise<{ token: string }> {
  //   const { name, email, password } = createAuthDto;
  
  //   // Hash the password
  //   const hashedPassword = await bcrypt.hash(password, 10);
  
  //   // Map properties from DTO to User entity
  //   const user = new User();
  //   user.name = name;
  //   user.email = email;
  //   user.password = hashedPassword;
  
  //   // Create the user in the database
  //   const createdUser = await this.usersService.create(user);
  
  //   // Generate JWT token
  //   const token = this.jwtService.sign({ id: createdUser.userId });
  
  //   // Return the token
  //   return { token };
  // }


  async register(user: CreateUserDto) {
    let status: RegistrationStatus = {
      success: true,
      message: 'user register',
    };

    try {
      await this.usersService.register(user);
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

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}