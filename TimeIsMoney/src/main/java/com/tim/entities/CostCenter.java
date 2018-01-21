package com.tim.entities;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

@Entity
@Table(name="cost_center")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class CostCenter implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@Id
	@Column(name="id")
	private int id;
	@Column(name="secondary_id")
	private String secondaryId;
	@Column(name="name")
	private String name;
	@Column(name="enabled")
	private boolean enabled;
	@Column(name="change_ts")
	private Timestamp changeTs;
	@ManyToOne
	@JoinColumn(name="changed_by", nullable=false)
	private User changedBy;
	
	
	public CostCenter() {
		
	}
	
	public CostCenter(CostCenter cc) {
		this.id=cc.id;
		if(cc.secondaryId!=null) {
			this.secondaryId=new String(cc.secondaryId);
		}
		if(cc.name!=null) {
			this.name=new String(cc.name);
		}
		this.enabled=cc.enabled;
		if(cc.changeTs!=null) {
			this.changeTs=new Timestamp(cc.changeTs.getTime());
		}
	}


	public int getId() {
		return id;
	}


	public void setId(int id) {
		this.id = id;
	}


	public String getSecondaryId() {
		return secondaryId;
	}


	public void setSecondaryId(String secondaryId) {
		this.secondaryId = secondaryId;
	}


	public String getName() {
		return name;
	}


	public void setName(String name) {
		this.name = name;
	}


	public boolean isEnabled() {
		return enabled;
	}


	public void setEnabled(boolean enabled) {
		this.enabled = enabled;
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

}
