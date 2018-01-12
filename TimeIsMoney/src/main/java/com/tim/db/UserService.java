package com.tim.db;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tim.entities.User;

@Service("userService")
public class UserService implements IUserService {
	
	@Autowired
	private UserRepository userRepository;
	
	@Override
	public Iterable<User> findAll() {
		return userRepository.findAll();
	}

	@Override
	public User findByUsername(String username) {
		return userRepository.findByUsername(username);
	}

	@Override
	public User findByUserPersonalSetLastName(String lastName) {
		return userRepository.findByUserPersonalSetLastName(lastName);
	}

	@Override
	public User findCurrentRecord(String username) {
		return userRepository.findCurrentRecord(username);
	}

}
