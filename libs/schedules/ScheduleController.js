const Schedule = require('./Schedule');
const libKakaoWork = require('../kakaoWork');
const scheduleRepository = require('./ScheduleRepository');

class ScheduleConroller {
	/**
	 * 맨 처음에 사용자에게 메시지를 보냅니다.
	 */
    async sendInitialMessage() {
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
                    text: '환영합니다.',
                    blocks: [
                        {
                            type: 'text',
                            text: '일정을 등록해 보세요!',
                            markdown: false,
                        },
                        {
                            type: 'button',
                            text: '설정하기',
                            style: 'default',
                            action_type: 'call_modal',
                            value: 'set_datetime',
                        },
                    ],
                })
            ),
        ]);
    }

	/**
	 * 적절한 모달 폼 내용을 생성합니다.
	 *
	 * @return 폼 내용이 될 객체. 스트링 아님! 객체임! 
	 */
    createModalFormContent({ message, value }) {
        const formType = value;

        switch (formType) {
            case 'set_datetime':
                return this._createNewScheduleFormContent();
            default:
                throw new Error('그런 타입 없다!!!!!!!!!!!');
        }
    }

    _createNewScheduleFormContent() {
        return {
            view: {
                title: 'modal title',
                accept: '확인',
                decline: '취소',
                value: 'request_datetime',
                blocks: [
                    {
                        type: 'label',
                        text: '일정 등록',
                        markdown: true,
                    },
                    {
                        type: 'input',
                        name: 'title',
                        required: false,
                        placeholder: '무슨 일을 하시나요?',
                    },
                    {
                        type: 'input',
                        name: 'datetime',
                        required: false,
                        placeholder: '언제 하시나요? (ex. 04-26-1630)',
                    },
                ],
            },
        };
    }

	/**
	 * 사용자의 모달 폼 제출을 처리합니다.
	 *
	 * @return 성공 여부. (근데 항상 true로 성공임 ㅎㅎ)
	 */
    async processFormSubmit(requestBody) {
        const formType = requestBody.value;

        switch (formType) {
            case 'request_datetime':
                return this._processNewSchedule(requestBody);
            default:
                throw new Error('Fail!!!!!');
        }
    }

    async _processNewSchedule({ message, value, actions}) {		
        const newSchedule = new Schedule(actions.title, actions.datetime);
		
		await this._saveSchedule(newSchedule);
        await this._sendScheduleCompletedMessage(message.conversation_id, newSchedule);

        return true;
    }

    async _saveSchedule(schedule) {
        await scheduleRepository.saveSchedule(schedule);
    }

    async _sendScheduleCompletedMessage(conversationId, schedule) {
        await libKakaoWork.sendMessage({
            conversationId: conversationId,
            text: '일정이 설정되었습니다.',
            blocks: [
                {
                    type: 'header',
                    text: '일정이 저장되었습니다.',
                    style: 'blue',
                },
                {
                    type: 'text',
                    text: schedule.title || "아아아아아ㅏㄱ 타이틀이없어",
                    markdown: true,
                },
                {
                    type: 'description',
                    term: '일시',
                    content: {
                        type: 'text',
                        text: schedule.datetime || "아아아ㅏ아ㅏㄱ 날짜가없어", // TODO 일단 스트링
                        markdown: false,
                    },
                    accent: true,
                },
            ],
        });
    }
}

const scheduleController = new ScheduleConroller();

module.exports = scheduleController;