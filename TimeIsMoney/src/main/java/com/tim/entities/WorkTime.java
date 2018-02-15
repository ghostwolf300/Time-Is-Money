package com.tim.entities;

import java.io.Serializable;
import java.sql.Date;
import java.sql.Time;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;
import javax.validation.constraints.Null;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonValue;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.tim.json.WorkTimeSerializer;


@Entity
@Table(name="work_time")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@JsonSerialize(using=WorkTimeSerializer.class)
public class WorkTime implements Serializable{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	@Id
	@Column(name="id")
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Integer id;
	@Column(name="user_id")
	private Integer userId;
	@Column(name="stamp_in")
	private Timestamp stampIn;
	@Column(name="stamp_out")
	private Timestamp stampOut;
	@Column(name="date_in")
	private Date dateIn;
	@Column(name="date_out")
	private Date dateOut;
	@Column(name="rounded_in_time")
	private Time roundedInTime;
	@Column(name="rounded_out_time")
	private Time roundedOutTime;
	@Column(name="change_ts")
	private Timestamp changeTs;
	
	@ManyToOne
	@JoinColumn(name="org_unit_id")
	private OrgUnit orgUnit;
	
	@ManyToOne
	@JoinColumn(name="changed_by")
	private User changedBy;
	
	public WorkTime() {
		
	}
	
	public WorkTime(Timestamp in,Timestamp out) {
		this.stampIn=in;
		this.stampOut=out;
		if(in!=null) {
			this.dateIn=new Date(in.getTime());
		}
		if(out!=null) {
			this.dateOut=new Date(out.getTime());
		}
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

	public Timestamp getStampIn() {
		return stampIn;
	}

	public void setStampIn(Timestamp stampIn) {
		this.stampIn = stampIn;
	}

	public Timestamp getStampOut() {
		return stampOut;
	}

	public void setStampOut(Timestamp stampOut) {
		this.stampOut = stampOut;
	}

	public Date getDateIn() {
		return dateIn;
	}

	public void setDateIn(Date dateIn) {
		this.dateIn = dateIn;
	}

	public Date getDateOut() {
		return dateOut;
	}

	public void setDateOut(Date dateOut) {
		this.dateOut = dateOut;
	}

	public Time getRoundedInTime() {
		return roundedInTime;
	}

	public void setRoundedInTime(Time roundedInTime) {
		this.roundedInTime = roundedInTime;
	}

	public Time getRoundedOutTime() {
		return roundedOutTime;
	}

	public void setRoundedOutTime(Time roundedOutTime) {
		this.roundedOutTime = roundedOutTime;
	}

	public OrgUnit getOrgUnit() {
		return orgUnit;
	}

	public void setOrgUnit(OrgUnit orgUnit) {
		this.orgUnit = orgUnit;
	}

	public Timestamp getChangeTs() {
		return changeTs;
	}

	public void setChangeTs(Timestamp changeTs) {
		this.changeTs = changeTs;
	}

	public User getChangedBy() {
		return changedBy;
	}

	public void setChangedBy(User changedBy) {
		this.changedBy = changedBy;
	}
	
	public String toString() {
		return null;
	}

	
}
