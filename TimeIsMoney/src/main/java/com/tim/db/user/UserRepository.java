package com.tim.db.user;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tim.entities.User;

/*
 * To create custom methods (not just "find"):
 * Create UserRepositoryCustom interface and name implementing class UserRepositoryImpl
 * 
 */

@Repository
public interface UserRepository extends JpaRepository<User,Integer>, UserRepositoryCustom{
	
	public User findById(Integer id);
	public User findByUsername(String username);
	public User findByUsernameAndEnabled(String username,boolean enabled);
	
	@SuppressWarnings("unchecked")
	@Transactional
	public User save(User user);

}
