import { Column, Entity, ManyToOne } from 'typeorm';
import { CoreEntity } from './core.entity';
import { GameUser } from './game.entity';

// 출석, 강화, 문제

export enum GameActions {
  Attendance = 'Attendance',
  Reinforce = 'Reinforce',
  Problem = 'Problem',
}

@Entity()
export class GameLog extends CoreEntity {
  @Column()
  score: number;

  @Column({ type: 'enum', enum: GameActions, default: GameActions.Attendance })
  reason: GameActions;

  @ManyToOne(() => GameUser, (gameUser) => gameUser.logs)
  gameUser: GameUser;
}
