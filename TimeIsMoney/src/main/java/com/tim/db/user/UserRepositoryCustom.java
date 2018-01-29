package com.tim.db.user;

import java.util.List;

import com.tim.entities.User;
import com.tim.pojo.UserSearchResult;

public interface UserRepositoryCustom {
	public User myQuery(String username);
	public List<User> currentRecords(); 
	public List<UserSearchResult> findAllCustom();
}
