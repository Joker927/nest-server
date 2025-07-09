import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { Public } from '../utils/public.decorator';

@Controller('internal/upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) { }

  @Post('image')
  @Public()
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    const url = await this.uploadService.uploadImage(file);
    return { url };
  }
} 