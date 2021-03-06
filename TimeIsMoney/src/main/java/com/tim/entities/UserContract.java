package com.tim.entities;

import java.io.Serializable;
import java.sql.Date;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;

@Entity
@Table(name="user_contract")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class UserContract extends DateEffectiveRecord<UserContract> implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@ManyToOne
	@JoinColumn(name="contract_type_id", nullable=false)
	private ContractType contractType;
	@Column(name="max_hours")
	private double maxHours;
	@Column(name="min_hours")
	private double minHours;
	@Column(name="changed_by")
	private int changedBy;
	@Column(name="change_ts")
	private Timestamp changeTs;
	
	@ManyToOne
	@JoinColumn(name="user_id", nullable=false,insertable=false,updatable=false)
	private User user;
	
	public UserContract() {
		
	}
	
	public UserContract(UserContract uc) {
		this.copy(uc);
	}

	public Date getEndDate() {
		return endDate;
	}

	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}

	public ContractType getContractType() {
		return contractType;
	}

	public void setContractType(ContractType contractType) {
		this.contractType = contractType;
	}

	public double getMaxHours() {
		return maxHours;
	}

	public void setMaxHours(double maxHours) {
		this.maxHours = maxHours;
	}

	public double getMinHours() {
		return minHours;
	}

	public void setMinHours(double minHours) {
		this.minHours = minHours;
	}

	public Timestamp getChangeTs() {
		return changeTs;
	}

	public void setChangeTs(Timestamp changeTs) {
		this.changeTs = changeTs;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public int getChangedBy() {
		return changedBy;
	}

	public void setChangedBy(int changedBy) {
		this.changedBy = changedBy;
	}

	@Override
	public void copy(UserContract rec) {
		
		if(rec.key!=null) {
			this.key=new DateEffectiveKey(rec.key);
		}
		if(rec.endDate!=null) {
			this.endDate=new Date(rec.endDate.getTime());
		}
		if(rec.contractType!=null) {
			this.contractType=new ContractType(rec.contractType);
		}
		
		this.minHours=rec.minHours;
		this.maxHours=rec.maxHours;
		this.changedBy=rec.changedBy;
		if(rec.changeTs!=null) {
			this.changeTs=new Timestamp(rec.changeTs.getTime());
		}
		
	}

	@Override
	public UserContract createCopy() {
		return new UserContract(this);
	}
	
	
}
