/* template */
const template = (score, count) => [
  {
    type: "text",
    text: "※ *사용 방법*을 꼭 확인해 주세요!!!",
    markdown: true,
  },
  {
    type: "button",
    text: "🖐출석 하기🖐",
    style: "default",
    value: "attendance",
    action_type: "submit_action",
    action_name: "submit",
  },
  {
    type: "button",
    text: "💡퀴즈 풀기💡",
    style: "default",
    value: "quiz",
    action_type: "submit_action",
    action_name: "submit",
  },
  {
    type: "button",
    text: `💥강화 하기 (${count})💥`,
    style: "danger",
    value: "upgrade",
    action_type: "submit_action",
    action_name: "submit",
  },
  {
    type: "button",
    text: "❗❗❗ 사용 방법 ❗❗❗",
    style: "default",
    value: "manual",
    action_type: "submit_action",
    action_name: "submit",
  },
  {
    type: "description",
    term: "🎡 점수",
    content: {
      type: "text",
      text: `*${score}*점`,
      markdown: true,
    },
    accent: true,
  },
];

/* messages */
/* 홈 */
exports.main = (score, count) => [
  {
    type: "header",
    text: "채팅이 불가능한 채널입니다.",
    style: "yellow",
  },
  ...template(score, count),
];

/* 출석 */
exports.attendance = (score, count) => [
  {
    type: "header",
    text: "출석이 완료되었습니다 🙂",
    style: "blue",
  },
  ...template(score, count),
];

exports.attendance_fail = (score, count) => [
  {
    type: "header",
    text: "출석 실패ㅠㅠ 😥(1일 1회만)",
    style: "red",
  },
  ...template(score, count),
];

/* 퀴즈 */
exports.quiz = () => [
  {
    type: "header",
    text: "지난 기수 프로젝트의 이름은?",
    style: "blue",
  },
  {
    type: "text",
    text:
      "📌아래 10문제 중 *문제 풀기* 버튼을 클릭하셔서, 원하시는 문제를 골라 푸시면 됩니다.",
    markdown: true,
  },
  {
    type: "text",
    text: "단, 맞히신 문제는 중복으로 푸실 수 없습니다!",
    markdown: true,
  },
  {
    type: "divider",
  },
  {
    type: "text",
    text: "Q1. 학교 선생님과 함께하는 *OOO* 학습 생태계 프로젝트",
    markdown: true,
  },
  {
    type: "text",
    text: "Q2. 위치기반 정보를 활용한 *OO* 정리 애플리케이션",
    markdown: true,
  },
  {
    type: "text",
    text: "Q3. 다같이 온라인으로 끝까지 *OO*하는 확실한 방법!",
    markdown: true,
  },
  {
    type: "text",
    text: "Q4. OO의 모든 것",
    markdown: true,
  },
  {
    type: "text",
    text: "Q5. 위험 상황 방지를 위한 *OO* 모니터링 서비스",
    markdown: true,
  },
  {
    type: "text",
    text: "Q6. 몰입형 가상 *OO* 체험 솔루션",
    markdown: true,
  },
  {
    type: "text",
    text: "Q7. 모두를 위한 인공지능 *OO* 선생님",
    markdown: true,
  },
  {
    type: "text",
    text: "Q8. *OO* 컨텐츠를 활용한 소셜 네트워크 서비스",
    markdown: true,
  },
  {
    type: "text",
    text: "Q9. 개인 성향을 반영한 *OO* 추천 플랫폼",
    markdown: true,
  },
  {
    type: "text",
    text: "Q10. 나만의 프로 *OO* 코치",
    markdown: true,
  },
  {
    type: "button",
    text: "문제 풀기",
    style: "primary",
    action_type: "call_modal",
    value: "quiz_modal",
  },
  {
    type: "button",
    text: "뒤로 가기",
    style: "default",
    action_type: "submit_action",
    action_name: "submit",
    value: "main",
  },
];

/* 퀴즈 제출시 결과 */
exports.submit_quiz = (score, isSuccessful, solvedList) => [
  {
    type: "header",
    text: `${
      isSuccessful ? "정답입니다! 🎉" : "이미 풀으셨거나 틀렸습니다 💦"
    }`,
    style: `${isSuccessful ? "blue" : "red"}`,
  },
  {
    type: "description",
    term: "점수",
    content: {
      type: "text",
      text: `${score}`,
      markdown: false,
    },
    accent: true,
  },
  {
    type: "description",
    term: "푼 문제",
    content: {
      type: "text",
      text: `${solvedList}`,
      markdown: false,
    },
    accent: true,
  },
  {
    type: "button",
    text: "메뉴 보기",
    style: "default",
    value: "main",
    action_type: "submit_action",
    action_name: "submit",
  },
];

