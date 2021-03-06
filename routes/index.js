const express = require("express");
const router = express.Router();
const libKakaoWork = require("../libs/kakaoWork");
const gameDB = require("../libs/gamedb");
const block = require("../libs/block");

const allUserToDB = async () => {
  let users = await libKakaoWork.getAllUserList();
  await Promise.all(
    users.map(async (user) => {
      const result = await gameDB.gameUserUpsert({
        kakaoUserId: user.id,
        username: user["name"],
      });

      return { ok: true };
    })
  );
};

const sendTester = async () => {
  let users = await libKakaoWork.getAllUserList();

  // ----- π μλ λΆλΆ μ£Όμμ²λ¦¬μ - μ μ²΄ λ©μμ§ -----
  users = users.filter(
    (user) => user.name === "κΉλμ" || user.name === "κΉκ²½ν" || user.name === "μ‘μ€μ" || user.name === "μ μ±μ§"|| user.name === "μ μ€μ"
  );
  // ----------------------------------------------------
  const messages = await Promise.all(
    users.map(async (user) => {
      const conversation = await libKakaoWork.openConversations({
        userId: user.id,
      });

      const result = await gameDB.gameUserUpsert({
        kakaoUserId: user.id,
        username: user["name"],
      });
      // console.log(result);
      const gameUser = result.gameUser;
      const { score, availableUpgrade } = gameUser;

      return libKakaoWork.sendMessage({
        conversationId: conversation.id,
        text: "μ±νμ΄ λΆκ°λ₯ν μ±λμλλ€.",
        blocks: block.main(score, availableUpgrade),
      });
    })
  );
};
const init = async () => {
  await allUserToDB();
  await sendTester(); // μ€νμ νμ€ν°λ€μκ² λ©μμ§ λ³΄λ
};
init();

router.get("/", async (req, res, next) => {
  const users = await libKakaoWork.getAllUserList(); // μ μ  λͺ©λ‘ κ²μ (1)
  // κ²μλ λͺ¨λ  μ μ μκ² κ°κ° μ±νλ°© μμ± (2)
  const messages = await Promise.all(
    users.map(async (user) => {
      const conversation = await libKakaoWork.openConversations({
        userId: user.id,
      });

      const result = await gameDB.gameUserUpsert({
        kakaoUserId: user.id,
        username: user["name"],
      });

      const gameUser = result.gameUser;
      const { score, availableUpgrade } = gameUser;
      return libKakaoWork.sendMessage({
        conversationId: conversation.id,
        text: "μ±νμ΄ λΆκ°λ₯ν μ±λμλλ€.",
        blocks: block.main(score, availableUpgrade),
      });
    })
  );
  res.json({
    users,
    messages,
  });
});

