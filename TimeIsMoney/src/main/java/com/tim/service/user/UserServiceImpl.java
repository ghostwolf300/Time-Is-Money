package com.tim.service.user;

import java.sql.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tim.db.common.DateEffectiveRepository;
import com.tim.db.user.UserRepository;
import com.tim.db.userassignment.UserAssignmentRepository;
import com.tim.db.usercontract.UserContractRepository;
import com.tim.db.userpersonal.UserPersonalRepository;
import com.tim.db.userrole.UserRoleRepository;
import com.tim.entities.DateEffectiveRecord;
import com.tim.entities.User;
import com.tim.entities.UserAssignment;
import com.tim.entities.UserContract;
import com.tim.entities.UserPersonal;
import com.tim.entities.UserRole;
import com.tim.pojo.AssignedResult;
import com.tim.pojo.UserSearchResult;

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
	
	public UserServiceImpl() {
		System.out.println("Initializing user service");
	}
	
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
		if(up!=null) {
			addRecordIdentifierTo(up,userPersonalRepository);
		}
		return up;
	}
	
	@Override
	public UserPersonal findNextPersonal(int userId, Date date) {
		UserPersonal up=userPersonalRepository.findNextRecord(userId, date);
		if(up!=null) {
			this.addRecordIdentifierTo(up,userPersonalRepository);
		}
		return up;
	}

	@Override
	public UserPersonal findPreviousPersonal(int userId, Date date) {
		UserPersonal up=userPersonalRepository.findPreviousRecord(userId, date);
		if(up!=null) {
			this.addRecordIdentifierTo(up,userPersonalRepository);
		}
		return up;
	}
	
	@Override
	public UserPersonal savePersonal(UserPersonal userPersonal) {
		UserPersonal up=userPersonalRepository.save(userPersonal);
		if(up!=null) {
			this.addRecordIdentifierTo(up, userPersonalRepository);
		}
		return up;
	}

	@Override
	public UserContract findContractByKeyDate(int userId, Date date) {
		UserContract uc=userContractRepository.findByUserIdAndKeyDate(userId, date);
		if(uc!=null) {
			addRecordIdentifierTo(uc, userContractRepository);
		}
		return uc;
	}
	
	@Override
	public UserContract findNextContract(int userId, Date date) {
		UserContract uc=userContractRepository.findNextRecord(userId, date);
		if(uc!=null) {
			addRecordIdentifierTo(uc,userContractRepository);
		}
		return uc;
	}

	@Override
	public UserContract findPreviousContract(int userId, Date date) {
		UserContract uc=userContractRepository.findPreviousRecord(userId, date);
		if(uc!=null) {
			addRecordIdentifierTo(uc,userContractRepository);
		}
		return uc;
	}
	
	@Override
	public UserContract saveContract(UserContract userContract) {
		UserContract uc=userContractRepository.save(userContract);
		if(uc!=null) {
			addRecordIdentifierTo(uc,userContractRepository);
		}
		return uc;
	}

	@Override
	public UserAssignment findAssignmentByKeyDate(int userId, Date date) {
		UserAssignment ua=userAssignmentRepository.findByUserIdAndKeyDate(userId, date);
		if(ua!=null) {
			addRecordIdentifierTo(ua, userAssignmentRepository);
		}
		return ua;
	}
	
	@Override
	public UserAssignment findNextAssignment(int userId, Date date) {
		UserAssignment ua=userAssignmentRepository.findNextRecord(userId, date);
		if(ua!=null) {
			addRecordIdentifierTo(ua, userAssignmentRepository);
		}
		return ua;
	}

	@Override
	public UserAssignment findPreviousAssignment(int userId, Date date) {
		UserAssignment ua=userAssignmentRepository.findPreviousRecord(userId, date);
		if(ua!=null) {
			addRecordIdentifierTo(ua,userAssignmentRepository);
		}
		return ua;
	}
	
	@Override
	public UserAssignment saveAssignment(UserAssignment userAssignment) {
		UserAssignment saved=userAssignmentRepository.save(userAssignment);
		if(saved!=null) {
			addRecordIdentifierTo(saved,userAssignmentRepository);
		}
		return saved;
	}
	
	@SuppressWarnings("rawtypes")
	private void addRecordIdentifierTo(DateEffectiveRecord rec,DateEffectiveRepository repo) {
		int recBefore=repo.getRecordCountBeforeDate(rec.getKey().getUserId(), rec.getKey().getStartDate());
		int recAfter=repo.getRecordCountAfterDate(rec.getKey().getUserId(), rec.getKey().getStartDate());
		int totalCount=recBefore+recAfter+1;
		int currentRec=-1;
		currentRec=totalCount-recAfter;
		rec.setRecordsAfter(recAfter);
		rec.setRecordsBefore(recBefore);
		rec.setTotalRecords(totalCount);
		rec.setCurrentRecord(currentRec);
	}

	@Override
	public User saveUser(User user) {
		System.out.println("Saving user: "+user.getId());
		User u=userRepository.save(user);
		
		return u;
	}

	@Override
	public List<UserRole> saveUserRoles(int userId,List<UserRole> roles) {
		userRoleRepository.removeByKeyUserId(userId);
		List<UserRole> saved=userRoleRepository.save(roles);
		return saved;
	}

	@Override
	public List<UserSearchResult> findAllCustom() {
		return userRepository.findAllCustom();
	}

	@Override
	public int removeUser(int userId) {
	
		userPersonalRepository.removeByKeyUserId(userId);
		userContractRepository.removeByKeyUserId(userId);
		userAssignmentRepository.removeByKeyUserId(userId);
		userRoleRepository.removeByKeyUserId(userId);
		userRepository.removeById(userId);
		
		return -1;
	}

	@Override
	public List<AssignedResult> findAssignedEmployees(int orgUnitId, Date startDate, Date endDate) {
		return userAssignmentRepository.findAssignedTo(orgUnitId, startDate, endDate);
	}

}
