package com.tim.db.usercontract;

import java.sql.Date;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import com.tim.db.common.AbstractDateEffectiveRepository;
import com.tim.entities.UserContract;
import com.tim.entities.UserPersonal;

public class UserContractRepositoryImpl extends AbstractDateEffectiveRepository<UserContract> implements UserContractRepositoryCustom {
	
	public UserContractRepositoryImpl() {
		System.out.println("UserContractRepository initializing...");
		this.setRecClass(UserContract.class);
	}
	
	@Override
	public UserContract findByUserIdAndKeyDate(int userId, Date date) {
		String sqlStr="SELECT uc FROM UserContract uc "
		+ "WHERE uc.key.userId=:userId "
		+ "AND uc.key.startDate<=:keyDate "
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
