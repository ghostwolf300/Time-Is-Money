package com.tim.entities;

import java.io.Serializable;

import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name="plan_org_unit")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class PlanOrgUnit implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@EmbeddedId
	private PlanOrgUnitKey key;

	public PlanOrgUnit() {
		
	}
	
	public PlanOrgUnit(PlanOrgUnitKey key) {
		this.key = key;
	}

	public PlanOrgUnitKey getKey() {
		return key;
	}

	public void setKey(PlanOrgUnitKey key) {
		this.key = key;
	}
	
	

}
