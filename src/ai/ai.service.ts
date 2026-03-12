import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AiService {
  constructor(private readonly configService: ConfigService) {}

  async chat(prompt: string) {
    const apiKey = this.configService.get<string>('ARK_API_KEY');
    const model = this.configService.get<string>('ARK_MODEL');
    const baseUrl =
      this.configService.get<string>('ARK_BASE_URL') ||
      'https://ark.cn-beijing.volces.com/api/v3';

    if (!apiKey || !model) {
      throw new HttpException(
        '请配置 ARK_API_KEY 和 ARK_MODEL 环境变量',
        HttpStatus.BAD_REQUEST,
      );
    }

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new HttpException(
        `方舟模型调用失败: ${errorText}`,
        HttpStatus.BAD_GATEWAY,
      );
    }

    const payload = await response.json();
    const answer = payload?.choices?.[0]?.message?.content;

    if (!answer) {
      throw new HttpException('方舟模型返回为空', HttpStatus.BAD_GATEWAY);
    }

    return {
      model,
      answer,
      usage: payload?.usage || null,
    };
  }
}
