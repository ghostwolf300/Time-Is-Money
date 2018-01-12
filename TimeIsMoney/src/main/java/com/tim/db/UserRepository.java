package com.tim.db;

import org.springframework.data.repository.CrudRepository;

import com.tim.entities.User;

public interface UserRepository extends CrudRepository<User,Long>{
	
	public User findByUsername(String username);
	public User findByUserPersonalSetLastName(String lastName);
	public User findCurrentRecord(String username);
	

}
