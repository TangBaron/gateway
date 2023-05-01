declare const module: any;

// 验证逻辑，版本控制
import { ValidationPipe, VersioningType, VERSION_NEUTRAL } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
// 切换成Fastify的内核
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { AllExceptionsFilter } from './common/exceptions/base.exception.filter';
import { HttpExceptionFilter } from './common/exceptions/http.exception.filter';
import { generateDocument } from './doc';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  // 接口版本化管理
  app.enableVersioning({
    defaultVersion: [VERSION_NEUTRAL, '1', '2'],
    type: VersioningType.URI,
  });
  // 使用全局拦截器
  app.useGlobalInterceptors(new TransformInterceptor());
  // 全局异常过滤器, 注意自定义异常的先后顺序，先全局错误后Http错误
  app.useGlobalFilters(new AllExceptionsFilter(), new HttpExceptionFilter());

  // 启动全局字段校验，保证接口请求字段校验正确
  app.useGlobalPipes(new ValidationPipe());

  // 创建文档
  generateDocument(app);

  // 添加热更新
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

  await app.listen(3000);
}
bootstrap();
