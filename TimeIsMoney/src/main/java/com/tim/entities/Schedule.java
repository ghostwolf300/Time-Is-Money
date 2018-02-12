package com.tim.entities;

import java.io.Serializable;
import java.sql.Date;
import java.sql.Time;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name="schedule")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Schedule implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	@Id
	@Column(name="id")
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Integer id;
	@Column(name="plan_id")
	private Integer planId;
	@Column(name="org_unit_id")
	private Integer orgUnitId;
	@Column(name="user_id")
	private Integer userId;
	@Column(name="schedule_date")
	private Date scheduleDate;
	@Column(name="schedule_type_id")
	private Integer scheduleTypeId;
	@Column(name="start")
	private Time start;
	@Column(name="end")
	private Time end;
	
	public Schedule() {
		
	}

	public Schedule(Integer userId,Integer planId,Date scheduleDate, Integer scheduleTypeId, Time start, Time end) {
		this.userId = userId;
		this.planId=planId;
		this.scheduleDate = scheduleDate;
		this.scheduleTypeId = scheduleTypeId;
		this.start = start;
		this.end = end;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Integer getUserId() {
		return userId;
	}

	public void setUserId(Integer userId) {
		this.userId = userId;
	}

	public Integer getPlanId() {
		return planId;
	}

	public void setPlanId(Integer planId) {
		this.planId = planId;
	}

	public Integer getOrgUnitId() {
		return orgUnitId;
	}

	public void setOrgUnitId(Integer orgUnitId) {
		this.orgUnitId = orgUnitId;
	}

	public Date getScheduleDate() {
		return scheduleDate;
	}

	public void setScheduleDate(Date scheduleDate) {
		this.scheduleDate = scheduleDate;
	}

	public Integer getScheduleTypeId() {
		return scheduleTypeId;
	}

	public void setScheduleTypeId(Integer scheduleTypeId) {
		this.scheduleTypeId = scheduleTypeId;
	}

	public Time getStart() {
		return start;
	}

	public void setStart(Time start) {
		this.start = start;
	}

	public Time getEnd() {
		return end;
	}

	public void setEnd(Time end) {
		this.end = end;
	}
	
	
	
}
