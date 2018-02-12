package com.tim.service.worktime;

import java.sql.Date;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tim.db.worktime.WorkTimeRepository;
import com.tim.entities.WorkTime;

@Service("workTimeService")
public class WorkTimeServiceImpl implements WorkTimeService {
	
	@Autowired
	private WorkTimeRepository workTimeRepository;
	
	@Override
	public Map<String, List<WorkTime>> getEmployeeWorkTime(int userId, Date startDate, Date endDate) {
		List<WorkTime> workTimes=workTimeRepository.findByUserIdAndStampInBetween(userId, startDate, endDate);
		Map<String,List<WorkTime>> workTimeMap=null;
		if(workTimes!=null) {
			SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd");
			workTimeMap=new HashMap<String,List<WorkTime>>();
			List<WorkTime> wtDayList=null;
			String dateStr=null;
			for(WorkTime wt : workTimes) {
				dateStr=sdf.format(wt.getStampIn());
				wtDayList=workTimeMap.get(dateStr);
				if(wtDayList==null) {
					wtDayList=new ArrayList<WorkTime>();
					workTimeMap.put(dateStr, wtDayList);
				}
				wtDayList.add(wt);
			}
		}
		return workTimeMap;
	}

	@Override
	public WorkTime saveEmployeeWorkTime(WorkTime workTime) {
		WorkTime wt=workTimeRepository.save(workTime);
		return wt;
	}

}
