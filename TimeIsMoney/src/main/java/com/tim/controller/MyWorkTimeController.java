package com.tim.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class MyWorkTimeController {
	
	private static final String VIEW_NAME="My Work Time";
	
	@RequestMapping("/myworktime")
	public String myWorkTime(Model m) {
		m.addAttribute("viewName", VIEW_NAME);
		return "myworktime";
	}
	
}
