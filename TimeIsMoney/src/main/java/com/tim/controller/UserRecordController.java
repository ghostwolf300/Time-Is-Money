package com.tim.controller;

import java.sql.Date;
import java.util.Calendar;
import java.util.Iterator;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.tim.db.IUserPersonalService;
import com.tim.db.IUserService;
import com.tim.entities.User;
import com.tim.entities.UserPersonal;
import com.tim.entities.UserPersonalKey;
import com.tim.entities.UserRole;

@Controller
public class UserRecordController {
	
	private static final String VIEW_NAME="User Record";
	
	@Autowired
	private IUserService userService;
	
	@Autowired
	private IUserPersonalService userPersonalService;
	
	@RequestMapping("/userrecord")
	public String myWorkTime(Model m) {
		User u=userService.findByUsername("visus");
		//System.out.println("User: "+u.getFirstName()+" "+u.getLastName());
		for(UserRole urole : u.getUserRolesSet()) {
			System.out.println(urole.getRole().getRoleName());
		}
		Calendar c=Calendar.getInstance();
		c.set(2018, 0, 1);
		Date d=new Date(c.getTimeInMillis());
		UserPersonalKey key=new UserPersonalKey(7,d);
		System.out.println(key);
		UserPersonal uP=userPersonalService.findByUserPersonalKey(key);
		//UserPersonal uP=userPersonalService.findByUserIdAndStartDate(7, d);
		System.out.println("Name: "+uP.getFirstName()+" "+uP.getLastName());
		m.addAttribute("viewName", VIEW_NAME);
		return "userrecord";
	}
}
