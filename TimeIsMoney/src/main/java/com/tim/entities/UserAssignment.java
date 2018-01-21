package com.tim.entities;

import java.io.Serializable;
import java.sql.Date;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name="user_assignment")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
//@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "key")
public class UserAssignment extends DateEffectiveRecord<UserAssignment> implements Serializable {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@ManyToOne
	@JoinColumn(name="org_unit_id", nullable=false)
	private OrgUnit orgUnit;
	
	@Column(name="change_ts")
	private Timestamp changeTs;
	@Column(name="changedBy")
	private int changedBy;
	
	
	
	public UserAssignment() {
		
	}
	
	public UserAssignment(UserAssignment ua) {
		this.copy(ua);
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

	@Override
	public void copy(UserAssignment rec) {
		if(rec.key!=null) {
			this.key=new DateEffectiveKey(rec.key);
		}
		if(rec.endDate!=null) {
			this.endDate=new Date(rec.endDate.getTime());
		}
		if(rec.orgUnit!=null) {
			this.orgUnit=new OrgUnit(rec.getOrgUnit());
		}
		this.changedBy=rec.changedBy;
		if(rec.changeTs!=null) {
			this.changeTs=new Timestamp(rec.changeTs.getTime());
		}
		
	}
}
