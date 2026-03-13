import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

@Injectable()
export class AiService {
  private readonly sessionStore = new Map<string, ChatMessage[]>();
  private readonly maxHistoryMessages = 20;

  constructor(private readonly configService: ConfigService) {}

  async chat(prompt: string, sessionId = 'default') {
    const config = this.getModelConfig();
    const messages = this.buildMessages(prompt, sessionId);

    const response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: config.model,
        stream: false,
        messages,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new HttpException(
        `千问模型调用失败: ${errorText}`,
        HttpStatus.BAD_GATEWAY,
      );
    }

    const payload = await response.json();
    const answer = payload?.choices?.[0]?.message?.content;

    if (!answer) {
      throw new HttpException('千问模型返回为空', HttpStatus.BAD_GATEWAY);
    }

    this.appendAssistantReply(sessionId, answer);

    return {
      model: config.model,
      sessionId,
      answer,
      usage: payload?.usage || null,
    };
  }

  async chatStream(
    prompt: string,
    sessionId: string,
    onToken: (token: string) => void,
  ) {
    const config = this.getModelConfig();
    const messages = this.buildMessages(prompt, sessionId);

    const response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: config.model,
        stream: true,
        messages,
      }),
    });

    if (!response.ok || !response.body) {
      const errorText = await response.text();
      throw new HttpException(
        `千问流式调用失败: ${errorText}`,
        HttpStatus.BAD_GATEWAY,
      );
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let pending = '';
    let fullAnswer = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      pending += decoder.decode(value, { stream: true });
      const lines = pending.split('\n');
      pending = lines.pop() ?? '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('data:')) continue;

        const data = trimmed.replace(/^data:\s*/, '');
        if (data === '[DONE]') {
          continue;
        }

        try {
          const chunk = JSON.parse(data);
          const content = chunk?.choices?.[0]?.delta?.content;
          if (content) {
            fullAnswer += content;
            onToken(content);
          }
        } catch {
          continue;
        }
      }
    }

    if (!fullAnswer) {
      throw new HttpException('千问流式返回为空', HttpStatus.BAD_GATEWAY);
    }

    this.appendAssistantReply(sessionId, fullAnswer);

    return {
      model: config.model,
      sessionId,
      answer: fullAnswer,
    };
  }

  private getModelConfig() {
    const apiKey = this.configService.get<string>('QWEN_API_KEY');
    const model =
      this.configService.get<string>('QWEN_MODEL') || 'qwen3.5-plus';
    const baseUrl =
      this.configService.get<string>('QWEN_BASE_URL') ||
      'https://dashscope.aliyuncs.com/api/v2/apps/protocols/compatible-mode/v1';

    if (!apiKey) {
      throw new HttpException(
        '请配置 QWEN_API_KEY 环境变量',
        HttpStatus.BAD_REQUEST,
      );
    }

    return { apiKey, model, baseUrl };
  }

  private buildMessages(prompt: string, sessionId: string): ChatMessage[] {
    const history = this.sessionStore.get(sessionId) || [];
    const userMessage = this.renderUserPrompt(prompt);
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: this.getSystemPromptTemplate(),
      },
      ...history,
      {
        role: 'user',
        content: userMessage,
      },
    ];

    this.pushHistory(sessionId, {
      role: 'user',
      content: userMessage,
    });

    return messages;
  }

  private getSystemPromptTemplate() {
    return [
      '你是一名 AI 应用工程师助手，回答要准确、结构化、可执行。',
      '如果涉及代码，请优先给出可落地的 NestJS 实现建议。',
      '若用户目标不清楚，先给出最小可行方案。',
    ].join('\n');
  }

  private renderUserPrompt(input: string) {
    const template = '用户问题：{{input}}';
    return template.replace('{{input}}', input.trim());
  }

  private appendAssistantReply(sessionId: string, answer: string) {
    this.pushHistory(sessionId, {
      role: 'assistant',
      content: answer,
    });
  }

  private pushHistory(sessionId: string, message: ChatMessage) {
    const history = this.sessionStore.get(sessionId) || [];
    history.push(message);

    const trimmedHistory = history.slice(-this.maxHistoryMessages);
    this.sessionStore.set(sessionId, trimmedHistory);
  }
}
