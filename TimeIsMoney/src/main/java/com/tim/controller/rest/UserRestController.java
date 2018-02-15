 package com.tim.controller.rest;

import java.sql.Date;
import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tim.component.TIMSessionInfo;
import com.tim.entities.User;
import com.tim.entities.UserAssignment;
import com.tim.entities.UserContract;
import com.tim.entities.UserPersonal;
import com.tim.entities.UserRole;
import com.tim.pojo.AssignedResult;
import com.tim.pojo.UserSearchResult;
import com.tim.service.user.UserPersonalService;
import com.tim.service.user.UserService;

@RestController
@RequestMapping("/userrecord")
public class UserRestController {
	
	@Autowired
	private UserService userService;
	
	@Autowired
	private TIMSessionInfo sessionInfo;
	
	@RequestMapping("/show/{userId}/personaldetails")
	public ResponseEntity<UserPersonal> getPersonalDetails(@PathVariable int userId,@RequestParam("keyDate") Date date){
		UserPersonal up=null;
		if(date!=null) {
			up=userService.findPersonalByKeyDate(userId, date);
		}
		else {
			up=userService.findPersonalByKeyDate(userId, new Date(System.currentTimeMillis()));
		}
		if(up==null) {
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		}
		return new ResponseEntity<UserPersonal>(up,HttpStatus.OK);
	}
	
	@RequestMapping("/show/{userId}/personaldetails/next")
	public ResponseEntity<UserPersonal> getNextPersonalDetails(@PathVariable int userId, @RequestParam("keyDate") Date date){
		UserPersonal up=userService.findNextPersonal(userId, date);
		if(up==null) {
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		}
		return new ResponseEntity<UserPersonal>(up,HttpStatus.OK);
	}
	
	@RequestMapping("/show/{userId}/personaldetails/prev")
	public ResponseEntity<UserPersonal> getPreviousPersonalDetails(@PathVariable int userId, @RequestParam("keyDate") Date date){
		UserPersonal up=userService.findPreviousPersonal(userId, date);
		if(up==null) {
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		}
		return new ResponseEntity<UserPersonal>(up,HttpStatus.OK);	
	}
	
	@RequestMapping(value="/show/{userId}/personaldetails/save", method=RequestMethod.POST)
	public ResponseEntity<UserPersonal> savePersonalDetails(@PathVariable int userId, @RequestBody UserPersonal personalDetail){
		personalDetail.setChangedBy(sessionInfo.getCurrentUser().getId());
		personalDetail.setChangeTs(new Timestamp(System.currentTimeMillis()));
		UserPersonal up=userService.savePersonal(personalDetail);
		return new ResponseEntity<UserPersonal>(up,HttpStatus.OK);
	}
	
	@RequestMapping("/show/{userId}/contractdetails")
	public ResponseEntity<UserContract> getContractDetails(@PathVariable int userId,@RequestParam("keyDate") Date date){
		UserContract uc=null;
		if(date!=null) {
			uc=userService.findContractByKeyDate(userId, date);
		}
		else {
			uc=userService.findContractByKeyDate(userId, new Date(System.currentTimeMillis()));
		}
		if(uc==null) {
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		}
		return new ResponseEntity<UserContract>(uc,HttpStatus.OK);
	}
	
	@RequestMapping("/show/{userId}/contractdetails/next")
	public ResponseEntity<UserContract> getNextContractDetails(@PathVariable int userId, @RequestParam("keyDate") Date date){
		UserContract uc=userService.findNextContract(userId, date);
		if(uc==null) {
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		}
		return new ResponseEntity<UserContract>(uc,HttpStatus.OK);
		
	}
	
	@RequestMapping("/show/{userId}/contractdetails/prev")
	public ResponseEntity<UserContract> getPreviousContractDetails(@PathVariable int userId, @RequestParam("keyDate") Date date){
		UserContract uc=userService.findPreviousContract(userId, date);
		if(uc==null) {
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		}
		return new ResponseEntity<UserContract>(uc,HttpStatus.OK);
	}
	
	@RequestMapping(value="/show/{userId}/contractdetails/save", method=RequestMethod.POST)
	public ResponseEntity<UserContract> saveContractDetails(@PathVariable int userId, @RequestBody UserContract contractDetail){
		contractDetail.setChangedBy(sessionInfo.getCurrentUser().getId());
		contractDetail.setChangeTs(new Timestamp(System.currentTimeMillis()));
		UserContract uc=userService.saveContract(contractDetail);
		return new ResponseEntity<UserContract>(uc,HttpStatus.OK);
	}
	
