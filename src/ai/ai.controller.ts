import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { Public } from '../utils/public.decorator';
import { ChatDto } from './dto/chat.dto';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Public()
  @Post('chat')
  async chat(@Body() body: ChatDto, @Res() res: Response) {
    const sessionId = body.sessionId || 'default';

    if (body.stream) {
      res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache, no-transform');
      res.setHeader('Connection', 'keep-alive');
      res.flushHeaders();

      await this.aiService.chatStream(body.prompt, sessionId, (token) => {
        res.write(`data: ${JSON.stringify({ token })}\n\n`);
      });

      res.write('data: [DONE]\n\n');
      res.end();
      return;
    }

    const result = await this.aiService.chat(body.prompt, sessionId);
    return res.json(result);
  }
}
