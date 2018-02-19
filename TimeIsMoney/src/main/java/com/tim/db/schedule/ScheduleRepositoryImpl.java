package com.tim.db.schedule;

import java.sql.Date;
import java.sql.Timestamp;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
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
	
	@Override
	public List<Schedule> findActiveSchedules(int userId, Date startDate, Date endDate) {
		String sql="SELECT s.id,s.plan_id,s.user_id,s.schedule_date,s.schedule_type_id,s.start,s.end,s.org_unit_id "
				+ "FROM schedule s INNER JOIN plan p ON s.plan_id=p.id "
				+ "WHERE s.user_id=:userId "
				+ "AND s.schedule_date>=:startDate "
				+ "AND s.schedule_date<=:endDate "
				+ "AND p.active=TRUE "
				+ "ORDER BY s.schedule_date";
		Query qry=em.createNativeQuery(sql, Schedule.class);
		qry.setParameter("userId", userId);
		qry.setParameter("startDate", startDate);
		qry.setParameter("endDate", endDate);
		List<Schedule> schedules=null;
		try {
			schedules=qry.getResultList();
		}
		catch(NoResultException nre) {
			//no schedules
		}
		return schedules;
	}

	@Override
	public Schedule findScheduleByStampIn(int userId, Timestamp in, int secondsBefore, int secondsAfter) {
		String sql="select * " 
				+"from schedule "
				+"where user_id=:userId " 
				+"and timestampdiff(second,timestamp(schedule_date,start),:tsIn) between :secondsBefore and :secondsAfter";
		Query qry=em.createNativeQuery(sql,Schedule.class);
		qry.setParameter("userId", userId);
		qry.setParameter("tsIn", in);
		qry.setParameter("secondsBefore", -secondsBefore);
		qry.setParameter("secondsAfter", secondsAfter);
		Schedule schedule=null;
		try {
			schedule=(Schedule)qry.getSingleResult();
		}
		catch(NoResultException nre) {
			//no results
		}
		return schedule;
	}

	@Override
	public Schedule findScheduleByStampOut(int userId, Timestamp out, int secondsBefore, int secondsAfter) {
		String sql="select * " 
				+"from schedule "
				+"where user_id=:userId " 
				+"and timestampdiff(second,timestamp(schedule_date,end),:tsOut) between :secondsBefore and :secondsAfter";
		Query qry=em.createNativeQuery(sql,Schedule.class);
		qry.setParameter("userId", userId);
		qry.setParameter("tsOut", out);
		qry.setParameter("secondsBefore", -secondsBefore);
		qry.setParameter("secondsAfter", secondsAfter);
		Schedule schedule=null;
		try {
			schedule=(Schedule)qry.getSingleResult();
		}
		catch(NoResultException nre) {
			//no results
		}
		return schedule;
	}

}
