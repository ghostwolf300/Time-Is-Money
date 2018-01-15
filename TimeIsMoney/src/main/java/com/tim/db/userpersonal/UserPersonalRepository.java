package com.tim.db.userpersonal;

import java.sql.Date;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tim.entities.UserPersonal;
import com.tim.entities.UserPersonalKey;

@Repository
public interface UserPersonalRepository extends JpaRepository<UserPersonal,UserPersonalKey>, UserPersonalRepositoryCustom{
	
	public UserPersonal findByUserPersonalKey(UserPersonalKey key);
	
}
