package com.tim.db.plan;

import java.sql.Date;
import java.util.List;

import com.tim.entities.Plan;

public interface PlanRepositoryCustom {
	
	public Plan myCustomQuery();
	public Plan findActivePlan(int orgUnitId,Date keyDate);
	public List<Plan> findPlans(int orgUnitId,Date keyDate);
	public List<Plan> findPlans(Date startDate,Date endDate);
}
