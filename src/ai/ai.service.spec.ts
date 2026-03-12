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

  it('should throw when required env is missing', async () => {
    (configService.get as jest.Mock).mockImplementation((key: string) => {
      if (key === 'ARK_BASE_URL') return 'https://ark.cn-beijing.volces.com/api/v3';
      return undefined;
    });

    await expect(service.chat('hello')).rejects.toThrow(HttpException);
  });

  it('should return parsed answer when api success', async () => {
    (configService.get as jest.Mock).mockImplementation((key: string) => {
      if (key === 'ARK_API_KEY') return 'test-key';
      if (key === 'ARK_MODEL') return 'doubao-seed';
      if (key === 'ARK_BASE_URL') return 'https://ark.cn-beijing.volces.com/api/v3';
      return undefined;
    });

    const fetchMock = jest.spyOn(global, 'fetch' as any).mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: '你好，我是方舟模型。' } }],
        usage: { total_tokens: 10 },
      }),
    } as Response);

    const result = await service.chat('你好');

    expect(result).toEqual({
      model: 'doubao-seed',
      answer: '你好，我是方舟模型。',
      usage: { total_tokens: 10 },
    });

    fetchMock.mockRestore();
  });
});
