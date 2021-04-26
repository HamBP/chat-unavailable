class ScheduleRepository {
	constructor() {
		this.schedules = [];
	}
	
	saveSchedule(schedule) {
		// 일단은 로컬에다가 저장!
		this.schedules.push(schedule);
	}
	
	getIncommingSchedules() {
		return this.schedules.filter((s) => s.isIncoming());
	}
}

const scheduleRepository = new ScheduleRepository();

module.exports = scheduleRepository;
