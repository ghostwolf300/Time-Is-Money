package com.tim.controller;

import java.util.Iterator;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.tim.db.UserService;
import com.tim.entities.User;
import com.tim.entities.UserRole;

@Controller
public class UserRecordController {
	
	private static final String VIEW_NAME="User Record";
	
	@Autowired
	private UserService userService;
	
	@RequestMapping("/userrecord")
	public String myWorkTime(Model m) {
		User u=userService.findByUsername("visus");
		System.out.println("User: "+u.getFirstName()+" "+u.getLastName());
		for(UserRole urole : u.getUserRolesSet()) {
			System.out.println(urole.getRole().getRoleName());
		}
		m.addAttribute("viewName", VIEW_NAME);
		return "userrecord";
	}
}
