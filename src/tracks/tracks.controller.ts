import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TracksService } from './tracks.service';
import { CreateTrackDto } from './dto/create-track.dto';
// import { AuthGuard } from 'src/auth/auth.guard';
import { Track } from './entities/track.entity';
import { ApiTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('tracks')
@Controller('tracks')
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  // @Get()
  // findAll() {
  //   return this.tracksService.findAll();
  // }

  @Get()
  @UseGuards(AuthGuard())
  async get(@Req() req): Promise<Track[]> {
    const userId = req.user.sub; // Assuming req.user.sub holds the user ID
    return this.tracksService.findByUserId(userId);
  }

  @Post()
  @UseGuards(AuthGuard())
  async create(@Body() trackDto: CreateTrackDto, @Req() req): Promise<Track> {
    const user = req.user.sub; // Extract user ID from the token
    const track: Track = this.tracksService.mapDtoToTrack(trackDto, user);
    
    return this.tracksService.create(track);
  }

  
  
}
