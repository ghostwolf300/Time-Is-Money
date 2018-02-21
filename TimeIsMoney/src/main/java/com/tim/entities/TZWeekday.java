package com.tim.entities;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name="time_zone_weekday")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class TZWeekday implements Serializable {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@EmbeddedId
	private TZWeekdayKey key;

	public TZWeekday(TZWeekdayKey key) {
		this.key = key;
	}

	public TZWeekdayKey getKey() {
		return key;
	}

	public void setKey(TZWeekdayKey key) {
		this.key = key;
	}
}
