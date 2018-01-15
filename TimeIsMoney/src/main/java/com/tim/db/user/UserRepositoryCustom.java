package com.tim.db.user;

import java.util.List;

import com.tim.entities.User;

public interface UserRepositoryCustom {
	public User myQuery(String username);
	public List<User> currentRecords(); 
}
