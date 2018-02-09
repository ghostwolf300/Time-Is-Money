package com.tim.controller;

import java.sql.Date;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tim.entities.WorkTime;
import com.tim.service.worktime.WorkTimeService;

@RestController
@RequestMapping("/worktimes")
public class WorkTimeRestController {
	
	@Autowired
	private WorkTimeService workTimeService;
	
	@RequestMapping("/show")
	public ResponseEntity<Map<String,List<WorkTime>>> getWorkTime(
			@RequestParam(value="userId") Integer userId,
			@RequestParam(value="startDate") Date startDate,
			@RequestParam(value="endDate") Date endDate){
		Map<String,List<WorkTime>> workTimeMap=workTimeService.getEmployeeWorkTime(userId, startDate, endDate);
		if(workTimeMap==null) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
		return new ResponseEntity<Map<String,List<WorkTime>>>(workTimeMap,HttpStatus.OK);
	}
	

}
