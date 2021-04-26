const controller = require('../libs/schedules/ScheduleController');
const express = require('express');
const router = express.Router();


// 메시지 보내는 트리거
router.get('/', async (req, res, next) => {
    await controller.sendInitialMessage();

    return res.send('응 잘 처리함 ㅎㅎ');
});


// 모달 폼의 내용을 구성하기 위해 클라이언트가 보내는 요청을 받는 라우터.
// JSON 타입의 폼 내용을 응답에 돌려주어야 함.
router.post('/request', async (req, res, next) => {
	const formContent = controller.createModalFormContent(req.body);
	
    return res.json(formContent);
});


// 위에서 전달한 모달 폼의 submit 요청을 받는 라우터.
// JSON 타입으로 { result: true }를 응답에 돌려주면 됨(?).
router.post('/callback', async (req, res, next) => {
    const result = await controller.processFormSubmit(req.body);

    return res.json({ result });
});

module.exports = router;