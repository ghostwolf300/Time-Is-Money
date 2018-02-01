package com.tim.controller;

import java.sql.Date;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tim.entities.Schedule;
import com.tim.service.schedule.ScheduleService;

@RestController
@RequestMapping("/schedules")
public class ScheduleRestController {
	
	@Autowired
	private ScheduleService scheduleService;
	
	@RequestMapping(value="/save", method=RequestMethod.POST)
	public ResponseEntity<Schedule> saveSchedule(
			@RequestParam(value="userId") Integer userId,
			@RequestBody Schedule schedule){
		Schedule saved=scheduleService.save(schedule);
		System.out.println("Schedule saved");
		return new ResponseEntity<Schedule>(saved,HttpStatus.OK);
	}
	
	@RequestMapping(value="/find")
	public ResponseEntity<Map<String,Schedule>> getSchedules(
			@RequestParam(value="userId") Integer userId,
			@RequestParam(value="startDate") Date startDate,
			@RequestParam(value="endDate") Date endDate){
		Map<String,Schedule> scheduleMap=scheduleService.findMap(userId, startDate, endDate);
		if(scheduleMap==null) {
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		}
		return new ResponseEntity<Map<String,Schedule>>(scheduleMap,HttpStatus.OK);
	}

}
