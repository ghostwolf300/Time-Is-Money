package com.tim.controller;

import java.sql.Date;
import java.util.Calendar;
import java.util.Iterator;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.tim.db.UserPersonalService;
import com.tim.db.user.UserService;
import com.tim.entities.User;
import com.tim.entities.UserPersonal;
import com.tim.entities.UserPersonalKey;
import com.tim.entities.UserRole;

@Controller
public class UserRecordController {
	
	private static final String VIEW_NAME="User Record";
	
	@Autowired
	private UserService userService;
	
	@RequestMapping("/userrecord")
	public String myWorkTime(Model m) {
		User u=userService.currentRecord("visus");
		System.out.println("user found: "+u.getUsername());
		m.addAttribute("viewName", VIEW_NAME);
		return "userrecord";
	}
}
