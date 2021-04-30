const express = require("express");
const router = express.Router();
const libKakaoWork = require("../libs/kakaoWork");
const gameDB = require("../libs/gamedb");
const block = require("../libs/block");

const test = async () => {
  await libKakaoWork.getAllUserList();
};
test();

router.get("/", async (req, res, next) => {
  // 유저 목록 검색 (1)
  const users = await libKakaoWork.getUserList();

  console.log("생성되는 유저 수 : ", users.length);
  // 검색된 모든 유저에게 각각 채팅방 생성 (2)
  const messages = await Promise.all(
    users.map(async (user) => {
      const conversation = await libKakaoWork.openConversations({
        userId: user.id,
      });
      const result = await gameDB.gameUserUpsert({ kakaoUserId: user.id });
      console.log(result);
      const gameUser = result.gameUser;
      const { score, successUpgrade } = gameUser;

      return libKakaoWork.sendMessage({
        conversationId: conversation.id,
        text: "☆★우승시 기프티콘을 드립니다★☆",
        blocks: block.main(score, successUpgrade),
      });
    })
  );

  // 응답값은 자유롭게 작성하셔도 됩니다.
  res.json({
    users,
    messages,
  });

  //   console.log("생성되는 유저 수 : ", users.length);
  //   // 검색된 모든 유저에게 각각 채팅방 생성 (2)
  //   const conversations = await Promise.all(
  //     users.map((user) => libKakaoWork.openConversations({ userId: user.id }))
  //   );
  //   const gameUsers = await Promise.all(
  //     users.map(async (user) => {
  //       const res = gameDB.gameUserUpsert({ kakaoUserId: user.id });
  //       if (res.ok) {
  //         return res.gameUser;
  //       }
  //       return res;
  //     })
  //   );

  //   // 생성된 채팅방에 메세지 전송 (3)
  //   const messages = await Promise.all([
  //     conversations.map((conversation) => {
  //       return libKakaoWork.sendMessage({
  //         conversationId: conversation.id,
  //         text: "☆★우승시 기프티콘을 드립니다★☆",
  //         blocks: block.main(5, 3),
  //       });
  //     }),
  //   ]);

  //   // 응답값은 자유롭게 작성하셔도 됩니다.
  //   res.json({
  //     users,
  //     conversations,
  //     messages,
  //   });
});

// 30일 16:00 일괄 요청
router.post("/chatbot", async (req, res, next) => {
  const users = await libKakaoWork.getUserList();
  const conversations = await Promise.all(
    users.map((user) => libKakaoWork.openConversations({ userId: user.id }))
  );
  const messages = await Promise.all([
    conversations.map((conversation) =>
      libKakaoWork.sendMessage({
        conversationId: conversation.id,
        text: "☆★우승시 기프티콘을 드립니다★☆",
        blocks: block.main(5, 3),
      })
    ),
  ]);

  res.json({ result: true });
});

router.post("/request", async (req, res, next) => {
  console.log(req.body);
  const { message, value } = req.body;

  switch (value) {
    case "quiz_modal":
      return res.json({
        view: block.quiz_modal,
      });
      break;
    default:
  }

  res.json({});
});

// routes/index.js
router.post("/callback", async (req, res, next) => {
  console.log(req.body);
  const { message, actions, action_time, value, react_user_id } = req.body;

  const result = await gameDB.gameUserByKakaoId(react_user_id);
  console.log(result.gameUser);
  const { score, successUpgrade } = result.gameUser;

  switch (value) {
    case "main":
      await libKakaoWork.sendMessage({
        conversationId: message.conversation_id,
        text: "☆★우승시 기프티콘을 드립니다★☆",
        blocks: block.main(score, successUpgrade),
      });
      break;

    case "attendance":
      const result = await gameDB.gameUserAttendanceCheck({
        kakaoUserId: react_user_id,
      });
      if (result.ok) {
        await libKakaoWork.sendMessage({
          conversationId: message.conversation_id,
          text: "☆★우승시 기프티콘을 드립니다★☆",
          blocks: block.attendance(score + 1, successUpgrade),
        });
      } else {
        await libKakaoWork.sendMessage({
          conversationId: message.conversation_id,
          text: "☆★우승시 기프티콘을 드립니다★☆",
          blocks: block.attendance_fail(score, successUpgrade),
        });
      }
      break;
    case "quiz":
      await libKakaoWork.sendMessage({
        conversationId: message.conversation_id,
        text: "☆★우승시 기프티콘을 드립니다★☆",
        blocks: block.quiz(),
      });
      break;
    case "upgrade":
      const upgradeResult = Math.random() > 0.5;
      if (upgradeResult) {
        await gameDB.gameUserReinforcement({
          kakaoUserId: react_user_id,
          diffScore: 1,
        });
        await libKakaoWork.sendMessage({
          conversationId: message.conversation_id,
          text: "☆★우승시 기프티콘을 드립니다★☆",
          blocks: block.upgrade(score + 1, successUpgrade + 1, true),
        });
      } else {
        await gameDB.gameUserReinforcement({
          kakaoUserId: react_user_id,
          diffScore: -1,
        });
        await libKakaoWork.sendMessage({
          conversationId: message.conversation_id,
          text: "☆★우승시 기프티콘을 드립니다★☆",
          blocks: block.upgrade(score - 1, successUpgrade, false),
        });
      }
      break;
    case "manual":
      await libKakaoWork.sendMessage({
        conversationId: message.conversation_id,
        text: "☆★우승시 기프티콘을 드립니다★☆",
        blocks: block.manual(),
      });
      break;
    case "submit_quiz":
      await libKakaoWork.sendMessage({
        conversationId: message.conversation_id,
        text: "☆★우승시 기프티콘을 드립니다★☆",
        blocks: block.submit_quiz(score, successUpgrade),
      });
      break;
    default:
  }

  res.json({ result: true });
});

module.exports = router;
