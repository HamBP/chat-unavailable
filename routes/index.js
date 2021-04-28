const express = require('express');
const router = express.Router();
const libKakaoWork = require('../libs/kakaoWork');
const block = require('../libs/block');

router.get('/', async (req, res, next) => {
	// 유저 목록 검색 (1)
	const users = await libKakaoWork.getUserList();

	// 검색된 모든 유저에게 각각 채팅방 생성 (2)
	const conversations = await Promise.all(
		users.map((user) => libKakaoWork.openConversations({ userId: user.id }))
	);

	// 생성된 채팅방에 메세지 전송 (3)
	const messages = await Promise.all([
		conversations.map((conversation) =>
			libKakaoWork.sendMessage({
				conversationId: conversation.id,
				text: '☆★우승시 기프티콘을 드립니다★☆',
				blocks: block.main(5, 3),
			})
		),
	]);

	// 응답값은 자유롭게 작성하셔도 됩니다.
	res.json({
		users,
		conversations,
		messages,
	});
});

router.post('/request', async (req, res, next) => {
	const { message, value } = req.body;

	switch (value) {
		case 'quiz_modal':
			return res.json({
				view: block.quiz_modal,
			});
			break;
		case 'instruction':
			await libKakaoWork.sendMessage({
				conversationId: message.conversationId,
				text: '☆★우승시 기프티콘을 드립니다★☆',
				blocks: block.instruction(),
			})
			break;
		default:
	}

	res.json({});
});

// routes/index.js
router.post('/callback', async (req, res, next) => {
	const { message, actions, action_time, value } = req.body; // 설문조사 결과 확인 (2)

	switch (value) {
		case 'cafe_survey_results':
			// 설문조사 응답 결과 메세지 전송 (3)
			await libKakaoWork.sendMessage({
				conversationId: message.conversation_id,
				text: '설문조사에 응해주셔서 감사합니다!',
				blocks: [
					{
						type: 'text',
						text: '설문조사에 응해주셔서 감사합니다! 🎁',
						markdown: true,
					},
					{
						type: 'text',
						text: '*답변 내용*',
						markdown: true,
					},
					{
						type: 'description',
						term: '평점',
						content: {
							type: 'text',
							text: actions.rating,
							markdown: false,
						},
						accent: true,
					},
					{
						type: 'description',
						term: '바라는 점',
						content: {
							type: 'text',
							text: actions.wanted,
							markdown: false,
						},
						accent: true,
					},
					{
						type: 'description',
						term: '시간',
						content: {
							type: 'text',
							text: action_time,
							markdown: false,
						},
						accent: true,
					},
				],
			});
			break;
		default:
	}

	res.json({ result: true });
});

module.exports = router;