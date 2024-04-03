import { User } from 'src/users/entities/user.entity';
import { Entity, ObjectIdColumn, ObjectId, Column, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@Entity({ name: 'tracks' }) // Specify the collection name
export class Track {

  @ApiProperty()
  @ObjectIdColumn({ name: "user", nullable: true })
  userId: ObjectId | User

  @ObjectIdColumn() // Define the primary key as an ObjectId
  trackId: ObjectId;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamp' }) // Automatically set the createdAt field
  createdAt: Date;

}