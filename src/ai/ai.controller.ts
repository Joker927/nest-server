import { Body, Controller, Post } from '@nestjs/common';
import { Public } from '../utils/public.decorator';
import { ChatDto } from './dto/chat.dto';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Public()
  @Post('chat')
  async chat(@Body() body: ChatDto) {
    return this.aiService.chat(body.prompt);
  }
}
