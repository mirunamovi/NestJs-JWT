import { User } from 'src/users/entities/user.entity';
import { Entity, ObjectIdColumn, ObjectId, Column, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@Entity({ name: 'tracks' }) // Specify the collection name
export class Track {

  @ApiProperty()
  @Column()
  user: User;

  @ObjectIdColumn() // Define the primary key as an ObjectId
  _id: ObjectId;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column()
  fileName: string;

  @ApiProperty()
  @Column()
  thumbnail?: string;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamp' }) // Automatically set the createdAt field
  createdAt: Date;
}