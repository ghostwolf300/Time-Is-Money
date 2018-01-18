package com.tim.db.userpersonal;

import java.sql.Date;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.ParameterExpression;
import javax.persistence.criteria.Root;

import com.tim.entities.UserContract;
import com.tim.entities.UserPersonal;

public class UserPersonalRepositoryImpl implements UserPersonalRepositoryCustom {
	
	@PersistenceContext
	private EntityManager em;
	
	@Override
	public UserPersonal findByUserIdAndKeyDate(int userId, Date date) {
		String sqlStr="SELECT up FROM UserPersonal up "
				+ "WHERE up.userPersonalKey.userId=:userId "
				+ "AND up.userPersonalKey.startDate<=:keyDate "
				+ "AND (up.endDate>:keyDate OR up.endDate IS NULL)";
		TypedQuery<UserPersonal> query=em.createQuery(sqlStr, UserPersonal.class);
		query.setParameter("userId",userId);
		query.setParameter("keyDate", date);
		UserPersonal up=null;
		try {
			up=query.getSingleResult();
		}
		catch(NoResultException nre) {
			//No results found
		}
		return up;
	}

	@Override
	public int getRecordCountBeforeDate(int userId, Date date) {
		
		CriteriaBuilder cb=em.getCriteriaBuilder();
		
		CriteriaQuery<Long> cq=cb.createQuery(Long.class);
		Root<UserPersonal> up=cq.from(UserPersonal.class);
		
		cq.select(cb.count(up));
		cq.where(
				cb.equal(up.get("userPersonalKey").get("userId"), userId),
				cb.lessThan(up.get("userPersonalKey").get("startDate"),date)
		);
		return em.createQuery(cq).getSingleResult().intValue();
	}

	@Override
	public int getRecordCountAfterDate(int userId, Date date) {
		
		CriteriaBuilder cb=em.getCriteriaBuilder();
		
		CriteriaQuery<Long> cq=cb.createQuery(Long.class);
		Root<UserPersonal> up=cq.from(UserPersonal.class);
		
		cq.select(cb.count(up));
		cq.where(
				cb.equal(up.get("userPersonalKey").get("userId"), userId),
				cb.greaterThan(up.get("userPersonalKey").get("startDate"),date)
		);
		
		return em.createQuery(cq).getSingleResult().intValue();
	}

	@Override
	public UserPersonal findNextRecord(int userId, Date keyDate) {
		CriteriaBuilder builder=em.getCriteriaBuilder();
		CriteriaQuery<UserPersonal> query=builder.createQuery(UserPersonal.class);
		Root<UserPersonal> root=query.from(UserPersonal.class);
		query.select(root).distinct(true).orderBy(builder.asc(root.get("userPersonalKey").get("startDate")));
		query.where(
				builder.equal(root.get("userPersonalKey").get("userId"), userId),
				builder.greaterThan(root.get("userPersonalKey").get("startDate"), keyDate)
		);
		
		UserPersonal up=null;
		try {
			up=em.createQuery(query).setMaxResults(1).getSingleResult();
		}
		catch(NoResultException nre) {
			//No results
		}
		return up;
	}

	@Override
	public UserPersonal findPreviousRecord(int userId, Date keyDate) {
		CriteriaBuilder builder=em.getCriteriaBuilder();
		CriteriaQuery<UserPersonal> query=builder.createQuery(UserPersonal.class);
		Root<UserPersonal> root=query.from(UserPersonal.class);
		query.select(root).distinct(true).orderBy(builder.desc(root.get("userPersonalKey").get("startDate")));
		
		query.where(
				builder.equal(root.get("userPersonalKey").get("userId"), userId),
				builder.lessThan(root.get("userPersonalKey").get("startDate"), keyDate)
		);
		
		UserPersonal up=null;
		try {
			up=em.createQuery(query).setMaxResults(1).getSingleResult();
		}
		catch(NoResultException nre) {
			//No results
		}
		return up;
	}

	@Override
	public UserPersonal findFirstRecord(int userId) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public UserPersonal findLastRecord(int userId) {
		// TODO Auto-generated method stub
		return null;
	}

}
