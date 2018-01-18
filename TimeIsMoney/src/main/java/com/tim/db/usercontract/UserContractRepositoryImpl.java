package com.tim.db.usercontract;

import java.sql.Date;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import com.tim.entities.UserContract;
import com.tim.entities.UserPersonal;

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

	@Override
	public int getRecordCountBeforeDate(int userId, Date date) {
		
		CriteriaBuilder cb=em.getCriteriaBuilder();
		
		CriteriaQuery<Long> cq=cb.createQuery(Long.class);
		Root<UserContract> uc=cq.from(UserContract.class);
		
		cq.select(cb.count(uc));
		cq.where(
				cb.equal(uc.get("userContractKey").get("userId"), userId),
				cb.lessThan(uc.get("userContractKey").get("startDate"),date)
		);
		
		return em.createQuery(cq).getSingleResult().intValue();
	}

	@Override
	public int getRecordCountAfterDate(int userId, Date date) {
		
		CriteriaBuilder cb=em.getCriteriaBuilder();
		
		CriteriaQuery<Long> cq=cb.createQuery(Long.class);
		Root<UserContract> uc=cq.from(UserContract.class);
		
		cq.select(cb.count(uc));
		cq.where(
				cb.equal(uc.get("userContractKey").get("userId"), userId),
				cb.greaterThan(uc.get("userContractKey").get("startDate"),date)
		);
		
		return em.createQuery(cq).getSingleResult().intValue();
	}

	@Override
	public UserContract findNextRecord(int userId, Date keyDate) {
		CriteriaBuilder builder=em.getCriteriaBuilder();
		CriteriaQuery<UserContract> query=builder.createQuery(UserContract.class);
		Root<UserContract> root=query.from(UserContract.class);
		query.select(root).distinct(true).orderBy(builder.asc(root.get("userContractKey").get("startDate")));
		query.where(
				builder.equal(root.get("userContractKey").get("userId"), userId),
				builder.greaterThan(root.get("userContractKey").get("startDate"), keyDate)
		);
		
		UserContract uc=null;
		try {
			uc=em.createQuery(query).setMaxResults(1).getSingleResult();
		}
		catch(NoResultException nre) {
			//No results
		}
		return uc;
	}

	@Override
	public UserContract findPreviousRecord(int userId, Date keyDate) {
		CriteriaBuilder builder=em.getCriteriaBuilder();
		CriteriaQuery<UserContract> query=builder.createQuery(UserContract.class);
		Root<UserContract> root=query.from(UserContract.class);
		query.select(root).distinct(true).orderBy(builder.desc(root.get("userContractKey").get("startDate")));
		
		query.where(
				builder.equal(root.get("userContractKey").get("userId"), userId),
				builder.lessThan(root.get("userContractKey").get("startDate"), keyDate)
		);
		
		UserContract uc=null;
		try {
			uc=em.createQuery(query).setMaxResults(1).getSingleResult();
		}
		catch(NoResultException nre) {
			//No results
		}
		return uc;
	}

	@Override
	public UserContract findFirstRecord(int userId) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public UserContract findLastRecord(int userId) {
		// TODO Auto-generated method stub
		return null;
	}

}
