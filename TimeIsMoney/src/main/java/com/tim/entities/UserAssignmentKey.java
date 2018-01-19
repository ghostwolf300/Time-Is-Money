package com.tim.entities;

import java.io.Serializable;
import java.sql.Date;
import javax.persistence.Column;
import javax.persistence.Embeddable;


@Embeddable
public class UserAssignmentKey implements Serializable {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	@Column(name="user_id")
	private int userId;
	@Column(name="start_date")
	private Date startDate;
	
	public UserAssignmentKey() {
		
	}

	public UserAssignmentKey(int userId, Date startDate) {
		this.userId = userId;
		this.startDate = startDate;
	}
	
	public UserAssignmentKey(UserAssignmentKey uaKey) {
		this.userId=uaKey.userId;
		this.startDate=new Date(uaKey.startDate.getTime());
	}

	public int getUserId() {
		return userId;
	}

	public void setUserId(int userId) {
		this.userId = userId;
	}

	public Date getStartDate() {
		return startDate;
	}

	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}
	
	

}
