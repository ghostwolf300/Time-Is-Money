package com.tim.service.plan;

import java.sql.Date;
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
		Plan plan=planRepository.findById(planId);
		//get forecasted hours (test forecast has id 1)
		Forecast forecast=forecastRepository.findById(1);
		List<ForecastHours> hoursNeeded=forecast.getHoursNeeded();
		for(ForecastHours fh : hoursNeeded) {
			System.out.println(fh.getForecastDate()+" "+fh.getForecastTime()+" : "+fh.getHoursNeeded());
		}
		//get scheduled hours
		//get worked hours
		
		return null;
	}

}
