package com.tim.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/managerview")
public class ManagerViewController {
	
	@RequestMapping("/")
	public String myWorkTime(Model m) {
		return "managerview";
	}
	
}
