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
  Delete,
  HttpException,
  HttpStatus,
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
import * as fs from 'fs';

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

  @Delete(':trackId')
  @UseGuards(AuthGuard())
  async deleteTrack(@Param('trackId') trackId: ObjectId): Promise<void> {
    return await this.tracksService.delete(trackId);
     
  }

  @Post('upload')
  @UseGuards(AuthGuard())
    @UseInterceptors(FileInterceptor('file', {
      storage: diskStorage({
        destination: "./uploads",
        filename: (req, file, cb) => {
          const name = file.originalname;
          const newFileName = name.split(" ").join("_");

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
        throw new BadRequestException("File is not an gpx file.");
      } else {

        const title = this.tracksService.nameFromDto(trackDto);
        const fileName = `${title}.gpx`;

        const user = req.user.sub;
        const track: Track = this.tracksService.mapDtoToTrack(trackDto, user, fileName);
        return this.tracksService.create(track);


      }
    }

    @Delete('uploads/:fileName')
    async deleteFile(@Param('fileName') fileName: string | undefined) {
      console.log("am intrat in controller");
      const filePath =`C:/Users/Miruna/Desktop/Backend/backend-gpx/uploads/${fileName}`; // Construct file path using string interpolation
    
      try {
        await fs.promises.unlink(filePath); // Use promises to handle async operation
        return { message: 'File deleted successfully' };
      } catch (err) {
        console.error(`Error deleting file: ${err.message}`);
        throw new HttpException('File not found', HttpStatus.NOT_FOUND);
      }
    }
    

    @Get('uploads/filename')
    async getTracks(@Param('filename') filename, @Res() res: Response){

      res.sendFile(filename, {root: './uploads'});
    }

  
  
}
