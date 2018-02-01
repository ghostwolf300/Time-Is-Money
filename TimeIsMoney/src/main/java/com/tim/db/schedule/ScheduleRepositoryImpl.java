package com.tim.db.schedule;

import java.sql.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;

import com.tim.entities.Schedule;

public class ScheduleRepositoryImpl implements ScheduleRepositoryCustom {
	
	@PersistenceContext
    private EntityManager em;
	
	@Override
	public void myCustomQuery() {
		// TODO Auto-generated method stub

	}

	@Override
	public List<Schedule> findSchedules(int userId, Date startDate, Date endDate) {
		String qryStr="SELECT s FROM Schedule s "
				+ "WHERE s.userId=:userId "
				+ "AND s.scheduleDate>=:startDate "
				+ "AND s.scheduleDate<=:endDate "
				+ "ORDER BY s.scheduleDate";
		TypedQuery<Schedule> qry=em.createQuery(qryStr,Schedule.class);
		qry.setParameter("userId", userId);
		qry.setParameter("startDate", startDate);
		qry.setParameter("endDate", endDate);
		List<Schedule> schedules=null;
		try {
			schedules=qry.getResultList();
		}
		catch(NoResultException nre) {
			//error handling
		}
		return schedules;
	}

}
