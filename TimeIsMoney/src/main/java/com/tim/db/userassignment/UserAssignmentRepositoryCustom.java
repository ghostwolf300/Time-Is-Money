package com.tim.db.userassignment;

import java.sql.Date;
import java.util.List;

import com.tim.db.common.DateEffectiveRepository;
import com.tim.entities.UserAssignment;
import com.tim.pojo.AssignedResult;
import com.tim.pojo.UserSearchResult;

public interface UserAssignmentRepositoryCustom extends DateEffectiveRepository<UserAssignment> {
	
	public UserAssignment save(UserAssignment userAssignment);
	public List<AssignedResult> findAssignedTo(int orgUnitId,Date startDate,Date endDate);
	public List<UserSearchResult> findAssignedTo(int orgUnitId,Date keyDate);
	
}
