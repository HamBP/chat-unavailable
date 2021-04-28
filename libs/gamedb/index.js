const axios = require("axios");
const gameDB = axios.create({
  baseURL: "https://127.0.0.1:3001",
});

// 200 check
exports.checkLive = async () => {
  const res = await gameDB.get();
  return res;
};

// 랭크
exports.getRank = async () => {
  const res = await gameDB.get("gameuser/rank");
  return res;
};

// 로그 확인
exports.gameLogs = async () => {
  const res = await kakaoInstance.get("/gameuser/gameLogs");
  return res;
};

// 유저 만들기
exports.gameUserUpsert = async ({ kakaoUserId }) => {
  const data = {
    kakaoUserId,
  };
  const res = await kakaoInstance.post("/gameuser/gameUserUpsert", data);
  return res;
};

// 출석
exports.gameUserAttendanceCheck = async ({ kakaoUserId }) => {
  const data = {
    kakaoUserId,
  };
  const res = await kakaoInstance.post(
    "/gameuser/gameUserAttendanceCheck",
    data
  );
  return res;
};

// 강화 ( kakaoUserId : string, diffScore : number )
exports.gameUserReinforcement = async ({ kakaoUserId, diffScore }) => {
  const data = {
    kakaoUserId,
    diffScore,
  };
  const res = await kakaoInstance.post("/gameuser/gameUserReinforcement", data);
  return res;
};

// 문제풀이 ( kakaoUserId : string, submitQuizNumber : number )
exports.gameUserPSSuccess = async ({ kakaoUserId }) => {
  const data = {
    kakaoUserId,
    submitQuizNumber,
  };
  const res = await kakaoInstance.post("/gameuser/gameUserPSSuccess", data);
  return res;
};
