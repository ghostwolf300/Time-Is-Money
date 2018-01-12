package com.tim.db;

import java.sql.Date;

import org.springframework.data.repository.CrudRepository;

import com.tim.entities.UserPersonal;
import com.tim.entities.UserPersonalKey;

public interface UserPersonalRepository extends CrudRepository<UserPersonal,UserPersonalKey>{
	
	public UserPersonal findByUserPersonalKey(UserPersonalKey key);
	
	//public UserPersonal findByUserIdAndStartDate(int userId,Date startDate);
	
}
