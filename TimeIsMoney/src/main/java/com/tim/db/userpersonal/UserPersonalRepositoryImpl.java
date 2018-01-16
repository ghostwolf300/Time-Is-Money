package com.tim.db.userpersonal;

import java.sql.Date;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;

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

}
