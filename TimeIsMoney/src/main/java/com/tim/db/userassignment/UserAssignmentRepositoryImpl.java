package com.tim.db.userassignment;

import java.sql.Date;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import com.tim.entities.UserAssignment;
import com.tim.entities.UserContract;

public class UserAssignmentRepositoryImpl implements UserAssignmentRepositoryCustom {
	
	@PersistenceContext
	private EntityManager em;

	@Override
	public UserAssignment findByUserIdAndKeyDate(int userId, Date date) {
		String sqlStr="SELECT ua FROM UserAssignment ua "
				+ "WHERE ua.userAssignmentKey.userId=:userId "
				+ "AND ua.userAssignmentKey.startDate<=:keyDate "
				+ "AND (ua.endDate>:keyDate OR ua.endDate IS NULL)";
		TypedQuery<UserAssignment> query=em.createQuery(sqlStr, UserAssignment.class);
		query.setParameter("userId",userId);
		query.setParameter("keyDate", date);
		UserAssignment ua=null;
		try {
			ua=query.getSingleResult();
		}
		catch(NoResultException nre) {
			//No results found
		}
		return ua;
	}

	@Override
	public int getRecordCountBeforeDate(int userId, Date date) {
		
		CriteriaBuilder cb=em.getCriteriaBuilder();
		
		CriteriaQuery<Long> cq=cb.createQuery(Long.class);
		Root<UserAssignment> ua=cq.from(UserAssignment.class);
		
		cq.select(cb.count(ua));
		cq.where(
				cb.equal(ua.get("userAssignmentKey").get("userId"), userId),
				cb.lessThan(ua.get("userAssignmentKey").get("startDate"),date)
		);
		return em.createQuery(cq).getSingleResult().intValue();
	}

	@Override
	public int getRecordCountAfterDate(int userId, Date date) {
		
		CriteriaBuilder cb=em.getCriteriaBuilder();
		
		CriteriaQuery<Long> cq=cb.createQuery(Long.class);
		Root<UserAssignment> ua=cq.from(UserAssignment.class);
		
		cq.select(cb.count(ua));
		cq.where(
				cb.equal(ua.get("userAssignmentKey").get("userId"), userId),
				cb.greaterThan(ua.get("userAssignmentKey").get("startDate"),date)
		);
		return em.createQuery(cq).getSingleResult().intValue();
	}

	@Override
	public UserAssignment findNextRecord(int userId, Date keyDate) {
		
		CriteriaBuilder builder=em.getCriteriaBuilder();
		CriteriaQuery<UserAssignment> query=builder.createQuery(UserAssignment.class);
		Root<UserAssignment> root=query.from(UserAssignment.class);
		query.select(root).distinct(true).orderBy(builder.asc(root.get("userAssignmentKey").get("startDate")));
		query.where(
				builder.equal(root.get("userAssignmentKey").get("userId"), userId),
				builder.greaterThan(root.get("userAssignmentKey").get("startDate"), keyDate)
		);
		
		UserAssignment ua=null;
		try {
			ua=em.createQuery(query).setMaxResults(1).getSingleResult();
		}
		catch(NoResultException nre) {
			//No results
		}
		return ua;
	}

	@Override
	public UserAssignment findPreviousRecord(int userId, Date keyDate) {
		CriteriaBuilder builder=em.getCriteriaBuilder();
		CriteriaQuery<UserAssignment> query=builder.createQuery(UserAssignment.class);
		Root<UserAssignment> root=query.from(UserAssignment.class);
		query.select(root).distinct(true).orderBy(builder.desc(root.get("userAssignmentKey").get("startDate")));
		
		query.where(
				builder.equal(root.get("userAssignmentKey").get("userId"), userId),
				builder.lessThan(root.get("userAssignmentKey").get("startDate"), keyDate)
		);
		
		UserAssignment ua=null;
		try {
			ua=em.createQuery(query).setMaxResults(1).getSingleResult();
		}
		catch(NoResultException nre) {
			//No results
		}
		return ua;
	}

	@Override
	public UserAssignment findFirstRecord(int userId) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public UserAssignment findLastRecord(int userId) {
		// TODO Auto-generated method stub
		return null;
	}

}
