/* template */
const template = (score, count) => [
	{
		type: 'button',
		text: '🖐출석 하기🖐',
		style: 'default',
		value: 'attendance',
		action_type: 'submit_action',
		action_name: 'submit',
	},
	{
		type: 'button',
		text: '💡퀴즈 풀기💡',
		style: 'default',
		value: 'quiz',
		action_type: 'submit_action',
		action_name: 'submit',
	},
	{
		type: 'button',
		text: `💥강화 하기 (${count})💥`,
		style: 'danger',
		value: 'upgrade',
		action_type: 'submit_action',
		action_name: 'submit',
	},
	{
		type: 'button',
		text: '❗❗❗ 사용 방법 ❗❗❗',
		style: 'default',
		value: 'manual',
		action_type: 'submit_action',
		action_name: 'submit',
	},
	{
		type: 'description',
		term: '🎡 점수',
		content: {
			type: 'text',
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
		type: 'header',
		text: '채팅이 불가능한 채널입니다.',
		style: 'yellow',
	},
	...template(score, count)
];

/* 출석 */
exports.attendance = (score, count) => [
	{
		type: 'header',
		text: '출석이 완료되었습니다 🙂',
		style: 'blue',
	},
	...template(score, count)
];

exports.attendance_fail = (score, count) => [
	{
		type: 'header',
		text: '출석 실패ㅠㅠ 😥(1일 1회만)',
		style: 'red',
	},
	...template(score, count)
];

/* 퀴즈 */
exports.quiz = () => [
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
		value: 'quiz_modal'
	},
];

/* 퀴즈 제출시 결과 */
exports.submit_quiz = (score, isSuccessful) => [
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
exports.upgrade = (score, count, isSuccessful) => [
    {
      "type": "header",
      "text": `강화 ${isSuccessful ? '성공 +1 😎' : '실패 -1 💥💥💥'}!`,
      "style": `${isSuccessful ? 'blue' : 'red'}`
    },
    ...template(score, count)
  ]

/* 설명서 */
exports.manual = () => [
	{
		type: 'header',
		text: '📌 이렇게 사용하세요 !',
		style: 'blue',
	},
    {
      type: "text",
      text: "저희가 준비한 다양한 미니🎲게임을 즐기시면서 최대한 많은 *포인트*✨를 모아보세요! 상위 *N분*에 *상품🎁*을 드립니다!!",
      markdown: true
    },
    {
      type: "text",
      text: "(저희 주머니를 빌렸습니다ㅠ)",
      markdown: true
    },
	{
		type: 'description',
		term: '✅출석',
		content: {
			type: 'text',
			text: '*포인트 1점*과 *강화 횟수 1개*를 드립니다!',
			markdown: true,
		},
		accent: true,
	},
	{
		type: 'description',
		term: '✅문제',
		content: {
			type: 'text',
			text: '*포인트 1점*과 *강화 횟수 1개*를 드립니다!',
			markdown: true,
		},
		accent: true,
	},
	{
		type: 'description',
		term: '✅강화',
		content: {
			type: 'text',
			text: '강화 횟수 당 성공 시 *+1점*, 실패 시 *-1점*이 됩니다. (확률은 *50%* !)',
			markdown: true,
		},
		accent: true,
	},
	{
		type: 'description',
		term: '✅상품',
		content: {
			type: 'text',
			text: 'maybe... 기프티콘s (아래 스벅에서 쓸 것도 있데요..!)',
			markdown: true,
		},
		accent: true,
	},
    {
      type: "text",
      text: "보다 자세한 사항은 👇*아래 링크*👇를 참고해 주세요!!",
      markdown: true
    },
    {
      type: "context",
      content: {
        type: "text",
        text: "[chat-unavailable README.md](https://github.com/HamBP/chat-unavailable)",
        markdown: true
      },
      image: {
        type: "image_link",
        url: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
      }
    }
];

/* modals */
/* 퀴즈 풀 때 모달 */
exports.quiz_modal = {
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