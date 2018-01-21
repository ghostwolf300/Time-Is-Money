package com.tim.db.userassignment;

import java.sql.Date;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import com.tim.db.common.AbstractDateEffectiveRepository;
import com.tim.entities.UserAssignment;
import com.tim.entities.UserContract;
import com.tim.entities.UserPersonal;

public class UserAssignmentRepositoryImpl extends AbstractDateEffectiveRepository<UserAssignment> implements UserAssignmentRepositoryCustom {
	
	public UserAssignmentRepositoryImpl() {
		System.out.println("UserAssignmentRepository initializing...");
		this.setRecClass(UserAssignment.class);
	}
	
	@Override
	public UserAssignment findByUserIdAndKeyDate(int userId, Date date) {
		String sqlStr="SELECT ua FROM UserAssignment ua "
				+ "WHERE ua.key.userId=:userId "
				+ "AND ua.key.startDate<=:keyDate "
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
	
	public UserAssignment save(UserAssignment ua) {
		UserAssignment saved=super.save(ua);
		System.out.println("Saved assignment..."+saved.getOrgUnit().getId());
		UserAssignment rec=super.findByKey(saved.getKey());
		System.out.println("Complete record CCID: "+rec.getOrgUnit().getCostCenter().getId());
		return rec;
	}
	
}
