package com.tim.entities;

import java.io.Serializable;
import java.sql.Date;

import javax.persistence.Column;
import javax.persistence.Embeddable;

@Embeddable
public class DateEffectiveKey implements Serializable {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	@Column(name="user_id")
	private int userId;
	@Column(name="start_date")
	private Date startDate;
	
	public DateEffectiveKey() {
		
	}
	
	public DateEffectiveKey(int userId,Date startDate) {
		this.userId=userId;
		this.startDate=startDate;
	}
	
	public DateEffectiveKey(DateEffectiveKey key) {
		this.userId=key.userId;
		this.startDate=new Date(key.getStartDate().getTime());
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
