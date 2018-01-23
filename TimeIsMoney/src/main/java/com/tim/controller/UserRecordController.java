package com.tim.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class UserRecordController {
	
	private static final String VIEW_NAME="User Record";
	
	/*@RequestMapping("/userrecord")
	public String myWorkTime(Model m) {
		m.addAttribute("viewName", VIEW_NAME);
		return "userrecord";
	}*/
}
