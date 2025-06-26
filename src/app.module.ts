import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ArticleModule } from './article/article.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        // uri: 'mongodb+srv://Joker927:z453512494.@cluster0.yb3buvk.mongodb.net/node?retryWrites=true&w=majority&appName=Cluster0',
        uri: configService.get<string>('MONGODB_URI'),
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }