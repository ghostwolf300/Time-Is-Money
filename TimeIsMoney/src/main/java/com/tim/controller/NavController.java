package com.tim.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class NavController {
	
	private static enum Views{
		MY_WORK_TIME,
		MANAGER_VIEW,
		SHEDULE_PLANNER,
		USER_RECORD
		};
	
	private static final Map<Views,String> VIEW_MAP=createViewMap();
	private static Map<Views, String> createViewMap() {
        Map<Views,String> map = new HashMap<Views,String>();
        map.put(Views.MY_WORK_TIME, "myworktime");
        map.put(Views.MANAGER_VIEW, "managerview");
        map.put(Views.SHEDULE_PLANNER, "scheduleplanner");
        map.put(Views.USER_RECORD, "userrecord");
        return map;
    }
		
	public NavController() {
		
	}
	
	@RequestMapping("/myworktime")
	public String myWorkTime(Model m) {
		m.addAttribute("viewName", "My Work Time");
		m.addAttribute("viewId",Views.MY_WORK_TIME);
		return VIEW_MAP.get(Views.MY_WORK_TIME);
	}
	
	@RequestMapping("/managerview")
	public String managerView(Model m) {
		m.addAttribute("viewName", "Manager View");
		m.addAttribute("viewId",Views.MANAGER_VIEW);
		return VIEW_MAP.get(Views.MANAGER_VIEW);
	}
	
	@RequestMapping("/scheduleplanner")
	public String schedulePlanner(Model m) {
		m.addAttribute("viewName", "Schedule Planner");
		m.addAttribute("viewId",Views.SHEDULE_PLANNER);
		return VIEW_MAP.get(Views.SHEDULE_PLANNER);
	}
	
	@RequestMapping("/userrecord")
	public String userRecord(Model m) {
		m.addAttribute("viewName", "User Record");
		m.addAttribute("viewId",Views.USER_RECORD);
		return VIEW_MAP.get(Views.USER_RECORD);
	}
	
}
