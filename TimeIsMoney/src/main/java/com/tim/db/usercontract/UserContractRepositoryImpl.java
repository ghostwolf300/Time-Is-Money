package com.tim.db.usercontract;

import java.sql.Date;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;

import com.tim.entities.UserContract;

public class UserContractRepositoryImpl implements UserContractRepositoryCustom {
	
	@PersistenceContext
	private EntityManager em;
	
	@Override
	public UserContract findByUserIdAndKeyDate(int userId, Date date) {
		String sqlStr="SELECT uc FROM UserContract uc "
		+ "WHERE uc.userContractKey.userId=:userId "
		+ "AND uc.userContractKey.startDate<=:keyDate "
		+ "AND (uc.endDate>:keyDate OR uc.endDate IS NULL)";
		TypedQuery<UserContract> query=em.createQuery(sqlStr, UserContract.class);
		query.setParameter("userId",userId);
		query.setParameter("keyDate", date);
		UserContract uc=null;
		try {
			uc=query.getSingleResult();
		}
		catch(NoResultException nre) {
			//No results found
		}
		return uc;
	}

}
