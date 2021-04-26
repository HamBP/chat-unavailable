const repository = require('./ScheduleRepository');
const libKakaoWork = require('../kakaoWork');

class ScheduleService {
	
    async broadcastMessage({ text, blocks }) {
        // 유저 목록 검색 (1)
        const users = await libKakaoWork.getUserList();

        // 검색된 모든 유저에게 각각 채팅방 생성 (2)
        const conversations = await Promise.all(
            users.map((user) => libKakaoWork.openConversations({ userId: user.id }))
        );
		
        // 생성된 채팅방에 메세지 전송 (3)
        const messages = await Promise.all([
            conversations.map((conversation) => libKakaoWork.sendMessage({
				conversationId: conversation.id,
				text,
				blocks
			}))
        ]);
    }
		
    async sendScheduleAddedMessage(conversationId, schedule) {
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
                    text: schedule.title,
                    markdown: true,
                },
                {
                    type: 'description',
                    term: '일시',
                    content: {
                        type: 'text',
                        text: schedule.datetimeString(),
                        markdown: false,
                    },
                    accent: true,
                },
            ],
        });
    }
	
	async sendFailedToAddScheduleMessage(conversationId) {
        await libKakaoWork.sendMessage({
            conversationId: conversationId,
            text: '일정 설정 실패!!!!!!!!!!.',
            blocks: [
                {
                    type: 'header',
                    text: '이사람아 그렇게 쓰면 안되지!!!!.',
                    style: 'blue',
                },
                {
                    type: 'button',
                    text: '다시하기',
                    style: 'default',
                    action_type: 'call_modal',
                    value: 'set_datetime',
                },
            ],
        });
    }
	
    async saveSchedule(schedule) {
        await repository.saveSchedule(schedule);
    }
	
	async sendScheduleNotifications() {
		console.log('알림이 필요한 일정 확인중...');
		
		const schedulesToSendNotifications = repository.getIncommingUnnotifiedSchedules();
		
		console.log(`알림이 필요한 일정: ${schedulesToSendNotifications.length}개`);

		for (const s of schedulesToSendNotifications) {
			console.log(`알림 보내는 중: ${s.title}`);

			await this._sendScheduleNotification(s);
			repository.markScheduleNotified(s);
		}
	}
	
	async _sendScheduleNotification(schedule) {
		
		await this.broadcastMessage({
			text: '일정 알림',
            blocks: [
                {
                    type: 'header',
                    text: '일정이 다가와요!!!',
                    style: 'blue',
                },
                {
                    type: 'text',
                    text: schedule.title,
                    markdown: true,
                },
                {
                    type: 'description',
                    term: '일시',
                    content: {
                        type: 'text',
                        text: schedule.datetimeString(),
                        markdown: false,
                    },
                    accent: true,
                },
            ],
		});
	}
}

const scheduleService = new ScheduleService();

module.exports = scheduleService;