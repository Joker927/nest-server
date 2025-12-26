import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ArticleModule } from './article/article.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        maxPoolSize: 10,
        bufferCommands: false,
        connectionFactory: (connection: Connection) => {
          // 监听连接成功事件
          connection.on('connected', () => {
            console.log('Successfully connected to MongoDB Atlas');
          });

          // 监听连接断开事件
          connection.on('disconnected', () => {
            console.error('Disconnected from MongoDB Atlas');
          });

          // 监听连接错误事件
          connection.on('error', (error) => {
            console.error('MongoDB Atlas connection error:', error);
          });

          return connection;
        },
      }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    UserModule,
    ArticleModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule { }