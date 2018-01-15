package com.tim.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tim.db.user.UserService;
import com.tim.entities.User;
import com.tim.entities.UserPersonal;

@RestController
@RequestMapping("/userrecord/search")
public class UserSearchController {
	
	@Autowired
	private UserService userService;
	
	@RequestMapping("/")
	public ResponseEntity<List<User>> getAllUsers(){
		System.out.println("finding all users");
		List<User> users=userService.currentRecords();
		if(users!=null) {
			System.out.println("user count: "+users.size());
		}
		return new ResponseEntity<List<User>>(users,HttpStatus.OK);
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
