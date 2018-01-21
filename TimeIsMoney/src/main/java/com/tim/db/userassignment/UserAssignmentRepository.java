package com.tim.db.userassignment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tim.entities.UserAssignment;
import com.tim.entities.UserAssignmentKey;

@Repository
public interface UserAssignmentRepository extends JpaRepository<UserAssignment, UserAssignmentKey>,UserAssignmentRepositoryCustom {
	
}
