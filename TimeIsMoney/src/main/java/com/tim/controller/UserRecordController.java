package com.tim.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/userrecord")
public class UserRecordController {
	
	@RequestMapping("/")
	public String myWorkTime(Model m) {
		return "userrecord";
	}
}
