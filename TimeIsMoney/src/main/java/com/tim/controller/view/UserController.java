package com.tim.controller.view;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tim.entities.User;
import com.tim.service.user.UserService;

@RestController
@RequestMapping("/users")
public class UserController {
	
	@Autowired
	private UserService userService;
	
	@RequestMapping("/")
	public Iterable<User> getAllUsers(){
		return userService.findAll();
	}
	
	@RequestMapping("/{userName}")
	public User getSingleUser(@PathVariable String userName) {
		System.out.println("find user: "+userName);
		User u=userService.findByUsername(userName);
		return u;
	}

}
