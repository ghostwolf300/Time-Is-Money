package com.tim.controller;

import java.sql.Date;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tim.entities.Role;
import com.tim.entities.User;
import com.tim.entities.UserContract;
import com.tim.entities.UserPersonal;
import com.tim.entities.UserRole;
import com.tim.service.UserPersonalService;
import com.tim.service.UserService;

@RestController
@RequestMapping("/userrecord/show/{userId}")
public class UserRestController {
	
	@Autowired
	private UserPersonalService userPersonalService;
	
	@Autowired
	private UserService userService;
	
	@RequestMapping("/personaldetails")
	public ResponseEntity<UserPersonal> getPersonalDetails(@PathVariable int userId){
		System.out.println("retrieving personal details...");
		SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd");
		Date d=null;
		try {
			d = new Date(sdf.parse("2018-01-01").getTime());
		} 
		catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		UserPersonal up=userPersonalService.findByUserIdAndStartDate(userId, d);
		System.out.println("We found: "+up.getUser().getUsername());
		return new ResponseEntity<UserPersonal>(up,HttpStatus.OK);
	}
	
	@RequestMapping("/contractdetails")
	public ResponseEntity<UserContract> getContractDetails(@PathVariable int userId){
		SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd");
		Date d=null;
		try {
			d = new Date(sdf.parse("2018-01-01").getTime());
		} 
		catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		UserContract uc=userService.findContractByKeyDate(userId, d);
		return new ResponseEntity<UserContract>(uc,HttpStatus.OK);
	}
	
	@RequestMapping("/credentialsdetails")
	public ResponseEntity<User> getCredentialsDetails(@PathVariable int userId){
		User u=userService.findByUserId(userId);
		return new ResponseEntity<User>(u,HttpStatus.OK);
	}
	
	@RequestMapping("/roledetails")
	public ResponseEntity<List<UserRole>> getRoleDetails(@PathVariable int userId){
		System.out.println("retrieving role details...");
		List<UserRole> roles=userService.findRolesByUserId(userId);
		for(UserRole r : roles) {
			System.out.println("has role "+r.getRole().getRoleName());
		}
		return new ResponseEntity<List<UserRole>>(roles,HttpStatus.OK);
	}

}
