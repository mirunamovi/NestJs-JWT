import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectId } from 'typeorm';
import { Track } from './entities/track.entity';
import { TrackRepository } from './track.repository';
import { User } from 'src/users/entities/user.entity';
import { CreateTrackDto } from './dto/create-track.dto';
import { UserRepository } from '../users/user.repository';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

@Injectable()
export class TracksService extends TypeOrmCrudService<Track>{
  constructor(
    @InjectRepository(Track) track,
    @InjectRepository(Track)
    private trackRepository: TrackRepository, 
  ) {
    super(track)
  }

  async findAll(): Promise<Track[]> {
    return this.trackRepository.find();
  }

  async findById(trackId: ObjectId): Promise<Track | undefined> {
    return this.trackRepository.findOne({ where: { trackId } });
  }

async create(track: Track): Promise<Track> {
  const createdTrack = this.trackRepository.create(track);
  return await this.trackRepository.save(createdTrack);
}

mapDtoToTrack(trackDto: CreateTrackDto, user: User): Track {
  let track;
  track = { ...trackDto, user: user }
  return track;
}

}

