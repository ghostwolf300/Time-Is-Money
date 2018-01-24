package com.tim.db.userrole;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tim.entities.UserRole;
import com.tim.entities.UserRoleKey;

@Repository
public interface UserRoleRepository extends JpaRepository<UserRole,UserRoleKey>,UserRoleRepositoryCustom {
	
	public List<UserRole> findByUserId(int userId);
	public int removeByUserId(int userId);
	
}
