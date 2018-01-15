package com.tim.db.user;

import com.tim.entities.User;

public interface UserRepositoryCustom {
	public User myQuery(String username);
}
