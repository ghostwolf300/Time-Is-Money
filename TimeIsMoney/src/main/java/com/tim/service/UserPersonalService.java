package com.tim.service;

import java.sql.Date;
import java.util.List;

import com.tim.entities.UserPersonal;
import com.tim.entities.UserPersonalKey;

public interface UserPersonalService {
	
	public List<UserPersonal> findAll();
	public UserPersonal findByUserPersonalKey(UserPersonalKey key);
	public UserPersonal findByUserIdAndStartDate(int userId,Date startDate);
	public UserPersonal findByUserIdAndKeyDate(int userId,Date date);
	public UserPersonal findLatest(int userId);
	
}
