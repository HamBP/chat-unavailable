const Config = require("config");

const axios = require("axios");
const kakaoInstance = axios.create({
  baseURL: "https://api.kakaowork.com",
  headers: {
    Authorization: `Bearer ${Config.keys.kakaoWork.bot}`,
  },
});

// 유저 목록 검색 (1)
exports.getUserList = async () => {
  const res = await kakaoInstance.get("/v1/users.list");
  return res.data.users;
};

// 모든 유저 목록 검색
exports.getAllUserList = async () => {
  let allUser = [];
  let res;
  let cursor;

  try {
    res = await kakaoInstance.get("/v1/users.list?limit=100");
    // console.log(res.data);
    console.log("[0]user cursor: ", res.data.cursor);
    console.log("[0]user len: ", res.data.users.length);
    cursor = res.data.cursor;
    allUser = allUser.concat(res.data.users); //= [...allUser, ...res.data.users];

    if (cursor) {
      res = await kakaoInstance.get(`/v1/users.list?cursor=${cursor}`);
      console.log("[1]user cursor: ", res.data.cursor);
      console.log("[1]user len: ", res.data.users.length);
      cursor = res.data.cursor;
      allUser = allUser.concat(res.data.users);
      // allUser = [...allUser, ...res.data.users];
    }
    console.log("all User len : ", allUser.length);
    return allUser;
  } catch (error) {
    console.log("cannot get all user");
    return null;
  }
};

// 채팅방 생성 (2)
exports.openConversations = async ({ userId }) => {
  const data = {
    user_id: userId,
  };
  const res = await kakaoInstance.post("/v1/conversations.open", data);
  return res.data.conversation;
};

// 메시지 전송 (3)
exports.sendMessage = async ({ conversationId, text, blocks }) => {
  const data = {
    conversation_id: conversationId,
    text,
    ...(blocks && { blocks }),
  };
  const res = await kakaoInstance.post("/v1/messages.send", data);
  return res.data.message;
};
