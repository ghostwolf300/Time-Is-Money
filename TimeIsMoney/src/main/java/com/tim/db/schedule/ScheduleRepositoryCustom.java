package com.tim.db.schedule;

import java.sql.Date;
import java.util.List;

import com.tim.entities.Schedule;

public interface ScheduleRepositoryCustom {
	
	public void myCustomQuery();
	public List<Schedule> findSchedules(int userId,Date startDate,Date endDate);
	
}
