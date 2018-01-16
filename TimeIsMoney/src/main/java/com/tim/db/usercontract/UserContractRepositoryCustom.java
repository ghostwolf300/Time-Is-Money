package com.tim.db.usercontract;

import java.sql.Date;

import com.tim.entities.UserContract;

public interface UserContractRepositoryCustom {
	
	public UserContract findByUserIdAndKeyDate(int userId,Date date);
	
}
