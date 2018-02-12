package com.tim.entities;

import java.io.Serializable;
import java.sql.Date;
import java.sql.Time;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name="work_time")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class WorkTime implements Serializable{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	@Id
	@Column(name="id")
	private Integer id;
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
	
	@ManyToOne
	@JoinColumn(name="user_id")
	private User user;
	
	@ManyToOne
	@JoinColumn(name="org_unit_id")
	private OrgUnit orgUnit;
	
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

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public OrgUnit getOrgUnit() {
		return orgUnit;
	}

	public void setOrgUnit(OrgUnit orgUnit) {
		this.orgUnit = orgUnit;
	}
	
	
}
