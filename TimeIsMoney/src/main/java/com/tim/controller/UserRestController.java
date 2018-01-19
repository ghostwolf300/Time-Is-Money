package com.tim.controller;

import java.sql.Date;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tim.component.TIMSessionInfo;
import com.tim.entities.Role;
import com.tim.entities.User;
import com.tim.entities.UserAssignment;
import com.tim.entities.UserContract;
import com.tim.entities.UserPersonal;
import com.tim.entities.UserRole;
import com.tim.service.UserPersonalService;
import com.tim.service.UserService;

@RestController
@RequestMapping("/userrecord/show/{userId}")
public class UserRestController {
	
	@Autowired
	private UserService userService;
	
	@Autowired
	private TIMSessionInfo sessionInfo;
	
	@RequestMapping("/personaldetails")
	public ResponseEntity<UserPersonal> getPersonalDetails(@PathVariable int userId){
		UserPersonal up=userService.findPersonalByKeyDate(userId, getDateObject("2018-01-01"));
		return new ResponseEntity<UserPersonal>(up,HttpStatus.OK);
	}
	
	@RequestMapping("/personaldetails/next")
	public ResponseEntity<UserPersonal> getNextPersonalDetails(@PathVariable int userId, @RequestParam("keyDate") Date date){
		UserPersonal up=userService.findNextPersonal(userId, date);
		return new ResponseEntity<UserPersonal>(up,HttpStatus.OK);
	}
	
	@RequestMapping("/personaldetails/prev")
	public ResponseEntity<UserPersonal> getPreviousPersonalDetails(@PathVariable int userId, @RequestParam("keyDate") Date date){
		UserPersonal up=userService.findPreviousPersonal(userId, date);
		return new ResponseEntity<UserPersonal>(up,HttpStatus.OK);
	}
	
	@RequestMapping(value="/personaldetails/save", method=RequestMethod.POST)
	public ResponseEntity<UserPersonal> savePersonalDetails(@PathVariable int userId, @RequestBody UserPersonal personalDetail){
		System.out.println("sent JSON userId: "+personalDetail.getUserPersonalKey().getUserId());
		personalDetail.setChangedBy(sessionInfo.getCurrentUser().getId());
		userService.savePersonalData(personalDetail);
		return new ResponseEntity<UserPersonal>(personalDetail,HttpStatus.OK);
	}
	
	@RequestMapping("/contractdetails")
	public ResponseEntity<UserContract> getContractDetails(@PathVariable int userId){
		UserContract uc=userService.findContractByKeyDate(userId, getDateObject("2018-01-01"));
		return new ResponseEntity<UserContract>(uc,HttpStatus.OK);
	}
	
	@RequestMapping("/contractdetails/next")
	public ResponseEntity<UserContract> getNextContractDetails(@PathVariable int userId, @RequestParam("keyDate") Date date){
		UserContract uc=userService.findNextContract(userId, date);
		return new ResponseEntity<UserContract>(uc,HttpStatus.OK);
	}
	
	@RequestMapping("/contractdetails/prev")
	public ResponseEntity<UserContract> getPreviousContractDetails(@PathVariable int userId, @RequestParam("keyDate") Date date){
		UserContract uc=userService.findPreviousContract(userId, date);
		return new ResponseEntity<UserContract>(uc,HttpStatus.OK);
	}
	
	@RequestMapping("/assignmentdetails")
	public ResponseEntity<UserAssignment> getAssignmentDetails(@PathVariable int userId){
		UserAssignment ua=userService.findAssignmentByKeyDate(userId, getDateObject("2018-01-01"));
		return new ResponseEntity<UserAssignment>(ua,HttpStatus.OK);
	}
	
	@RequestMapping("/assignmentdetails/next")
	public ResponseEntity<UserAssignment> getNextAssignmentDetails(@PathVariable int userId, @RequestParam("keyDate") Date date){
		UserAssignment ua=userService.findNextAssignment(userId, date);
		return new ResponseEntity<UserAssignment>(ua,HttpStatus.OK);
	}
	
	@RequestMapping("/assignmentdetails/prev")
	public ResponseEntity<UserAssignment> getPreviousAssignmentDetails(@PathVariable int userId, @RequestParam("keyDate") Date date){
		UserAssignment ua=userService.findPreviousAssignment(userId, date);
		return new ResponseEntity<UserAssignment>(ua,HttpStatus.OK);
	}
	
	@RequestMapping("/credentialsdetails")
	public ResponseEntity<User> getCredentialsDetails(@PathVariable int userId){
		User u=userService.findByUserId(userId);
		return new ResponseEntity<User>(u,HttpStatus.OK);
	}
	
	@RequestMapping("/roledetails")
	public ResponseEntity<List<UserRole>> getRoleDetails(@PathVariable int userId){
		List<UserRole> roles=userService.findRolesByUserId(userId);
		return new ResponseEntity<List<UserRole>>(roles,HttpStatus.OK);
	}
	
	private Date getDateObject(String dateString) {
		SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd");
		Date d=null;
		try {
			d = new Date(sdf.parse(dateString).getTime());
		} 
		catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return d;
	}

}
