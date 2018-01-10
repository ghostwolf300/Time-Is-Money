package com.tim.db;


import com.tim.entities.User;

public interface UserService {
	
	public Iterable<User> findAll();
	public User findByUserName(String userName);
	
}
