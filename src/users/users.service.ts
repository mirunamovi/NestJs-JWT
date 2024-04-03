// user.service.ts
import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { ObjectId } from 'mongodb';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './users.dto';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

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
}
