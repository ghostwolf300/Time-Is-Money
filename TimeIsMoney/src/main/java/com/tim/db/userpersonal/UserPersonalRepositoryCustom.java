package com.tim.db.userpersonal;

import java.sql.Date;

import com.tim.entities.UserPersonal;

public interface UserPersonalRepositoryCustom {
	
	public UserPersonal findByUserIdAndKeyDate(int userId,Date keyDate);

}
