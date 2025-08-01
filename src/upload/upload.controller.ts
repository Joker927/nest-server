import { Controller, Post, UploadedFile, UseInterceptors, Body, Delete } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { Public } from '../utils/public.decorator';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) { }

  @Post('image')
  @Public()
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    const obj = await this.uploadService.uploadImage(file);
    return {
      url: obj.secure_url,
      publicId: obj.public_id,
    };
  }

  @Post('deleteImage')
  @Public()
  async deleteImage(@Body('publicId') publicId: string) {
    const result = await this.uploadService.deleteImage(publicId);
    return { result };
  }
} 