package com.tim.db.userassignment;

import java.sql.Date;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;

import com.tim.entities.UserAssignment;

public class UserAssignmentRepositoryImpl implements UserAssignmentRepositoryCustom {
	
	@PersistenceContext
	private EntityManager em;
	
	@Override
	public UserAssignment myCustomQuery() {
		// TODO Auto-generated method stub
		return null;
	}

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

}
