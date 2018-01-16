package com.tim.service;

import java.sql.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tim.db.userpersonal.UserPersonalRepository;
import com.tim.entities.UserPersonal;
import com.tim.entities.UserPersonalKey;

@Service("userPersonalService")
public class UserPersonalServiceImpl implements UserPersonalService {
	
	@Autowired
	private UserPersonalRepository upRepo;
	
	@Override
	public List<UserPersonal> findAll() {
		return upRepo.findByEndDate(null);
	}
	
	@Override
	public UserPersonal findByUserPersonalKey(UserPersonalKey key) {
		return upRepo.findByUserPersonalKey(key);
	}

	@Override
	public UserPersonal findByUserIdAndStartDate(int userId, Date startDate) {
		UserPersonalKey key=new UserPersonalKey(userId,startDate);
		return upRepo.findByUserPersonalKey(key);
	}

	@Override
	public UserPersonal findLatest(int userId) {
		// TODO Auto-generated method stub
		return null;
	}

	


}
