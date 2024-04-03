import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Track } from './entities/track.entity';
import { User } from 'src/users/entities/user.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Track]),
  TypeOrmModule.forFeature([User])],
  exports: [TypeOrmModule]
})
export class TracksModule {}