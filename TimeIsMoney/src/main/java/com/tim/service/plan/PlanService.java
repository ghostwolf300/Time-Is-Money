package com.tim.service.plan;

import java.sql.Date;
import java.util.Map;

import com.tim.entities.Plan;
import com.tim.pojo.DateStatistics;

public interface PlanService {
	
	public Plan find(int planId);
	public Plan findActive(int orgUnitId,Date keyDate);
	public Map<String,DateStatistics> getPlanStatistics(int planId);
	
}
