package com.tim.service;

import java.sql.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tim.db.user.UserRepository;
import com.tim.db.userassignment.UserAssignmentRepository;
import com.tim.db.usercontract.UserContractRepository;
import com.tim.db.userpersonal.UserPersonalRepository;
import com.tim.db.userrole.UserRoleRepository;
import com.tim.entities.Role;
import com.tim.entities.User;
import com.tim.entities.UserAssignment;
import com.tim.entities.UserContract;
import com.tim.entities.UserPersonal;
import com.tim.entities.UserRole;

@Service("userService")
public class UserServiceImpl implements UserService {
	
	@Autowired
	private UserRepository userRepository;
	@Autowired
	private UserPersonalRepository userPersonalRepository;
	@Autowired
	private UserRoleRepository userRoleRepository;
	@Autowired
	private UserContractRepository userContractRepository;
	@Autowired
	private UserAssignmentRepository userAssignmentRepository;
	
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
	public User currentRecord(String username) {
		return userRepository.myQuery(username);
	}
	
	@Override
	public User findByUserId(int id) {
		return userRepository.findById(id);
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
		UserPersonal up=userPersonalRepository.findByUserIdAndKeyDate(userId, date);
		addRecordIdentifierTo(up);
		return up;
	}
	
	@Override
	public UserPersonal findNextPersonal(int userId, Date date) {
		UserPersonal up=userPersonalRepository.findNextRecord(userId, date);
		this.addRecordIdentifierTo(up);
		return up;
	}

	@Override
	public UserPersonal findPreviousPersonal(int userId, Date date) {
		UserPersonal up=userPersonalRepository.findPreviousRecord(userId, date);
		this.addRecordIdentifierTo(up);
		return up;
	}
	
	@Override
	public UserPersonal savePersonalData(UserPersonal userPersonal) {
		return userPersonalRepository.save(userPersonal);
	}

	@Override
	public UserContract findContractByKeyDate(int userId, Date date) {
		UserContract uc=userContractRepository.findByUserIdAndKeyDate(userId, date);
		addRecordIdentifierTo(uc);
		return uc;
	}
	
	@Override
	public UserContract findNextContract(int userId, Date date) {
		UserContract uc=userContractRepository.findNextRecord(userId, date);
		addRecordIdentifierTo(uc);
		return uc;
	}

	@Override
	public UserContract findPreviousContract(int userId, Date date) {
		UserContract uc=userContractRepository.findPreviousRecord(userId, date);
		addRecordIdentifierTo(uc);
		return uc;
	}

	@Override
	public UserAssignment findAssignmentByKeyDate(int userId, Date date) {
		UserAssignment ua=userAssignmentRepository.findByUserIdAndKeyDate(userId, date);
		addRecordIdentifierTo(ua);
		return ua;
	}
	
	@Override
	public UserAssignment findNextAssignment(int userId, Date date) {
		UserAssignment ua=userAssignmentRepository.findNextRecord(userId, date);
		addRecordIdentifierTo(ua);
		return ua;
	}

	@Override
	public UserAssignment findPreviousAssignment(int userId, Date date) {
		UserAssignment ua=userAssignmentRepository.findPreviousRecord(userId, date);
		addRecordIdentifierTo(ua);
		return ua;
	}
	
	private void addRecordIdentifierTo(UserPersonal up) {
		int recBefore=userPersonalRepository.getRecordCountBeforeDate(up.getUserPersonalKey().getUserId(), up.getUserPersonalKey().getStartDate());
		int recAfter=userPersonalRepository.getRecordCountAfterDate(up.getUserPersonalKey().getUserId(), up.getUserPersonalKey().getStartDate());
		int totalCount=recBefore+recAfter+1;
		int currentRec=-1;
		currentRec=totalCount-recAfter;
		up.setRecordsAfter(recAfter);
		up.setRecordsBefore(recBefore);
		up.setTotalRecords(totalCount);
		up.setCurrentRecord(currentRec);
	}
	
	private void addRecordIdentifierTo(UserContract uc) {
		int recBefore=userContractRepository.getRecordCountBeforeDate(uc.getUserContractKey().getUserId(), uc.getUserContractKey().getStartDate());
		int recAfter=userContractRepository.getRecordCountAfterDate(uc.getUserContractKey().getUserId(), uc.getUserContractKey().getStartDate());
		int totalCount=recBefore+recAfter+1;
		int currentRec=-1;
		currentRec=totalCount-recAfter;
		uc.setRecordsAfter(recAfter);
		uc.setRecordsBefore(recBefore);
		uc.setTotalRecords(totalCount);
		uc.setCurrentRecord(currentRec);
	}
	
	private void addRecordIdentifierTo(UserAssignment ua) {
		int recBefore=userAssignmentRepository.getRecordCountBeforeDate(ua.getUserAssignmentKey().getUserId(), ua.getUserAssignmentKey().getStartDate());
		int recAfter=userAssignmentRepository.getRecordCountAfterDate(ua.getUserAssignmentKey().getUserId(), ua.getUserAssignmentKey().getStartDate());
		int totalCount=recBefore+recAfter+1;
		int currentRec=-1;
		currentRec=totalCount-recAfter;
		ua.setRecordsAfter(recAfter);
		ua.setRecordsBefore(recBefore);
		ua.setTotalRecords(totalCount);
		ua.setCurrentRecord(currentRec);
		
	}

}
