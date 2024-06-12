// user.entity.ts
import { Entity, ObjectIdColumn, Column, BeforeInsert } from 'typeorm';
import { ObjectId } from 'mongodb';
import { ApiProperty } from '@nestjs/swagger';
import * as bcrypt from 'bcryptjs';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Entity({ name: 'user' }) // Specify the collection name
export class User {
  @ObjectIdColumn()
  _id: ObjectId;

  @ApiProperty()
  @Column() 
  name: string;

  @ApiProperty()
  @Column({unique: true})
  email: string;

  @ApiProperty()
  @Column()
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async comparePassword(attempt: string) {
    const isPasswordValid = await bcrypt.compare(attempt, this.password);
    return isPasswordValid;
  }

  @ApiProperty()
  @Column()
  refreshToken: string;

  @Column({ nullable: true })
  resetToken?: string;

  @Column({ nullable: true })
  resetTokenExpiration: Date;
}
