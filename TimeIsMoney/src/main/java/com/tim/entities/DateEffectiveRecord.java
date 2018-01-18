package com.tim.entities;

import javax.persistence.Transient;

import com.fasterxml.jackson.annotation.JsonInclude;

public abstract class DateEffectiveRecord {
	
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
	
}
