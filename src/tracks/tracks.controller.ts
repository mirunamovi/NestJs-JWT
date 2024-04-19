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

@Crud({
  model: {
    type: Track,
  },
})
@ApiTags('tracks')
@Controller('tracks')
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  @Get()
  findAll() {
    return this.tracksService.findAll();
  }

  @Post()
  @UseGuards(AuthGuard())
  async create(@Body() trackDto: CreateTrackDto, @Req() req): Promise<Track> {
    const user = req.user; // Extract user ID from the token
    console.log(req);
    const track: Track = this.tracksService.mapDtoToTrack(trackDto, user);
    return this.tracksService.create(track);
  }

}
