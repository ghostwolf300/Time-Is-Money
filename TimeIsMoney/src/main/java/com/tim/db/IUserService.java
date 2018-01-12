package com.tim.db;


import com.tim.entities.User;

public interface IUserService {
	
	public Iterable<User> findAll();
	public User findByUsername(String username);
	
}
