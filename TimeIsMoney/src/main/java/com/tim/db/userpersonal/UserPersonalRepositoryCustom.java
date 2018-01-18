package com.tim.db.userpersonal;

import com.tim.db.common.DateEffectiveRepository;
import com.tim.entities.UserPersonal;

public interface UserPersonalRepositoryCustom extends DateEffectiveRepository<UserPersonal> {
	
	/*public UserPersonal findByUserIdAndKeyDate(int userId,Date keyDate);
	public UserPersonal findNextRecord(int userId,Date keyDate);
	public UserPersonal findPreviousRecord(int userId,Date keyDate);
	public UserPersonal findFirstRecord(int userId);
	public UserPersonal findLastRecord(int userId);
	public int getRecordCountBeforeDate(int userId,Date date);
	public int getRecordCountAfterDate(int userId,Date date);*/

}
