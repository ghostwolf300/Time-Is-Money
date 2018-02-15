package com.tim.service.rounding;

import java.sql.Date;
import java.sql.Time;
import java.sql.Timestamp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tim.db.rounding.RoundingRepository;
import com.tim.db.schedule.ScheduleRepository;
import com.tim.entities.RoundingRule;
import com.tim.entities.Schedule;

@Service("roundingService")
public class RoundingServiceImpl implements RoundingService {
	
	@Autowired
	private RoundingRepository roundingRepository;
	
	@Autowired
	private ScheduleRepository scheduleRepository;
	
	@Override
	public Time roundTimestamp(int userId, Timestamp ts, int direction) {
		//find rounding rule that is active on ts date for employee
		Schedule schedule=null;
		RoundingRule rule=null;
		Time time=null;
		if(direction==RoundingService.DIRECTION_IN) {
			rule=roundingRepository.findById(1);
			schedule=scheduleRepository.findScheduleByStampIn(userId, ts, rule.getSecondsBefore(), rule.getSecondsAfter());
		}
		else {
			rule=roundingRepository.findById(2);
			schedule=scheduleRepository.findScheduleByStampOut(userId, ts, rule.getSecondsBefore(), rule.getSecondsAfter());
		}
		//find schedules that start/end within rounding limits
		
		
		if(schedule!=null) {
			if(direction==RoundingService.DIRECTION_IN) {
				time=schedule.getStart();
			}
			else {
				time=schedule.getEnd();
			}
		}
		else {
			time=new Time(ts.getTime());
		}
		return time;
	}

	@Override
	public void applyRoundingRule(int userId, Date startDate, Date endDate) {
		// TODO Auto-generated method stub

	}

}
