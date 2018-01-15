package com.tim.db;

import java.sql.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tim.entities.UserPersonal;
import com.tim.entities.UserPersonalKey;

@Service("userPersonalService")
public class UserPersonalServiceImpl implements UserPersonalService {
	
	@Autowired
	private UserPersonalRepository userPersonalRepository;
	
	@Override
	public UserPersonal findByUserPersonalKey(UserPersonalKey key) {
		return userPersonalRepository.findByUserPersonalKey(key);
	}

	/*@Override
	public UserPersonal findByUserIdAndStartDate(int userId, Date startDate) {
		return userPersonalRepository.findByUserIdAndStartDate(userId, startDate);
	}*/

	@Override
	public UserPersonal findLatest(int userId) {
		// TODO Auto-generated method stub
		return null;
	}


}
