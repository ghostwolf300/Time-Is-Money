package com.tim.service.schedule;

import java.sql.Date;
import java.util.List;
import java.util.Map;

import com.tim.entities.Schedule;

public interface ScheduleService {
	
	public List<Schedule> findList(int userId,Date startDate,Date endDate);
	public Map<String,Schedule> findMap(int userId,int planId,int orgUnitId);
	public Schedule save(Schedule schedule);
	public int remove(int id);

}
