package com.tim.controller;

import java.sql.Date;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tim.entities.Plan;
import com.tim.pojo.DateStatistics;
import com.tim.service.plan.PlanService;

@RestController
@RequestMapping("/plans")
public class PlanRestController {
	
	@Autowired
	private PlanService planService;
	
	@RequestMapping(value="/active")
	public ResponseEntity<Plan> getActivePlan(
			@RequestParam(value="orgUnitId") Integer orgUnitId, 
			@RequestParam(value="keyDate") Date keyDate) {
		Plan p=planService.findActive(orgUnitId, keyDate);
		if(p==null) {
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		}
		return new ResponseEntity<Plan>(p,HttpStatus.OK);
	}
	
	@RequestMapping(value="/find")
	public ResponseEntity<Plan> getPlan(
			@RequestParam(value="planId") Integer planId) {
		Plan p=planService.find(planId);
		
		if(p==null) {
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		}
		return new ResponseEntity<Plan>(p,HttpStatus.OK);
	}
	
	
}