/* 강화 */
exports.upgrade = (score, count, isSuccessful) => [
  {
    type: "header",
    text: `강화 ${isSuccessful ? "성공 +1 😎" : "실패 -1 💥💥💥"}!`,
    style: `${isSuccessful ? "blue" : "red"}`,
  },
  ...template(score, count),
];

/* 강화 횟수 없음 */
exports.noUpgradeRemain = (score, count) => [
  {
    type: "header",
    text: `강화 가능 횟수가 없습니다!!`,
    style: "red",
  },
  ...template(score, count),
];

/* 설명서 */
exports.manual = () => [
  {
    type: "header",
    text: "📌 이렇게 사용하세요 !",
    style: "blue",
  },
  {
    type: "text",
    text:
      "저희가 준비한 다양한 미니🎲게임을 즐기시면서 최대한 많은 *포인트*✨를 모아보세요! 상위 *5분*에 *상품🎁*을 드립니다!!",
    markdown: true,
  },
  {
    type: "text",
    text: "(저희 주머니를 빌렸습니다ㅠ)",
    markdown: true,
  },
  {
    type: "description",
    term: "✅출석",
    content: {
      type: "text",
      text: "*포인트 1점*과 *강화 횟수 1개*를 드립니다!",
      markdown: true,
    },
    accent: true,
  },
  {
    type: "description",
    term: "✅문제",
    content: {
      type: "text",
      text: "*포인트 1점*과 *강화 횟수 1개*를 드립니다!",
      markdown: true,
    },
    accent: true,
  },
  {
    type: "description",
    term: "✅강화",
    content: {
      type: "text",
      text:
        "강화 횟수 당 성공 시 *+1점*, 실패 시 *-1점*이 됩니다. (확률은 *50%* !)",
      markdown: true,
    },
    accent: true,
  },
  {
    type: "description",
    term: "✅상품",
    content: {
      type: "text",
      text: "maybe... 기프티콘s (연수센터 1층 스벅에서 쓸 것도 있대요..!)",
      markdown: true,
    },
    accent: true,
  },
  {
    type: "divider",
  },
  {
    type: "text",
    text: "보다 자세한 사항은 👇*아래 링크*👇를 참고해 주세요!!",
    markdown: true,
  },
  {
    type: "context",
    content: {
      type: "text",
      text:
        "[chat-unavailable README.md](https://github.com/HamBP/chat-unavailable)",
      markdown: true,
    },
    image: {
      type: "image_link",
      url:
        "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
    },
  },
  {
    type: "button",
    text: "넵! 확인했습니다!",
    style: "primary",
    action_type: "submit_action",
    action_name: "submit",
    value: "main",
  },
];

/* modals */
/* 퀴즈 풀 때 모달 */
exports.quiz_modal = {
  title: "지난 프로젝트 제목 맞히기!",
  accept: "확인",
  decline: "취소",
  value: "submit_quiz",
  blocks: [
    {
      type: "select",
      name: "select_problem",
      options: [
        {
          text: "Q1. 학교 선생님과 함께하는 OOO 학습 생태계 프로젝트",
          value: "1",
        },
        {
          text: "Q2. 위치기반 정보를 활용한 OO정리 애플리케이션",
          value: "2",
        },
        {
          text: "Q3. 다같이 온라인으로 끝까지 OO하는 확실한 방법!",
          value: "3",
        },
        {
          text: "Q4. OO의 모든 것",
          value: "4",
        },
        {
          text: "Q5. 위험 상황 방지를 위한 OO 모니터링 서비스",
          value: "5",
        },
        {
          text: "Q6. 몰입형 가상 OO 체험 솔루션",
          value: "6",
        },
        {
          text: "Q7. 모두를 위한 인공지능 OO 선생님",
          value: "7",
        },
        {
          text: "Q8. OO 컨텐츠를 활용한 소셜 네트워크 서비스",
          value: "8",
        },
        {
          text: "Q9. 개인 성향을 반영한 OO 추천 플랫폼",
          value: "9",
        },
        {
          text: "Q10. 나만의 프로 OO 코치",
          value: "10",
        },
      ],
      required: true,
      placeholder: "문제를 선택해주세요",
    },
    {
      type: "input",
      name: "answer",
      required: true,
      placeholder: "정답을 입력해주세요",
    },
  ],
};
