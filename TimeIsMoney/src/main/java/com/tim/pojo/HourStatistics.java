package com.tim.pojo;

import java.io.Serializable;

public class HourStatistics implements Serializable {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private int hour;
	private double hoursForecasted;
	private double hoursScheduled;
	private double hoursWorked;
	
	public HourStatistics(){
		
	}

	public HourStatistics(int hour) {
		this.hour = hour;
	}

	public HourStatistics(int hour, double hoursForecasted, double hoursScheduled, double hoursWorked) {
		this.hour = hour;
		this.hoursForecasted = hoursForecasted;
		this.hoursScheduled = hoursScheduled;
		this.hoursWorked = hoursWorked;
	}

	public int getHour() {
		return hour;
	}

	public void setHour(int hour) {
		this.hour = hour;
	}

	public double getHoursForecasted() {
		return hoursForecasted;
	}

	public void setHoursForecasted(double hoursForecasted) {
		this.hoursForecasted = hoursForecasted;
	}

	public double getHoursScheduled() {
		return hoursScheduled;
	}

	public void setHoursScheduled(double hoursScheduled) {
		this.hoursScheduled = hoursScheduled;
	}

	public double getHoursWorked() {
		return hoursWorked;
	}

	public void setHoursWorked(double hoursWorked) {
		this.hoursWorked = hoursWorked;
	}
	
}
