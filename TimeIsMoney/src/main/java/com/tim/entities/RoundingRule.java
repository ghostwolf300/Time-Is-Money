package com.tim.entities;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name="rounding_rule")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class RoundingRule implements Serializable {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	@Id
	@Column(name="id")
	private Integer id;
	@Column(name="direction")
	private Integer direction;
	@Column(name="name")
	private String name;
	@Column(name="seconds_before")
	private Integer secondsBefore;
	@Column(name="seconds_after")
	private Integer secondsAfter;
	
	public RoundingRule() {
		
	}

	public RoundingRule(Integer id, Integer direction, String name, Integer thresholdBefore, Integer thresholdAfter) {
		this.id = id;
		this.direction = direction;
		this.name = name;
		this.secondsBefore = thresholdBefore;
		this.secondsAfter = thresholdAfter;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Integer getDirection() {
		return direction;
	}

	public void setDirection(Integer direction) {
		this.direction = direction;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Integer getSecondsBefore() {
		return secondsBefore;
	}

	public void setSecondsBefore(Integer thresholdBefore) {
		this.secondsBefore = thresholdBefore;
	}

	public Integer getSecondsAfter() {
		return secondsAfter;
	}

	public void setSecondsAfter(Integer thresholdAfter) {
		this.secondsAfter = thresholdAfter;
	}
	
}
