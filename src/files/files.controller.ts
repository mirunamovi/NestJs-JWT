import { Controller, Get, Param, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { join } from 'path';

@ApiTags('uploads')
@Controller('uploads')
export class FilesController {
  @Get(':fileName')
  getFile(@Param('fileName') fileName: string, @Res() res: Response) {
    console.log("Am intrat in getFile");
    const filePath = join(__dirname, '..', '..', 'uploads', fileName);
    res.setHeader("Access-Control-Allow-Origin", "*");
    // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    // res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.sendFile(filePath);
  }
}