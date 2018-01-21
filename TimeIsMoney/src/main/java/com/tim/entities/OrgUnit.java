package com.tim.entities;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
@Entity
@Table(name="org_unit")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class OrgUnit implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	@Id
	@Column(name="id")
	private int id;
	@Column(name="name")
	private String name;
	@Column(name="change_ts")
	private Timestamp changeTs;
	@Column(name="changed_by")
	private int changedBy;
	
	@ManyToOne
	@JoinColumn(name="cost_center_id", nullable=false)
	private CostCenter costCenter;
	
	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="parent_id")
	@JsonIgnore
	private OrgUnit parent;
	
	/*@ManyToOne
	@JoinColumn(name="changed_by", nullable=false)
	private User changedBy;*/
	
	public OrgUnit() {
		
	}
	
	public OrgUnit(OrgUnit orgUnit) {
		this.id=orgUnit.id;
		this.name=new String(orgUnit.name);
		if(orgUnit.costCenter!=null) {
			this.costCenter=new CostCenter(orgUnit.costCenter);
		}
		if(orgUnit.parent!=null) {
			this.parent=new OrgUnit(orgUnit.parent);
		}
		this.changedBy=orgUnit.changedBy;
		if(orgUnit.changeTs!=null) {
			this.changeTs=new Timestamp(orgUnit.getChangeTs().getTime());
		}
		
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public CostCenter getCostCenter() {
		return costCenter;
	}

	public void setCostCenter(CostCenter costCenter) {
		this.costCenter = costCenter;
	}

	public OrgUnit getParent() {
		return parent;
	}

	public void setParent(OrgUnit parent) {
		this.parent = parent;
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
