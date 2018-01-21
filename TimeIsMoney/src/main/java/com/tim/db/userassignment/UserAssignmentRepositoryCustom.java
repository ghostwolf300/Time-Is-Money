package com.tim.db.userassignment;

import com.tim.db.common.DateEffectiveRepository;
import com.tim.entities.UserAssignment;

public interface UserAssignmentRepositoryCustom extends DateEffectiveRepository<UserAssignment> {
	
	public UserAssignment save(UserAssignment userAssignment);
	
}
