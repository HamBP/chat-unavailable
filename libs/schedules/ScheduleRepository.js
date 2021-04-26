class ScheduleRepository {
	constructor() {
		this.schedules = [];
	}
	
	saveSchedule(schedule) {
		// 일단은 로컬에다가 저장!
		this.schedules.push(schedule);
	}
	
	getIncommingUnnotifiedSchedules() {
		return this.schedules.filter((s) => s.isIncoming() && !s.isNotified);
	}
	
	markScheduleNotified(schedule) {
		schedule.isNotified = true;
	}
}

const scheduleRepository = new ScheduleRepository();

module.exports = scheduleRepository;
