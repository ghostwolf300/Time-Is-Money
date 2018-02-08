package com.tim.service.user;

import java.sql.Date;
import java.util.List;

import com.tim.entities.DateEffectiveKey;
import com.tim.entities.Role;
import com.tim.entities.User;
import com.tim.entities.UserAssignment;
import com.tim.entities.UserContract;
import com.tim.entities.UserPersonal;
import com.tim.entities.UserRole;
import com.tim.pojo.AssignedResult;
import com.tim.pojo.UserSearchResult;

public interface UserService {
	
	public List<User> findAll();
	public List<UserSearchResult> findAllCustom();
	public List<UserSearchResult> findAssignedTo(int orgUnitId,Date keyDate);
	
	public User findByUsername(String username);
	public User findByUserId(int id);
	public User currentRecord(String username);
	public List<User> currentRecords();
	public List<UserRole> findRolesByUserId(int userId);
	
	public User saveUser(User user);
	public List<UserRole> saveUserRoles(int userId,List<UserRole> roles);
	
	public UserPersonal findPersonalByKeyDate(int userId,Date date);
	public UserPersonal findNextPersonal(int userId,Date date);
	public UserPersonal findPreviousPersonal(int userId,Date date);
	public UserPersonal savePersonal(UserPersonal userPersonal);
	
	public UserContract findContractByKeyDate(int userId,Date date);
	public UserContract findNextContract(int userId, Date date);
	public UserContract findPreviousContract(int userId, Date date);
	public UserContract saveContract(UserContract userContract);
	
	public UserAssignment findAssignmentByKeyDate(int userId,Date date);
	public UserAssignment findNextAssignment(int userId,Date date);
	public UserAssignment findPreviousAssignment(int userId, Date date);
	public UserAssignment saveAssignment(UserAssignment userAssignment);
	
	public int removeUser(int userId);
	
	public List<AssignedResult> findAssignedEmployees(int orgUnitId,Date startDate,Date endDate);
	
}
