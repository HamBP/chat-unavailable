import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameUser } from './entities/game.entity';
import { GameLog } from './entities/gameLog.entity';
import { GameController } from './game.controller';
import { GameService } from './game.service';

@Module({
  imports: [TypeOrmModule.forFeature([GameLog, GameUser])],
  providers: [GameService],
  controllers: [GameController],
})
export class GameModule {}
