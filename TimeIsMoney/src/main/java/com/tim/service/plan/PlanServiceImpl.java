package com.tim.service.plan;

import java.sql.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tim.db.forecast.ForecastRepository;
import com.tim.db.plan.PlanRepository;
import com.tim.entities.Forecast;
import com.tim.entities.ForecastHours;
import com.tim.entities.Plan;
import com.tim.pojo.DateStatistics;
import com.tim.pojo.HourStatistics;

@Service("planService")
public class PlanServiceImpl implements PlanService {
	
	@Autowired
	private PlanRepository planRepository;
	
	@Autowired
	private ForecastRepository forecastRepository;
	
	@Override
	public Plan findActive(int orgUnitId, Date keyDate) {
		Plan p=planRepository.findActivePlan(orgUnitId, keyDate);
		return p;
	}

	@Override
	public Map<String, DateStatistics> getPlanStatistics(int planId) {
		//get forecasted hours (test forecast has id 1)
		Forecast forecast=forecastRepository.findById(planId);
		List<ForecastHours> hoursNeeded=forecast.getHoursNeeded();
		Map<String,DateStatistics> stats=new HashMap<String,DateStatistics>();
		for(ForecastHours fh : hoursNeeded) {
			DateStatistics ds=stats.get(fh.getForecastDate().toString());
			if(ds==null) {
				ds=new DateStatistics(fh.getForecastDate());
				stats.put(ds.getDate().toString(), ds);
			}
			ds.addHourStatistics(new HourStatistics(fh.getForecastTime(),fh.getHoursNeeded(),0,0), fh.getForecastTime());
			
		}
		//get scheduled hours
		//get worked hours
		
		return stats;
	}

	@Override
	public Plan find(int planId) {
		return planRepository.findById(planId);
	}

}
