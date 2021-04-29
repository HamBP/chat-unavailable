import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KakaoWorkModule } from './kakaoWork/kakaoWork.module';
import { GameUser } from './game/entities/game.entity';
import { GameLog } from './game/entities/gameLog.entity';
import { GameModule } from './game/game.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'test', 'prod').default('dev'),
        PORT: Joi.number().required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      ...(process.env.DATABASE_IS_SSL === 'Y' && {
        ssl: {
          rejectUnauthorized: true,
        },
      }),
      url: process.env.DATABASE_URL,
      synchronize: process.env.NODE_ENV === 'dev' ? true : false,
      logging: false,
      entities: [GameUser, GameLog],
    }),
    KakaoWorkModule,
    GameModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
