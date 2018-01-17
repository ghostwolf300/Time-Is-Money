package com.tim.db.userassignment;

import java.sql.Date;

import com.tim.entities.UserAssignment;

public interface UserAssignmentRepositoryCustom {
	
	public UserAssignment myCustomQuery();
	public UserAssignment findByUserIdAndKeyDate(int userId,Date date);
	
}
