import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectId } from 'mongodb';
import { Track } from './entities/track.entity';
import { TrackRepository } from './track.repository';
import { User } from 'src/users/entities/user.entity';
import { CreateTrackDto } from './dto/create-track.dto';
import { UserRepository } from '../users/user.repository';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

@Injectable()
export class TracksService extends TypeOrmCrudService<Track> {
  constructor(
    @InjectRepository(Track) track,
    @InjectRepository(Track)
    private trackRepository: TrackRepository,
  ) {
    super(track);
  }

  async findAll(): Promise<Track[]> {
    return this.trackRepository.find();
  }

  async findById(trackId: ObjectId): Promise<Track | undefined> {
    return await this.trackRepository.findOne({
      where: { _id: new ObjectId(trackId) },
    });
  }

  async findByTitleAndFileName(title: string, fileName: string): Promise<Track | undefined> {
    return await this.trackRepository.findOne({
      where: { title: title, fileName:fileName },
    });
  }

  async findByUserId(user: User): Promise<Track[]> {
    return this.trackRepository.find({ where: { user: user } }); // Assuming your Track entity has a userId field
  }

  async delete(trackId: ObjectId): Promise<void> {
    await this.trackRepository.delete(trackId);
  }

  

  async create(track: Track): Promise<Track> {
    const createdTrack = this.trackRepository.create(track);
    console.log('Task created' + createdTrack.user);
    return await this.trackRepository.save(createdTrack);
  }

  async updateThumbnail(track: Track): Promise<Track> {
    return await this.trackRepository.save(track);
  }

  mapDtoToTrack(trackDto: CreateTrackDto, user: User, fileName: string, thumbnail: string): Track {
    let track;
    track = { ...trackDto, user: user, fileName: fileName, thumbnail: thumbnail};
    return track;
  }

  nameFromDto(trackDto: CreateTrackDto): string {
    let track;
    track = trackDto.title;
    return track;
  }

}
