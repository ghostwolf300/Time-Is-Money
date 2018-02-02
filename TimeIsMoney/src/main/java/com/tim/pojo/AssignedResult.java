package com.tim.pojo;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class AssignedResult implements Serializable {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private int userId;
	private String firstName=null;
	private String lastName=null;
	private List<Period> activePeriods=null;
	private List<Period> inactivePeriods=null;
	
	public AssignedResult() {
		
	}
	
	public AssignedResult(int userId,String firstName,String lastName) {
		this.userId=userId;
		this.firstName=firstName;
		this.lastName=lastName;
	}

	public int getUserId() {
		return userId;
	}

	public void setUserId(int userId) {
		this.userId = userId;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public List<Period> getActivePeriods() {
		return activePeriods;
	}

	public void setActivePeriods(List<Period> activePeriods) {
		this.activePeriods = activePeriods;
	}
	
	public void addActivePeriod(Period period) {
		if(activePeriods==null) {
			activePeriods=new ArrayList<Period>();
		}
		activePeriods.add(period);
	}

	public List<Period> getInactivePeriods() {
		return inactivePeriods;
	}

	public void setInactivePeriods(List<Period> inactivePeriods) {
		this.inactivePeriods = inactivePeriods;
	}
	
	public void addInactivePeriod(Period period) {
		if(inactivePeriods==null) {
			inactivePeriods=new ArrayList<Period>();
		}
		inactivePeriods.add(period);
	}
	

}
