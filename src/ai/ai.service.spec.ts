import { HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AiService } from './ai.service';

describe('AiService', () => {
  const configService = {
    get: jest.fn(),
  } as unknown as ConfigService;

  let service: AiService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AiService(configService);
  });

  it('should throw when QWEN_API_KEY is missing', async () => {
    (configService.get as jest.Mock).mockImplementation((key: string) => {
      if (key === 'QWEN_MODEL') return 'qwen3.5-plus';
      if (key === 'QWEN_BASE_URL') {
        return 'https://dashscope.aliyuncs.com/api/v2/apps/protocols/compatible-mode/v1';
      }
      return undefined;
    });

    await expect(service.chat('hello')).rejects.toThrow(
      '请配置 QWEN_API_KEY 环境变量',
    );
  });

  it('should return parsed answer when api success', async () => {
    (configService.get as jest.Mock).mockImplementation((key: string) => {
      if (key === 'QWEN_API_KEY') return 'test-key';
      if (key === 'QWEN_MODEL') return 'qwen3.5-plus';
      if (key === 'QWEN_BASE_URL') {
        return 'https://dashscope.aliyuncs.com/api/v2/apps/protocols/compatible-mode/v1';
      }
      return undefined;
    });

    const fetchMock = jest.spyOn(global, 'fetch' as any).mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: '你好，我是千问。' } }],
        usage: { total_tokens: 10 },
      }),
    } as Response);

    const result = await service.chat('你好', 'session-1');

    expect(result).toEqual({
      model: 'qwen3.5-plus',
      sessionId: 'session-1',
      answer: '你好，我是千问。',
      usage: { total_tokens: 10 },
    });

    fetchMock.mockRestore();
  });

  it('should throw when api returns empty answer', async () => {
    const fetchMock = jest.spyOn(global, 'fetch' as any).mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: '' } }],
      }),
    } as Response);

    await expect(service.chat('hello')).rejects.toThrow(HttpException);
    fetchMock.mockRestore();
  });
});
