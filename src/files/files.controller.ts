import { Controller, Get, Param, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { join } from 'path';

@ApiTags('uploads')
@Controller('uploads')
export class FilesController {
  @Get(':fileName')
  getFile(@Param('fileName') fileName: string, @Res() res: Response) {
    res.sendFile(fileName, { root: 'uploads'});

  }
}