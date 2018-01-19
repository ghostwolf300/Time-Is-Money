package com.tim.db.common;

import java.sql.Date;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

public abstract class AbstractDateEffectiveRepository<T> {
	
	@PersistenceContext
    private EntityManager em;
	
	public int deleteRecordsBetweenDates(Date startDate,Date endDate) {
		return 0;
	}
	
}
