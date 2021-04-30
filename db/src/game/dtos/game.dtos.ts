import { GameUser } from '../entities/game.entity';

export class GamerUserUpsertInput {
  kakaoUserId: string;
  username?: string;
}
export class GamerUserUpsertOutput {
  ok: boolean;
  error?: string;
  gameUser?: GameUser;
}

export class GameUserAttendanceChecInput {
  kakaoUserId: string;
}

export class GameUserAttendanceCheckOutput {
  ok: boolean;
  error?: string;
  gameUser?: GameUser;
}

export class GameUserReinforcementInput {
  kakaoUserId: string;
  diffScore: number;
}
export class GameUserReinforcementOutput {
  ok: boolean;
  error?: string;
  gameUser?: GameUser;
}

export class GameUserPSSuccesInput {
  kakaoUserId: string;
  submitQuizNumber: number;
}
export class GameUserPSSuccessOutput {
  ok: boolean;
  error?: string;
  gameUser?: GameUser;
}
