package com.tim.entities;

import java.io.Serializable;
import java.sql.Date;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name="user_contract")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class UserContract implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@EmbeddedId
	private UserContractKey userContractKey;
	@Column(name="end_date")
	private Date endDate;
	@ManyToOne
	@JoinColumn(name="contract_type_id", nullable=false)
	private ContractType contractType;
	@Column(name="max_hours")
	private double maxHours;
	@Column(name="min_hours")
	private double minHours;
	@ManyToOne
	@JoinColumn(name="changed_by", nullable=false)
	private User changedBy;
	@Column(name="change_ts")
	private Timestamp changeTs;
	
	public UserContract() {
		
	}

	public UserContractKey getUserContractKey() {
		return userContractKey;
	}

	public void setUserContractKey(UserContractKey userContractKey) {
		this.userContractKey = userContractKey;
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

	public User getChangedBy() {
		return changedBy;
	}

	public void setChangedBy(User changedBy) {
		this.changedBy = changedBy;
	}

	public Timestamp getChangeTs() {
		return changeTs;
	}

	public void setChangeTs(Timestamp changeTs) {
		this.changeTs = changeTs;
	}
	
	
}