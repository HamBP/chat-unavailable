export class GamerUserUpsertInput {
  kakaoUserId: string;
}
export class GamerUserUpsertOutput {
  ok: boolean;
  error?: string;
}

export class GameUserAttendanceChecInput {
  kakaoUserId: string;
}

export class GameUserAttendanceCheckOutput {
  ok: boolean;
  error?: string;
}

export class GameUserReinforcementInput {
  kakaoUserId: string;
  diffScore: number;
}
export class GameUserReinforcementOutput {
  ok: boolean;
  error?: string;
}

export class GameUserPSSuccesInput {
  kakaoUserId: string;
  submitQuizNumber: number;
}
export class GameUserPSSuccessOutput {
  ok: boolean;
  error?: string;
}
