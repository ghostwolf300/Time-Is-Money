package com.tim.db.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tim.entities.User;

/*
 * To create custom methods (not just "find"):
 * Create UserRepositoryCustom interface and name implementing class UserRepositoryImpl
 * 
 */

@Repository
public interface UserRepository extends JpaRepository<User,Long>, UserRepositoryCustom{
	
	public User findByUsername(String username);
	public User findByUserPersonalSetLastName(String lastName);
	public User findByUsernameAndEnabled(String username,boolean enabled);

}
