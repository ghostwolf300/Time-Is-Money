package com.tim.entities;

import java.io.Serializable;
import java.sql.Date;

import javax.persistence.Column;
import javax.persistence.Embeddable;

/**
 * @author ghost
 *
 */
@Embeddable
public class UserPersonalKey implements Serializable {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@Column(name="user_id")
	private int userId;

	@Column(name="start_date")
	private Date startDate;
	
	public UserPersonalKey() {
		
	}
	
	public UserPersonalKey(int userId,Date startDate) {
		this.userId=userId;
		this.startDate=startDate;
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

	public static long getSerialversionuid() {
		return serialVersionUID;
	}
	
	@Override
	public String toString() {
		return "UserPersonalKey [userId=" + userId + ", startDate=" + startDate + "]";
	}

}
