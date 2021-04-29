const Config = require("config");
const axios = require("axios");
const gameDB = axios.create({
  // baseURL: "https://127.0.0.1:3001",
  baseURL: Config.keys.DB_SERVER.baseURL,
});

// 200 check
exports.checkLive = async () => {
  const res = await gameDB.get();
  return res.data;
};

// 랭크
exports.getRank = async () => {
  const res = await gameDB.get("gameuser/rank");
  return res.data;
};

// 로그 확인
exports.gameLogs = async () => {
  const res = await gameDB.get("/gameuser/gameLogs");
  return res.data;
};

// 유저 확인
exports.gameUserByKakaoId = async (kakaoUserId) => {
  const res = await gameDB.get(`/gameuser/gameUserByKakaoId/${kakaoUserId}`);
  return res.data;
};

// 유저 만들기
exports.gameUserUpsert = async ({ kakaoUserId }) => {
  const data = {
    kakaoUserId,
  };
  const res = await gameDB.post("/gameuser/gameUserUpsert", data);
  return res.data;
};

// 출석
exports.gameUserAttendanceCheck = async ({ kakaoUserId }) => {
  const data = {
    kakaoUserId,
  };
  const res = await gameDB.post("/gameuser/gameUserAttendanceCheck", data);
  return res.data;
};

// 강화 ( kakaoUserId : string, diffScore : number )
exports.gameUserReinforcement = async ({ kakaoUserId, diffScore }) => {
  const data = {
    kakaoUserId,
    diffScore,
  };
  const res = await gameDB.post("/gameuser/gameUserReinforcement", data);
  return res.data;
};

// 문제풀이 ( kakaoUserId : string, submitQuizNumber : number )
exports.gameUserPSSuccess = async ({ kakaoUserId }) => {
  const data = {
    kakaoUserId,
    submitQuizNumber,
  };
  const res = await gameDB.post("/gameuser/gameUserPSSuccess", data);
  return res.data;
};
