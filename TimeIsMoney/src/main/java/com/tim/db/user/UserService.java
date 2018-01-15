package com.tim.db.user;

import com.tim.entities.User;

public interface UserService {
	
	public Iterable<User> findAll();
	public User findByUsername(String username);
	public User findByUserPersonalSetLastName(String lastName);
	public User currentRecord(String username);
	
}
