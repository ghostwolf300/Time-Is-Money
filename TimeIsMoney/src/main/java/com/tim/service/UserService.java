package com.tim.service;

import java.util.List;

import com.tim.entities.Role;
import com.tim.entities.User;

public interface UserService {
	
	public List<User> findAll();
	public User findByUsername(String username);
	public User findByUserPersonalSetLastName(String lastName);
	public User currentRecord(String username);
	public List<User> currentRecords();
	public List<Role> findRolesByUserId(int userId);
	
}
