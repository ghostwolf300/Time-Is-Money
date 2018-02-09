package com.tim.service.worktime;

import java.sql.Date;
import java.util.List;
import java.util.Map;

import com.tim.entities.WorkTime;

public interface WorkTimeService {
	
	public Map<String,List<WorkTime>> getEmployeeWorkTime(int userId,Date startDate,Date endDate);
	public WorkTime saveEmployeeWorkTime(WorkTime workTime);

}
