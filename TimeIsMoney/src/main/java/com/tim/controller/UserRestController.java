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

import com.tim.db.userpersonal.UserPersonalService;
import com.tim.entities.UserPersonal;
import com.tim.entities.UserRole;

@RestController
@RequestMapping("/userrecord/show/{userId}")
public class UserRestController {
	
	@Autowired
	private UserPersonalService userPersonalService;
	
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
	
	@RequestMapping("/roledetails")
	public ResponseEntity<List<UserRole>> getRoleDetails(){
		System.out.println("retrieving role details...");
		return null;
	}

}
