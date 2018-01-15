package com.tim.db.user;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tim.entities.User;

@Service("userService")
public class UserServiceImpl implements UserService {
	
	@Autowired
	private UserRepository userRepository;
	
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

}
