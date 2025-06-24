import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { ResponseInterceptor } from './interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 注册全局异常过滤器
  app.useGlobalFilters(new AllExceptionsFilter());
  // 注册全局响应拦截器
  app.useGlobalInterceptors(new ResponseInterceptor());
  await app.listen(3100);
}
bootstrap();
