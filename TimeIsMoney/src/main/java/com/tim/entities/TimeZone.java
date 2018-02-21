package com.tim.entities;

import java.io.Serializable;
import java.sql.Time;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name="time_zone")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class TimeZone implements Serializable {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	@Id
	@Column(name="id")
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Integer id;
	@Column(name="name")
	private String name;
	@Column(name="startTime")
	private Time startTime;
	@Column(name="endTime")
	private Time endTime;
	
	@OneToMany(mappedBy="time_zone_id",cascade=CascadeType.ALL)
	private List<TZWeekday> weekdays;
	
	public TimeZone() {
		
	}
	
	public TimeZone(Integer id,String name,List<TZWeekday> weekdays,Time startTime,Time endTime) {
		this.id=id;
		this.name=name;
		this.weekdays=weekdays;
		this.startTime=startTime;
		this.endTime=endTime;
	}
	
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public List<TZWeekday> getWeekdays() {
		return weekdays;
	}
	public void setWeekdays(List<TZWeekday> weekdays) {
		this.weekdays = weekdays;
	}
	public Time getStartTime() {
		return startTime;
	}
	public void setStartTime(Time startTime) {
		this.startTime = startTime;
	}
	public Time getEndTime() {
		return endTime;
	}
	public void setEndTime(Time endTime) {
		this.endTime = endTime;
	}
	
	
	
}
