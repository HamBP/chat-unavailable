import { Column, Entity, OneToMany } from 'typeorm';
import { CoreEntity } from './core.entity';
import { GameLog } from './gameLog.entity';

export class SolvedQuestions {
  questions: number[];
}

@Entity()
export class GameUser extends CoreEntity {
  @Column({ unique: true })
  kakaoUserId: string;

  @Column({ default: 1 }) // (출석 + 문제 점수 ) * 강화
  score: number;
  // 출석 얻은 점수
  @Column({ default: 0 })
  attendanceScore: number;

  @Column({ nullable: true })
  lastAttendance: Date;

  // 문제 얻은 점수
  @Column({ default: 0 })
  questionScore: number;

  // 푼 문제 목록
  @Column({ type: 'json' })
  solvedQuestions?: SolvedQuestions;

  // 강화 성공 횟수
  @Column({ default: 0 })
  successUpgrade: number;

  // 강화 실패 횟수
  @Column({ default: 0 })
  failUpgrade: number;

  @OneToMany(() => GameLog, (gameLog) => gameLog.gameUser, {
    onDelete: 'CASCADE',
  })
  logs: GameLog[];
}
