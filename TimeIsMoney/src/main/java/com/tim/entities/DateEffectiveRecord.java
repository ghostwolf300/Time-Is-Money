package com.tim.entities;

import java.sql.Date;

import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.MappedSuperclass;
import javax.persistence.Transient;

import com.fasterxml.jackson.annotation.JsonInclude;

@MappedSuperclass
public abstract class DateEffectiveRecord<T> {
	
	@EmbeddedId
	protected DateEffectiveKey key;
	@Column(name="end_date")
	protected Date endDate;
	
	@Transient
	@JsonInclude
	private int recordsBefore=-1;
	@Transient
	@JsonInclude
	private int currentRecord=-1;
	@Transient
	@JsonInclude
	private int recordsAfter=-1;
	@Transient
	@JsonInclude
	private int totalRecords=-1;
	
	public DateEffectiveRecord() {
		
	}

	public int getRecordsBefore() {
		return recordsBefore;
	}

	public void setRecordsBefore(int recordsBefore) {
		this.recordsBefore = recordsBefore;
	}

	public int getCurrentRecord() {
		return currentRecord;
	}

	public void setCurrentRecord(int currentRecord) {
		this.currentRecord = currentRecord;
	}

	public int getRecordsAfter() {
		return recordsAfter;
	}

	public void setRecordsAfter(int recordsAfter) {
		this.recordsAfter = recordsAfter;
	}

	public int getTotalRecords() {
		return totalRecords;
	}

	public void setTotalRecords(int totalRecords) {
		this.totalRecords = totalRecords;
	}

	public DateEffectiveKey getKey() {
		return key;
	}

	public Date getEndDate() {
		return endDate;
	}

	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}

	public void setKey(DateEffectiveKey key) {
		this.key = key;
	}
	
	abstract public void copy(T rec);
	
	abstract public T createCopy();
	
}
