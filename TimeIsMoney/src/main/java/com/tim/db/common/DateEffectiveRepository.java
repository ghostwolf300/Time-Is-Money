package com.tim.db.common;

import java.sql.Date;

public interface DateEffectiveRepository<T> {
	public T findByUserIdAndKeyDate(int userId,Date keyDate);
	public T findNextRecord(int userId,Date keyDate);
	public T findPreviousRecord(int userId,Date keyDate);
	public T findFirstRecord(int userId);
	public T findLastRecord(int userId);
	public int getRecordCountBeforeDate(int userId,Date date);
	public int getRecordCountAfterDate(int userId,Date date);
}
