package com.tim.db.schedule;

import java.sql.Date;
import java.sql.Timestamp;
import java.util.List;

import com.tim.entities.Schedule;

public interface ScheduleRepositoryCustom {
	
	public void myCustomQuery();
	public List<Schedule> findSchedules(int userId,Date startDate,Date endDate);
	public Schedule findScheduleByStampIn(int userId,Timestamp in,int secondsBefore,int secondsAfter);
	public Schedule findScheduleByStampOut(int userId,Timestamp out,int secondsBefore,int secondsAfter);
	
}
