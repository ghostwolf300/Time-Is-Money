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
import com.tim.pojo.UserSearchResult;
import com.tim.service.user.UserPersonalService;
import com.tim.service.user.UserService;

@RestController
@RequestMapping("/userrecord/search")
public class UserSearchController {
	
	@Autowired
	private UserService userService;
	
	@Autowired 
	private UserPersonalService upService;
	
	@RequestMapping("/")
	public ResponseEntity<List<UserSearchResult>> getAllUsers(){
		System.out.println("finding all users");
		List<UserSearchResult> users=userService.findAllCustom();
		return new ResponseEntity<List<UserSearchResult>>(users,HttpStatus.OK);
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
