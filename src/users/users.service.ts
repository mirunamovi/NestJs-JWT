// user.service.ts
import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { User, UserDocument } from './entities/user.entity';
import { ObjectId } from 'mongodb';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/users.dto';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { UpdateUserDto } from './dto/updateUser.dto';
import { Console } from 'console';
import * as crypto from 'crypto';

@Injectable()
export class UsersService extends TypeOrmCrudService<User>{
  constructor(
    @InjectRepository(User) user,
    @InjectRepository(User)
    private userRepository: UserRepository,
  ) {
    super(user)
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOneByName(username: string): Promise<User | undefined> {
    return this.userRepository.findOneBy({name: username});
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOneBy({email: email});
  }


  async findById(userId: ObjectId): Promise<User | undefined> {
    console.log("userId in findbyid: " + userId);
    try {
      // let user = await this.userRepository.findOneBy( {userId: userId });
      let user = await this.userRepository.findOne({
        where: { _id: new ObjectId(userId)}
      });
      if (!user) {
        console.log("User not found in findById");
      }
      return user;

    } catch (error) {
      console.error("Error finding user:", error);
      throw error; // Rethrow or handle as needed
    }
  }



  public async register(userDto: CreateUserDto): Promise<any> {
    const { email } = userDto;
    let user = await this.userRepository.findOne({ where: { email } });

    if (user) {
      throw new HttpException(
        'User already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    user = this.userRepository.create(userDto);
    return await this.userRepository.save(user);
  }

  async update(
    // id: ObjectId,
    email: string,
    updateUserDto: UpdateUserDto,
  ): Promise<any> {
    let user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new Error('User not found');
    }
    // Update user properties based on DTO
    if (updateUserDto.name) {
      user.name = updateUserDto.name;
    }
    if (updateUserDto.email) {
      user.email = updateUserDto.email;
    }
    if (updateUserDto.refreshToken) {
      user.refreshToken = updateUserDto.refreshToken;
    }
    // Save changes
    return await this.userRepository.save(user);
  }

  async findByResetToken(token: string): Promise<User> {
    return this.userRepository.findOne({ where: { resetToken: token } });
  }

  async setResetToken(email: string): Promise<string> {
    const user = await this.findOneByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiration = new Date();
    expiration.setHours(expiration.getHours() + 1); // Token valid for 1 hour

    user.resetToken = token;
    user.resetTokenExpiration = expiration;

    await this.userRepository.save(user);

    return token;
  }

  async validateResetToken(token: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({
      where: {
        resetToken: token,
        resetTokenExpiration: MoreThan(new Date()),
      },
    });

    return user;
  }

  async updatePassword(user: User, newPassword: string): Promise<void> {
    if(newPassword != null){
      console.log(user);
      console.log(newPassword);
      user.password = newPassword; // hash password appropriately
    // user.resetToken = null;
    // user.resetTokenExpiration = null;
    const userss = this.userRepository.create(user);

    await this.userRepository.save(userss);
    }
    
  }
}
