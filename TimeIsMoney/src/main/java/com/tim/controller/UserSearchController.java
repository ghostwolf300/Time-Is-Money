package com.tim.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tim.db.user.UserService;
import com.tim.entities.User;

@RestController
@RequestMapping("/userrecord/search")
public class UserSearchController {
	
	@Autowired
	private UserService userService;
	
	@RequestMapping("/")
	public Iterable<User> getAllUsers(){
		System.out.println("finding all users");
		return userService.findAll();
	}
	
	@RequestMapping("/{username}")
	public ResponseEntity<User> getSingleUser(@PathVariable String username) {
		User u=null;
		if(username!=null) {
			u=userService.findByUsername(username);
		}
		System.out.println("test: "+u.getUsername());
		return new ResponseEntity<User>(u,HttpStatus.OK);
		//return null;
		
	}
	
}
