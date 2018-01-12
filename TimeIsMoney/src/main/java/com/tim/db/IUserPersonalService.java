package com.tim.db;

import java.sql.Date;

import com.tim.entities.UserPersonal;
import com.tim.entities.UserPersonalKey;

public interface IUserPersonalService {
	
	public UserPersonal findByUserPersonalKey(UserPersonalKey key);
	//public UserPersonal findByUserIdAndStartDate(int userId,Date startDate);
	public UserPersonal findLatest(int userId);
	
}
