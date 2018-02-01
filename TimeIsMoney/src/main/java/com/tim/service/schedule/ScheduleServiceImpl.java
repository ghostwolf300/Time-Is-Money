package com.tim.service.schedule;

import java.sql.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tim.db.schedule.ScheduleRepository;
import com.tim.entities.Schedule;

@Service("scheduleService")
public class ScheduleServiceImpl implements ScheduleService {
	
	@Autowired
	private ScheduleRepository scheduleRepository;
	
	@Override
	public Schedule save(Schedule schedule) {
		Schedule saved=scheduleRepository.save(schedule);
		return saved;
	}

	@Override
	public List<Schedule> findList(int userId, Date startDate, Date endDate) {
		return scheduleRepository.findSchedules(userId, startDate, endDate);
	}

	@Override
	public Map<String, Schedule> findMap(int userId, Date startDate, Date endDate) {
		List<Schedule> schedules=scheduleRepository.findSchedules(userId, startDate, endDate);
		Map<String,Schedule> scheduleMap=null;
		if(schedules!=null) {
			scheduleMap=new HashMap<String,Schedule>();
			for(Schedule s : schedules) {
				scheduleMap.put(s.getScheduleDate().toString(),s);
			}
		}
		return scheduleMap;
	}
	

}
