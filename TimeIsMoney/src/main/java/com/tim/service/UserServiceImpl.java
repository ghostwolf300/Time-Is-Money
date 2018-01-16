package com.tim.service;

import java.sql.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tim.db.user.UserRepository;
import com.tim.db.usercontract.UserContractRepository;
import com.tim.db.userrole.UserRoleRepository;
import com.tim.entities.Role;
import com.tim.entities.User;
import com.tim.entities.UserContract;
import com.tim.entities.UserPersonal;
import com.tim.entities.UserRole;

@Service("userService")
public class UserServiceImpl implements UserService {
	
	@Autowired
	private UserRepository userRepository;
	@Autowired
	private UserRoleRepository userRoleRepository;
	@Autowired
	private UserContractRepository userContractRepository;
	
	@Override
	public List<User> findAll() {
		return userRepository.findAll();
	}

	@Override
	public User findByUsername(String username) {
		System.out.println("trying to find: "+username);
		User u=userRepository.findByUsernameAndEnabled(username,true);
		if(u!=null) {
			System.out.println("found: "+u.getUsername());
		}
		return u;
	}

	@Override
	public User findByUserPersonalSetLastName(String lastName) {
		return userRepository.findByPersonalRecordsLastName(lastName);
	}

	@Override
	public User currentRecord(String username) {
		return userRepository.myQuery(username);
	}

	@Override
	public List<User> currentRecords() {
		return userRepository.currentRecords();
	}

	@Override
	public List<UserRole> findRolesByUserId(int userId) {
		return userRoleRepository.findByUserId(userId);
	}
	
	@Override
	public UserPersonal findPersonalByKeyDate(int userId, Date date) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public UserContract findContractByKeyDate(int userId, Date date) {
		return userContractRepository.findByUserIdAndKeyDate(userId, date);
	}

	@Override
	public User findByUserId(int id) {
		return userRepository.findById(id);
	}

	

}
