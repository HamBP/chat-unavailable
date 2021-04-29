import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  GamerUserUpsertInput,
  GamerUserUpsertOutput,
  GameUserAttendanceChecInput,
  GameUserAttendanceCheckOutput,
  GameUserReinforcementInput,
  GameUserReinforcementOutput,
  GameUserPSSuccesInput,
  GameUserPSSuccessOutput,
} from './dtos/game.dtos';
import { GameUser } from './entities/game.entity';
import { GameActions, GameLog } from './entities/gameLog.entity';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(GameUser)
    private readonly gameUserRepo: Repository<GameUser>,
    @InjectRepository(GameLog)
    private readonly gameLogRepo: Repository<GameLog>,
  ) {}

  // 랭크 출력
  async gameUserRank() {
    try {
      const users = await this.gameUserRepo.find({
        order: { score: 'DESC' },
        take: 5,
      });
      return {
        ok: true,
        users,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'cannot get users',
      };
    }
  }
  // 모든 로그 출력
  async gameLogs() {
    try {
      const gameLogs = await this.gameLogRepo.find({});
      return { ok: true, gameLogs };
    } catch (error) {
      console.log(error);

      return { ok: false, error: 'cannot get gameLog' };
    }
  }

  // 카카오 아이디로 사람 찾기
  async gameUserByKakaoId(kakaoUserId: string) {
    try {
      const gameUser = await this.gameUserRepo.findOneOrFail({
        where: { kakaoUserId },
      });
      return {
        ok: true,
        gameUser,
      };
    } catch (error) {
      return { ok: false, error: `cannot find user by ${kakaoUserId}` };
    }
  }

  // 사용자 생성
  async gameUserUpsert({
    kakaoUserId,
  }: GamerUserUpsertInput): Promise<GamerUserUpsertOutput> {
    try {
      let gameUser = await this.gameUserRepo.findOne({
        where: { kakaoUserId },
      });
      if (gameUser) return { ok: true, gameUser };

      gameUser = await this.gameUserRepo.save(
        this.gameUserRepo.create({
          kakaoUserId,
          solvedQuestions: { questions: [] },
        }),
      );

      return { ok: true, gameUser };
    } catch (error) {
      return {
        ok: false,
        error: 'cannot upsert game user',
      };
    }
  }

  // 사용자 출석 체크 -
  // 아이디존재,출석 중복,24시간 체크, 출석로그
  // - 강화횟수 증가
  async gameUserAttendanceCheck({
    kakaoUserId,
  }: GameUserAttendanceChecInput): Promise<GameUserAttendanceCheckOutput> {
    try {
      // 사용자 아이디 체크
      const nowDate = new Date();
      const gameUser = await this.gameUserRepo.findOne({
        where: { kakaoUserId },
      });
      if (!gameUser) return { ok: false, error: 'cannot find user' };
      // 출석 중복 체크
      if (gameUser.lastAttendance) {
        const dayDiff = nowDate.getDate() - gameUser.lastAttendance.getDate();
        if (dayDiff <= 0) {
          return { ok: false, error: 'already attendance' };
        }
      }
      // 출석이 없거나, 24시간이 지난경우 - 출석
      // gameUser.score += 1; // 점수가 아닌 강화 증가 횟수 +=1
      gameUser.availableUpgrade += 1;
      gameUser.attendanceScore += 1; // 출석으로 얻은 강화 횟수
      gameUser.lastAttendance = nowDate;
      await this.gameUserRepo.save(gameUser);
      await this.gameLogRepo.save(
        this.gameLogRepo.create({
          gameUser,
          reason: GameActions.Attendance,
          score: 1,
        }),
      );
      return { ok: true, gameUser };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
      };
    }
  }

  // 사용자 강화 성공/실패
  // 사용자 존재 체크 , 점수 0 점 이상 존재
  async gameUserReinforcement({
    kakaoUserId,
    diffScore,
  }: GameUserReinforcementInput): Promise<GameUserReinforcementOutput> {
    try {
      const gameUser = await this.gameUserRepo.findOne({
        where: { kakaoUserId },
      });
      if (!gameUser) return { ok: false, error: 'cannot find user' };
      if (gameUser.availableUpgrade <= 0)
        return { ok: false, error: 'availableUpgrade <= 0' };

      if (diffScore > 0) {
        gameUser.successUpgrade += 1; // 강화 성공
      }
      if (diffScore < 0) {
        gameUser.failUpgrade += 1; // 강화 실패
      }
      gameUser.availableUpgrade -= 1; // 강화 가능 횟수 감소
      gameUser.score += diffScore; // 강화 후 점수
      await this.gameUserRepo.save(gameUser);
      await this.gameLogRepo.save(
        this.gameLogRepo.create({
          gameUser,
          reason: GameActions.Reinforce,
          score: diffScore,
        }),
      );
      return { ok: true, gameUser };
    } catch (error) {
      console.log(error);
      return { ok: false, error: 'cannot upgrade gameUser' };
    }
  }

  // 사용자 문제 풀이 점수 올리기
  async gameUserPSSuccess({
    kakaoUserId,
    submitQuizNumber,
  }: GameUserPSSuccesInput): Promise<GameUserPSSuccessOutput> {
    try {
      const gameUser = await this.gameUserRepo.findOne({
        where: { kakaoUserId },
      });
      if (!gameUser) return { ok: false, error: 'cannot find user' };

      // 이미 푼 문제인 경우
      if (gameUser.solvedQuestions && gameUser.solvedQuestions.questions) {
        if (gameUser.solvedQuestions.questions.includes(submitQuizNumber)) {
          await this.gameLogRepo.save(
            this.gameLogRepo.create({
              gameUser,
              reason: GameActions.Problem,
              score: 0,
            }),
          );
          return {
            ok: false,
            error: 'already solved',
          };
        }
      }
      // 문제를 맞추자.

      const newQs = [...gameUser.solvedQuestions.questions, submitQuizNumber];
      gameUser.questionScore += 1; // 문제를 통한 강화 횟수 증가
      gameUser.availableUpgrade += 1; // 누적 강화 횟수 증가
      // gameUser.score += 1; // 점수가 아닌 강화 증가 횟수 +=1
      gameUser.solvedQuestions.questions = newQs;
      await this.gameUserRepo.save(gameUser);
      await this.gameLogRepo.save(
        this.gameLogRepo.create({
          gameUser,
          reason: GameActions.Problem,
          score: 1,
        }),
      );
      return {
        ok: true,
        gameUser,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: 'cannot gameUser PS update',
      };
    }
  }
}
