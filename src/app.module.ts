import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { Info } from './entities/info.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT ?? "") || 3306,
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'app_dev',
      entities: [Info],
      synchronize: false, // Set to false in production
      logging: process.env.APP_ENV === 'dev',
    }),
    TypeOrmModule.forFeature([Info]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
