import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { GameService } from './game.service';

@Controller('gameuser')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get('rank')
  async gameUserRank() {
    return this.gameService.gameUserRank();
  }
  @Get('gameLogs')
  async gameLogs() {
    return this.gameService.gameLogs();
  }
  @Get('gameUserByKakaoId/:kakaoUserId')
  async gameUserByKakaoId(@Param('kakaoUserId') kakaoUserId: string) {
    return this.gameService.gameUserByKakaoId({ kakaoUserId });
  }

  @Post('gameUserUpsert')
  async gameUserUpsert(@Body() body) {
    return this.gameService.gameUserUpsert(body);
  }
  @Post('gameUserAttendanceCheck')
  async gameUserAttendanceCheck(@Body() body) {
    return this.gameService.gameUserAttendanceCheck(body);
  }
  @Post('gameUserReinforcement')
  async gameUserReinforcement(@Body() body) {
    return this.gameService.gameUserReinforcement(body);
  }
  @Post('gameUserPSSuccess')
  async gameUserPSSuccess(@Body() body) {
    return this.gameService.gameUserPSSuccess(body);
  }
}