	@RequestMapping("/show/{userId}/assignmentdetails")
	public ResponseEntity<UserAssignment> getAssignmentDetails(@PathVariable int userId, @RequestParam("keyDate") Date date){
		UserAssignment ua=null;
		if(date!=null) {
			ua=userService.findAssignmentByKeyDate(userId, date);
		}
		else {
			ua=userService.findAssignmentByKeyDate(userId, new Date(System.currentTimeMillis()));
		}
		if(ua==null) {
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		}
		return new ResponseEntity<UserAssignment>(ua,HttpStatus.OK);
	}
	
	@RequestMapping("/show/{userId}/assignmentdetails/next")
	public ResponseEntity<UserAssignment> getNextAssignmentDetails(@PathVariable int userId, @RequestParam("keyDate") Date date){
		UserAssignment ua=userService.findNextAssignment(userId, date);
		if(ua==null) {
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		}
		return new ResponseEntity<UserAssignment>(ua,HttpStatus.OK);
	}
	
	@RequestMapping("/show/{userId}/assignmentdetails/prev")
	public ResponseEntity<UserAssignment> getPreviousAssignmentDetails(@PathVariable int userId, @RequestParam("keyDate") Date date){
		UserAssignment ua=userService.findPreviousAssignment(userId, date);
		if(ua==null) {
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		}
		return new ResponseEntity<UserAssignment>(ua,HttpStatus.OK);
	}
	
	@RequestMapping(value="/show/{userId}/assignmentdetails/save", method=RequestMethod.POST)
	public ResponseEntity<UserAssignment> saveAssignmentDetails(@PathVariable int userId, @RequestBody UserAssignment assignmentDetail){
		assignmentDetail.setChangedBy(sessionInfo.getCurrentUser().getId());
		assignmentDetail.setChangeTs(new Timestamp(System.currentTimeMillis()));
		UserAssignment ua=userService.saveAssignment(assignmentDetail);
		return new ResponseEntity<UserAssignment>(ua,HttpStatus.OK);
	}
	
	@RequestMapping("/show/{userId}/credentialsdetails")
	public ResponseEntity<User> getCredentialsDetails(@PathVariable int userId){
		User u=userService.findByUserId(userId);
		if(u==null) {
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		}
		return new ResponseEntity<User>(u,HttpStatus.OK);
	}
	
	@RequestMapping(value="/show/credentialsdetails/save", method=RequestMethod.POST)
	public ResponseEntity<User> saveCredentialsDetails(@RequestParam(value="userId",required=false) Integer userId, @RequestBody User user){
		if(userId==null) {
			user.setId(null);
		}
		user.setChangedBy(sessionInfo.getCurrentUser().getId());
		user.setChangeTs(new Timestamp(System.currentTimeMillis()));
		User u=userService.saveUser(user);
		return new ResponseEntity<User>(u,HttpStatus.OK);
	}
	
	@RequestMapping("/show/{userId}/roledetails")
	public ResponseEntity<List<UserRole>> getRoleDetails(@PathVariable Integer userId){
		List<UserRole> roles=userService.findRolesByUserId(userId);
		if(roles==null) {
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		}
		return new ResponseEntity<List<UserRole>>(roles,HttpStatus.OK);
	}
	
	@RequestMapping(value="/show/roledetails/save", method=RequestMethod.POST)
	public ResponseEntity<List<UserRole>> saveRoleDetails(@RequestParam(value="userId",required=false) Integer userId, @RequestBody List<UserRole> roles){
		List<UserRole> r=userService.saveUserRoles(userId, roles);
		return new ResponseEntity<List<UserRole>>(r,HttpStatus.OK);
	}
	
	@RequestMapping(value="/delete", method=RequestMethod.POST)
	public ResponseEntity<Integer> removeUser(@RequestParam(value="userId") Integer userId){
		userService.removeUser(userId);
		return new ResponseEntity<Integer>(1,HttpStatus.OK);
	}
	
	@RequestMapping(value="/assignments")
	public ResponseEntity<List<AssignedResult>> getAssignedUsers(
			@RequestParam(value="orgUnitId") Integer orgUnitId,
			@RequestParam(value="startDate") Date startDate,
			@RequestParam(value="endDate") Date endDate){
		List<AssignedResult> results=userService.findAssignedEmployees(orgUnitId, startDate, endDate);
		if(results==null) {
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		}
		return new ResponseEntity<List<AssignedResult>>(results,HttpStatus.OK);
	}
	
	@RequestMapping(value="/assignedto")
	public ResponseEntity<List<UserSearchResult>> getUsersAssignedTo(
			@RequestParam(value="orgUnitId") Integer orgUnitId,
			@RequestParam(value="keyDate") Date keyDate){
		List<UserSearchResult> users=userService.findAssignedTo(orgUnitId, keyDate);
		if(users==null) {
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		}
		return new ResponseEntity<List<UserSearchResult>>(users,HttpStatus.OK);
	}
	
	
	private Date getDateObject(String dateString) {
		SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd");
		Date d=null;
		try {
			d = new Date(sdf.parse(dateString).getTime());
		} 
		catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return d;
	}

}
