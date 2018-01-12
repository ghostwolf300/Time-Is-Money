package com.tim.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tim.db.UserService;
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
	
	@RequestMapping("/{userName}")
	public User getSingleUser(@PathVariable String userName) {
		System.out.println("find user: "+userName);
		User u=userService.findByUsername(userName);
		return u;
	}
	
}
