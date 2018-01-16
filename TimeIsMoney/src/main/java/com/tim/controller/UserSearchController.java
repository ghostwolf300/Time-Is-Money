package com.tim.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tim.entities.User;
import com.tim.entities.UserPersonal;
import com.tim.service.UserPersonalService;
import com.tim.service.UserService;

@RestController
@RequestMapping("/userrecord/search")
public class UserSearchController {
	
	@Autowired
	private UserService userService;
	
	@Autowired 
	private UserPersonalService upService;
	
	@RequestMapping("/")
	public ResponseEntity<List<UserPersonal>> getAllUsers(){
		System.out.println("finding all users");
		List<UserPersonal> users=upService.findAll();
		return new ResponseEntity<List<UserPersonal>>(users,HttpStatus.OK);
	}
	
	@RequestMapping("/{username}")
	public ResponseEntity<User> getSingleUser(@PathVariable String username) {
		User u=null;
		if(username!=null) {
			u=userService.findByUsername(username);
		}
		//System.out.println("test: "+u.getUsername());
		return new ResponseEntity<User>(u,HttpStatus.OK);
		
	}
	
}
