package com.tim.entities;

import java.io.Serializable;
import java.sql.Date;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIdentityReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

@Entity
@Table(name="user_assignment")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "userAssignmentKey")
public class UserAssignment extends DateEffectiveRecord implements Serializable {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@EmbeddedId
	private UserAssignmentKey userAssignmentKey;
	@Column(name="end_date")
	private Date endDate;
	@Column(name="change_ts")
	private Timestamp changeTs;
	@Column(name="changedBy")
	private int changedBy;
	
	@ManyToOne
	@JoinColumn(name="org_unit_id", nullable=false)
	private OrgUnit orgUnit;
	
	/*@ManyToOne
	@JoinColumn(name="changed_by", nullable=false)
	private User changedBy;*/
	
	public UserAssignment() {
		
	}

	public UserAssignmentKey getUserAssignmentKey() {
		return userAssignmentKey;
	}

	public void setUserAssignmentKey(UserAssignmentKey userAssignmentKey) {
		this.userAssignmentKey = userAssignmentKey;
	}

	public Date getEndDate() {
		return endDate;
	}

	public void setEndDate(Date endDate) {
		this.endDate = endDate;
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

	public int getChangedBy() {
		return changedBy;
	}

	public void setChangedBy(int changedBy) {
		this.changedBy = changedBy;
	}

	/*public User getChangedBy() {
		return changedBy;
	}

	public void setChangedBy(User changedBy) {
		this.changedBy = changedBy;
	}*/

}
