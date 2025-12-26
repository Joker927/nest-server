import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { AuthGuard } from './auth/auth.guard';
import { Reflector } from '@nestjs/core';

async function bootstrap() {
  try {
    console.log('🚀 Starting NestJS application...');
    console.log(`📦 NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔌 PORT: ${process.env.PORT || 3000}`);
    
    const app = await NestFactory.create(AppModule);
    // 注册全局异常过滤器
    app.useGlobalFilters(new AllExceptionsFilter());
    // 注册全局响应拦截器
    app.useGlobalInterceptors(new ResponseInterceptor());
    // 注册全局守卫
    // app.useGlobalGuards(app.get(Reflector), app.get(AuthGuard));

    app.enableCors({
      origin: [
        'https://vue3-zhangyiming.vercel.app',
        'http://192.168.29.154:3000',
        'https://192.168.29.154:3000',
      ],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    });

    // 健康检查端点 - 不经过全局前缀，供 fly.io 使用
    app.getHttpAdapter().get('/health', (req, res) => {
      res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
    });

    app.setGlobalPrefix('nestApi');
    const port = process.env.PORT ?? 3000;
    
    console.log(`🌐 Listening on 0.0.0.0:${port}...`);
    await app.listen(port, '0.0.0.0');
    
    console.log(`✅ Application is running on: http://0.0.0.0:${port}`);
    console.log(`📡 Health check available at: http://0.0.0.0:${port}/health`);
    console.log(`🔗 API prefix: /nestApi`);
  } catch (error) {
    console.error('❌ Failed to start application:', error);
    process.exit(1);
  }
}
bootstrap();
