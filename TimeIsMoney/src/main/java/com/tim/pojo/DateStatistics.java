package com.tim.pojo;

import java.io.Serializable;
import java.sql.Date;

public class DateStatistics implements Serializable {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private Date date;
	private HourStatistics[] hourStatistics;
	
	public DateStatistics() {
		hourStatistics=new HourStatistics[24];
	}
	
	public DateStatistics(Date date) {
		this.date=date;
		hourStatistics=new HourStatistics[24];
	}
	
	public DateStatistics(Date date,HourStatistics[] hourStatistics) {
		this.date=date;
		this.hourStatistics=hourStatistics;
	}

	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}

	public HourStatistics[] getHourStatistics() {
		return hourStatistics;
	}

	public void setHourStatistics(HourStatistics[] hourStatistics) {
		this.hourStatistics = hourStatistics;
	}
	
	public HourStatistics getHourStat(int hour) {
		return hourStatistics[hour];
	}
	
	public void addHourStatistics(HourStatistics stat,int hour) {
		hourStatistics[hour]=stat;
	}
	
}
