import { Module } from '@nestjs/common';
import { KakaoWorkService } from './kakaowork.service';

@Module({
  imports: [],
  controllers: [],
  providers: [KakaoWorkService],
  exports: [KakaoWorkService],
})
export class KakaoWorkModule {}
