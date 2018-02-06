package com.tim.pojo;

import java.io.Serializable;
import java.sql.Date;
import java.util.HashMap;
import java.util.Map;

public class PeriodStatistics implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private Date startDate;
	private Date endDate;
	private Map<String,DateStatistics> dateStatistics;
	
	public PeriodStatistics() {
		
	}

	public PeriodStatistics(Date startDate, Date endDate) {
		this.startDate = startDate;
		this.endDate = endDate;
	}

	public PeriodStatistics(Date startDate, Date endDate, Map<String, DateStatistics> dateStatistics) {
		this.startDate = startDate;
		this.endDate = endDate;
		this.dateStatistics = dateStatistics;
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

	public Map<String, DateStatistics> getDateStatistics() {
		return dateStatistics;
	}

	public void setDateStatistics(Map<String, DateStatistics> dateStatistics) {
		this.dateStatistics = dateStatistics;
	}
	
	public void addDateStatistics(DateStatistics dateStat) {
		if(dateStatistics==null) {
			dateStatistics=new HashMap<String,DateStatistics>();
		}
	}
	
	
}
