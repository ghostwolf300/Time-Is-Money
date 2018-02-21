package com.tim.entities;

public class TimeTypeRule {
	
	private TimeZone zone;
	private boolean onlyPublicHoliday;
	private Integer timeTypeId;
	
	public TimeTypeRule() {
	
	}
	
	public TimeType generatedTimeType() {
		return new TimeType();
	}
	
	
}
