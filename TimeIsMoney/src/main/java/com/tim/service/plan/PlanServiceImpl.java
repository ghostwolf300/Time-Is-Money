package com.tim.service.plan;

import java.sql.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tim.db.plan.PlanRepository;
import com.tim.entities.Plan;

@Service("planService")
public class PlanServiceImpl implements PlanService {
	
	@Autowired
	private PlanRepository planRepository;
	
	@Override
	public Plan findActive(int orgUnitId, Date keyDate) {
		Plan p=planRepository.findActivePlan(orgUnitId, keyDate);
		return p;
	}

}
