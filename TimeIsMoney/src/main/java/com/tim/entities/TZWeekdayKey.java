package com.tim.entities;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Embeddable;

@Embeddable
public class TZWeekdayKey implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@Column(name="time_zone_id")
	private Integer timeZoneId;
	@Column(name="weekday")
	private Integer weekday;
	
	public TZWeekdayKey() {
		
	}

	public TZWeekdayKey(Integer timeZoneId, Integer weekday) {
		this.timeZoneId = timeZoneId;
		this.weekday = weekday;
	}

	public Integer getTimeZoneId() {
		return timeZoneId;
	}

	public void setTimeZoneId(Integer timeZoneId) {
		this.timeZoneId = timeZoneId;
	}

	public Integer getWeekday() {
		return weekday;
	}

	public void setWeekday(Integer weekday) {
		this.weekday = weekday;
	}

}
