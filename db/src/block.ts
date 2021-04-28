/* template */
export const template = (score, count) => [
  {
    type: 'button',
    text: '출석하기',
    style: 'default',
    value: 'attendance',
    action_type: 'submit_action',
    action_name: 'submit',
  },
  {
    type: 'button',
    text: '퀴즈 풀기',
    style: 'default',
    value: 'quiz',
    action_type: 'submit_action',
    action_name: 'submit',
  },
  {
    type: 'button',
    text: `강화하기 (${count})`,
    style: 'danger',
    value: 'upgrade',
    action_type: 'submit_action',
    action_name: 'submit',
  },
  {
    type: 'button',
    text: '사용 방법',
    style: 'default',
    value: 'manual',
    action_type: 'submit_action',
    action_name: 'submit',
  },
  {
    type: 'description',
    term: '점수',
    content: {
      type: 'text',
      text: `${score}점`,
      markdown: false,
    },
    accent: true,
  },
];

/* messages */
/* 홈 */
export const main = (score, count) => [
  {
    type: 'header',
    text: '채팅이 불가능한 채널입니다.',
    style: 'blue',
  },
  ...template(score, count),
];

/* 출석 */
export const attendance = (score, count) => [
  {
    type: 'header',
    text: '출석이 완료되었습니다.',
    style: 'blue',
  },
  ...template(score, count),
];

/* 퀴즈 */
export const quiz = () => [
  {
    type: 'header',
    text: '지난 기수 프로젝트 이름은?',
    style: 'blue',
  },
  {
    type: 'text',
    text: '1. 독거노인을 위한 ○○ ○○',
    markdown: true,
  },
  {
    type: 'text',
    text: '2. ...',
    markdown: true,
  },
  {
    type: 'text',
    text: '3. ...',
    markdown: true,
  },
  {
    type: 'text',
    text: '4. ...',
    markdown: true,
  },
  {
    type: 'text',
    text: '5. ...',
    markdown: true,
  },
  {
    type: 'text',
    text: '6. ...',
    markdown: true,
  },
  {
    type: 'text',
    text: '7. ...',
    markdown: true,
  },
  {
    type: 'text',
    text: '8. ...',
    markdown: true,
  },
  {
    type: 'text',
    text: '9. ...',
    markdown: true,
  },
  {
    type: 'text',
    text: '10. ...',
    markdown: true,
  },
  {
    type: 'button',
    text: '문제 풀기',
    style: 'default',
    action_type: 'call_modal',
    value: 'quiz_modal',
  },
];

/* 퀴즈 제출시 결과 */
export const submit_quiz = (score, isSuccessful) => [
  {
    type: 'header',
    text: `${isSuccessful ? '정답입니다.' : '틀렸습니다.'}`,
    style: `${isSuccessful ? 'blue' : 'red'}`,
  },
  {
    type: 'description',
    term: '점수',
    content: {
      type: 'text',
      text: `${score}`,
      markdown: false,
    },
    accent: true,
  },
  {
    type: 'description',
    term: '푼 문제',
    content: {
      type: 'text',
      text: '${}',
      markdown: false,
    },
    accent: true,
  },
  {
    type: 'button',
    text: '메뉴 보기',
    style: 'default',
    value: 'main',
    action_type: 'submit_action',
    action_name: 'submit',
  },
];

/* 강화 */
export const upgrade = (score, count, isSuccessful) => [
  {
    type: 'header',
    text: `강화 ${isSuccessful ? '성공' : '실패'}!`,
    style: `${isSuccessful ? 'blue' : 'red'}`,
  },
  ...template(score, count),
];

/* 설명서 */
export const manual = () => [
  {
    type: 'header',
    text: '이렇게 사용하세요',
    style: 'blue',
  },
  {
    type: 'description',
    term: '출석',
    content: {
      type: 'text',
      text: '1점과 강화 횟수 1회를 드립니다.',
      markdown: false,
    },
    accent: true,
  },
  {
    type: 'description',
    term: '문제',
    content: {
      type: 'text',
      text:
        '1점과 강화 횟수 1회를 드립니다. 원하는 문제만 선택하여 풀 수 있습니다.',
      markdown: true,
    },
    accent: true,
  },
  {
    type: 'description',
    term: '강화',
    content: {
      type: 'text',
      text: '강화 성공시 1점, 실패시 -1점을 드립니다. 확률은 50% 입니다.',
      markdown: false,
    },
    accent: true,
  },
  {
    type: 'description',
    term: '상품',
    content: {
      type: 'text',
      text: '네??',
      markdown: false,
    },
    accent: true,
  },
];

/* modals */
/* 퀴즈 풀 때 모달 */
export const quiz_modal = {
  title: '지난 프로젝트 제목 맞히기!',
  accept: '확인',
  decline: '취소',
  value: 'submit_quiz',
  blocks: [
    {
      type: 'select',
      name: 'select_problem',
      options: [
        {
          text: '문제 1',
          value: '1',
        },
        {
          text: '문제 2',
          value: '2',
        },
        {
          text: '문제 3',
          value: '3',
        },
        {
          text: '문제 4',
          value: '4',
        },
        {
          text: '문제 5',
          value: '5',
        },
        {
          text: '문제 6',
          value: '6',
        },
        {
          text: '문제 7',
          value: '7',
        },
        {
          text: '문제 8',
          value: '8',
        },
        {
          text: '문제 9',
          value: '9',
        },
        {
          text: '문제 10',
          value: '10',
        },
      ],
      required: true,
      placeholder: '문제를 선택해주세요',
    },
    {
      type: 'input',
      name: 'answer',
      required: true,
      placeholder: '정답을 입력해주세요',
    },
  ],
};
