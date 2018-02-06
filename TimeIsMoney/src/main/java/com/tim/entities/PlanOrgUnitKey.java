package com.tim.entities;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

@Embeddable
public class PlanOrgUnitKey implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	@ManyToOne
	@JoinColumn(name="plan_id")
	private Plan plan;
	@ManyToOne
	@JoinColumn(name="org_unit_id")
	private OrgUnit orgUnit;
	
	public PlanOrgUnitKey() {
		
	}
	
	public PlanOrgUnitKey(Plan plan, OrgUnit orgUnit) {
		this.plan = plan;
		this.orgUnit = orgUnit;
	}

	public Plan getPlan() {
		return plan;
	}

	public void setPlan(Plan plan) {
		this.plan = plan;
	}

	public OrgUnit getOrgUnit() {
		return orgUnit;
	}

	public void setOrgUnit(OrgUnit orgUnit) {
		this.orgUnit = orgUnit;
	}

	
}
