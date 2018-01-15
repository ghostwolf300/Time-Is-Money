package com.tim.db.user;

import java.util.List;

import com.tim.entities.User;

public interface UserService {
	
	public List<User> findAll();
	public User findByUsername(String username);
	public User findByUserPersonalSetLastName(String lastName);
	public User currentRecord(String username);
	public List<User> currentRecords();
	
}
