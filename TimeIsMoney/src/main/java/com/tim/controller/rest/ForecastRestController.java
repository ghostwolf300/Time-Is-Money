package com.tim.controller.rest;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tim.pojo.DateStatistics;
import com.tim.service.plan.PlanService;

@RestController
@RequestMapping("/forecast")
public class ForecastRestController {
	
	@Autowired
	private PlanService planService;
	
	@RequestMapping("/test")
	public ResponseEntity<Map<String,DateStatistics>> getStatistics(@RequestParam(value="planId") Integer planId){
		//TODO: test this
		Map<String,DateStatistics> stats=planService.getPlanStatistics(planId);
		return new ResponseEntity<Map<String,DateStatistics>>(stats,HttpStatus.OK);
	}

}
