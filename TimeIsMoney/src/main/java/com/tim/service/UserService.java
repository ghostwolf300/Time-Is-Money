package com.tim.service;

import java.sql.Date;
import java.util.List;

import com.tim.entities.Role;
import com.tim.entities.User;
import com.tim.entities.UserAssignment;
import com.tim.entities.UserContract;
import com.tim.entities.UserPersonal;
import com.tim.entities.UserRole;

public interface UserService {
	
	public List<User> findAll();
	public User findByUsername(String username);
	public User findByUserId(int id);
	public User currentRecord(String username);
	public List<User> currentRecords();
	public List<UserRole> findRolesByUserId(int userId);
	
	public UserPersonal findPersonalByKeyDate(int userId,Date date);
	public UserPersonal findNextPersonal(int userId,Date date);
	public UserPersonal findPreviousPersonal(int userId,Date date);
	public UserPersonal savePersonalData(UserPersonal userPersonal);
	
	public UserContract findContractByKeyDate(int userId,Date date);
	public UserContract findNextContract(int userId, Date date);
	public UserContract findPreviousContract(int userId, Date date);
	
	public UserAssignment findAssignmentByKeyDate(int userId,Date date);
	public UserAssignment findNextAssignment(int userId,Date date);
	public UserAssignment findPreviousAssignment(int userId, Date date);
	
}
