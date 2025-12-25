import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { AuthGuard } from './auth/auth.guard';
import { Reflector } from '@nestjs/core';

async function bootstrap() {
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

  app.setGlobalPrefix('nestApi');
  const port = process.env.PORT ?? 3000;
  await app.listen(port, '0.0.0.0');
  // await app.listen(3000);
}
bootstrap();