// 30μΌ 16:00 μΌκ΄ μμ²­
router.post("/chatbot", async (req, res, next) => {
  const users = await libKakaoWork.getAllUserList(); // μ μ  λͺ©λ‘ κ²μ (1)
  // κ²μλ λͺ¨λ  μ μ μκ² κ°κ° μ±νλ°© μμ± (2)
  const messages = await Promise.all(
    users.map(async (user) => {
      const conversation = await libKakaoWork.openConversations({
        userId: user.id,
      });
      const result = await gameDB.gameUserUpsert({ kakaoUserId: user.id });
      const gameUser = result.gameUser;
      const { score, availableUpgrade } = gameUser;
      return libKakaoWork.sendMessage({
        conversationId: conversation.id,
        text: "μ±νμ΄ λΆκ°λ₯ν μ±λμλλ€.",
        blocks: block.main(score, availableUpgrade),
      });
    })
  );
  res.json({
    users,
    messages,
  });
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
  const { score, availableUpgrade, solvedQuestions } = result.gameUser;
  switch (value) {
    case "main":
      // μ μμ κ°ν κ°λ₯ νμ μΆλ ₯
      await libKakaoWork.sendMessage({
        conversationId: message.conversation_id,
        text: "μ±νμ΄ λΆκ°λ₯ν μ±λμλλ€.",
        blocks: block.main(score, availableUpgrade),
      });
      break;
    case "attendance":
      const result = await gameDB.gameUserAttendanceCheck({
        kakaoUserId: react_user_id,
      });
      if (result.ok) {
        // μΆμ ν κ²½μ°
        await libKakaoWork.sendMessage({
          conversationId: message.conversation_id,
          text: "μ±νμ΄ λΆκ°λ₯ν μ±λμλλ€.",
          blocks: block.attendance(score + 1, availableUpgrade + 1),
        });
      } else {
        // μΆμ μ€ν¨
        await libKakaoWork.sendMessage({
          conversationId: message.conversation_id,
          text: "μ±νμ΄ λΆκ°λ₯ν μ±λμλλ€.",
          blocks: block.attendance_fail(score, availableUpgrade),
        });
      }
      break;
    case "quiz":
      // ν΄μ¦ λͺ¨λ¬ μ½λ°±
      await libKakaoWork.sendMessage({
        conversationId: message.conversation_id,
        text: "μ±νμ΄ λΆκ°λ₯ν μ±λμλλ€.",
        blocks: block.quiz(),
      });
      break;
    case "upgrade":
      // κ°ν
      if (availableUpgrade <= 0) {
        await libKakaoWork.sendMessage({
          conversationId: message.conversation_id,
          text: "μ±νμ΄ λΆκ°λ₯ν μ±λμλλ€.",
          blocks: block.noUpgradeRemain(score, availableUpgrade),
        });
        break;
      }
      const upgradeResult = Math.random() > 0.5;
      if (upgradeResult) {
        // κ°ν μ±κ³΅ν κ²½μ° +1 | DB λ° μ±λ΄ μλ¦Ό
        await gameDB.gameUserReinforcement({
          kakaoUserId: react_user_id,
          diffScore: 1,
        });
        await libKakaoWork.sendMessage({
          conversationId: message.conversation_id,
          text: "μ±νμ΄ λΆκ°λ₯ν μ±λμλλ€.",
          blocks: block.upgrade(score + 1, availableUpgrade - 1, true),
        });
      } else {
        // κ°ν μ€ν¨ν κ²½μ° -1 | DB λ° μ±λ΄ μλ¦Ό
        await gameDB.gameUserReinforcement({
          kakaoUserId: react_user_id,
          diffScore: -1,
        });
        await libKakaoWork.sendMessage({
          conversationId: message.conversation_id,
          text: "μ±νμ΄ λΆκ°λ₯ν μ±λμλλ€.",
          blocks: block.upgrade(score - 1, availableUpgrade - 1, false),
        });
      }
      break;
    case "manual":
      await libKakaoWork.sendMessage({
        conversationId: message.conversation_id,
        text: "μ±νμ΄ λΆκ°λ₯ν μ±λμλλ€.",
        blocks: block.manual(),
      });
      break;
    case "submit_quiz":
      const alreadySolved = solvedQuestions["questions"];
      const quizNumber = actions.select_problem;
      const quizAnswer = [
        "μ€κ΅­μ΄",
        "μ¬μ§",
        "μ΄λ",
        "κ·κ°",
        "μμ",
        "μ λ°",
        "μν",
        "μλ¦¬",
        "μν",
        "κ³¨ν",
      ];
      // μ λ΅μ΄ λ§λ κ²¨μ°
      if (actions.answer === quizAnswer[Number(quizNumber) - 1]) {
        const quizResult = await gameDB.gameUserPSSuccess({
          kakaoUserId: react_user_id,
          submitQuizNumber: quizNumber,
        });
        // μ΅μ΄ 1νλ§ μΈμ 
        if (quizResult.ok) {
          await libKakaoWork.sendMessage({
            conversationId: message.conversation_id,
            text: "μ±νμ΄ λΆκ°λ₯ν μ±λμλλ€.",
            blocks: block.submit_quiz(
              score + 1,
              true,
              alreadySolved.concat(quizNumber).toString()
            ),
          });
          break;
        } else {
          await libKakaoWork.sendMessage({
            conversationId: message.conversation_id,
            text: "μ±νμ΄ λΆκ°λ₯ν μ±λμλλ€.",
            blocks: block.submit_quiz(score, false, alreadySolved.toString()),
          });
          break;
        }
      } else {
        // μ λ΅μ΄ νλ¦° κ²½μ°
        await libKakaoWork.sendMessage({
          conversationId: message.conversation_id,
          text: "μ±νμ΄ λΆκ°λ₯ν μ±λμλλ€.",
          blocks: block.submit_quiz(
            score,
            false,
            solvedQuestions.questions,
            alreadySolved.toString()
          ),
        });
      }
      break;
    default:
  }

  res.json({ result: true });
});

router.get("/rank", async (req, res, next) => {
  const data = await gameDB.getRank();
  res.json({
    data,
  });
});

module.exports = router;
