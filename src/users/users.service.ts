// user.service.ts
import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserDocument } from './entities/user.entity';
import { ObjectId } from 'mongodb';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/users.dto';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { UpdateUserDto } from './dto/updateUser.dto';

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

  public async findOneById(id: ObjectId): Promise<User | null> {
    return this.userRepository.findOneBy({ userId : id });
  }

  async findOneByName(username: string): Promise<User | undefined> {
    return this.userRepository.findOneBy({name: username});
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOneBy({email: email});
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
    id: ObjectId,
    updateUserDto: UpdateUserDto,
  ): Promise<any> {
    let user = await this.userRepository.findOneBy({ userId : id });

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

  // async remove(id: string): Promise<UserDocument> {
  //   return this.userRepository.findByIdAndDelete(id).exec();
  // }
}
