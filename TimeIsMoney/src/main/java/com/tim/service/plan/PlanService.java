package com.tim.service.plan;

import java.sql.Date;

import com.tim.entities.Plan;

public interface PlanService {
	
	public Plan findActive(int orgUnitId,Date keyDate);
	
}
