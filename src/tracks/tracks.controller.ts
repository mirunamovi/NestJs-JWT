import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  UploadedFile,
  BadRequestException,
  Param,
  Res,
  UseInterceptors,
  NotFoundException,
} from '@nestjs/common';
import { TracksService } from './tracks.service';
import { CreateTrackDto } from './dto/create-track.dto';
// import { AuthGuard } from 'src/auth/auth.guard';
import { Track } from './entities/track.entity';
import { ApiTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Response } from 'express'; // Make sure to import from 'express'
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { ObjectId } from 'typeorm';

@ApiTags('tracks')
@Controller('tracks')
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  @Get()
  @UseGuards(AuthGuard())
  async get(@Req() req): Promise<Track[]> {
    const userId = req.user.sub; // Assuming req.user.sub holds the user ID

    return this.tracksService.findByUserId(userId);
  }

  @Get(':trackId')
  @UseGuards(AuthGuard())
  async getTrack(@Param('trackId') trackId: ObjectId): Promise<Track> {
    const track = await this.tracksService.findById(trackId);
    if (!track) {
      throw new NotFoundException('Track not found');
    }
    else{
      console.log(track);
    }
    return track;
  }


  // async getTrack(url:string):Promise<Blob> {

  // }



  // @Post()
  // @UseGuards(AuthGuard())
  // async create(@Body() trackDto: CreateTrackDto, @Req() req): Promise<Track> {
  //   const user = req.user.sub; // Extract user ID from the token
  //   const title = this.tracksService.nameFromDto(trackDto);
  //   const filePath = `http://192.168.0.105:4000/uploads/${title}.gpx`;
  //   const track: Track = this.tracksService.mapDtoToTrack(trackDto, user, filePath);
  //   return this.tracksService.create(track);
  // }


  @Post('upload')
  @UseGuards(AuthGuard())
    @UseInterceptors(FileInterceptor('file', {
      storage: diskStorage({
        destination: "./uploads",
        filename: (req, file, cb) => {
          const name = file.originalname.split(".")[0];
          const fileExtension =  file.originalname.split(".")[1];
          const newFileName = name.split(" ").join("_") + "_" + "." + fileExtension;

          cb(null, newFileName);
        }
      }),
      fileFilter: (req, file, cb) => {
        if(!file.originalname.match(/\.(jpg|jpeg|png|gif|gpx)$/)){
          return cb(null, false);
        }
        cb(null, true);
      }
    }))
    async uploadFile(@UploadedFile() file: Express.Multer.File, @Body() trackDto: CreateTrackDto, @Req() req): Promise<Track>  {
      if(!file){
        throw new BadRequestException("File is not an image");
      } else {

        const title = this.tracksService.nameFromDto(trackDto);
        const filePath = `http://192.168.0.109:4000/uploads/${title}.gpx`;
        // const filePath = `http://192.168.46.213:4000/uploads/${title}.gpx`;
        // const filePath = `http://localhost:4000/uploads/${title}.gpx`;


        const user = req.user.sub;
        const track: Track = this.tracksService.mapDtoToTrack(trackDto, user, filePath);
        return this.tracksService.create(track);


      }
    }
    

    @Get('uploads/filename')
    async getTracks(@Param('filename') filename, @Res() res: Response){

      res.sendFile(filename, {root: './uploads'});
    }

  
  
}
