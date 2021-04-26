const moment = require('moment');

class Schedule {
	constructor(title, datetimeString) {
		this.title = title;
		this.datetime = this._parseDateString(datetimeString);
		this.isNotified = false;
	}
	
	_parseDateString(datetimeString) {
		const allowedDatetimePatterns = [
			'YYYY-MM-DD HH:mm:ss',
			'MM-DD HH:mm'
		];
		
		const parsed = moment(datetimeString, allowedDatetimePatterns, true);
		
		if (!parsed.isValid()) {
			throw new Error(`날짜 이상해!!!!!!!!!!!!! ${datetimeString}가 뭐야!!!!!!!!!!!!`);
		}
		
		return parsed;
	}
		
	isIncoming(paddingMinutes/*몇분 전에 알릴까요*/=10) {
		const now = moment(); 
		const eventNotificationTiming = this.datetime.subtract(paddingMinutes, 'minutes');
		
		return now.isAfter(eventNotificationTiming) && now.isBefore(this.datetime);
	}
}

module.exports = Schedule;