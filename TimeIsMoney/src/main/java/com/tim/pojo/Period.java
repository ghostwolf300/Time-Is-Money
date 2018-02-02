package com.tim.pojo;

import java.io.Serializable;
import java.sql.Date;

public class Period implements Serializable{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private Date startDate=null;
	private Date endDate=null;
	
	public Period() {
		
	}
	
	public Period(Date startDate,Date endDate) {
		this.startDate=startDate;
		this.endDate=endDate;
	}

	public Date getStartDate() {
		return startDate;
	}

	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}

	public Date getEndDate() {
		return endDate;
	}

	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}
	
}
