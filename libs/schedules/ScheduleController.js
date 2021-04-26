const service = require('./ScheduleService');
const Schedule = require('./Schedule');

class ScheduleConroller {
    async sendInitialMessage() {
        await service.broadcastMessage({
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
        });
    }

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
                        placeholder: '언제 하시나요? (ex. 04-26 16:30)',
                    },
                ],
            },
        };
    }

    async processModalFormSubmit(requestBody) {
        const formType = requestBody.value;

        switch (formType) {
            case 'request_datetime':
                return this._processNewSchedule(requestBody);
            default:
                throw new Error('Fail!!!!!');
        }
    }

    async _processNewSchedule({ message, value, actions }) {
        try {
            const newSchedule = new Schedule(actions.title, actions.datetime);

            await service.saveSchedule(newSchedule);
			await service.sendScheduleAddedMessage(message.conversation_id, newSchedule);

            return true;
        } catch (e) {
            await service.sendFailedToAddScheduleMessage(message.conversation_id);

            return false;
        }
    }
}

const scheduleController = new ScheduleConroller();

module.exports = scheduleController;