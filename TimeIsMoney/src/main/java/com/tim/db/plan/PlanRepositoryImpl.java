package com.tim.db.plan;

import java.sql.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;

import com.tim.entities.Plan;

public class PlanRepositoryImpl implements PlanRepositoryCustom {
	
	@PersistenceContext
    private EntityManager em;
	
	@Override
	public Plan myCustomQuery() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Plan findActivePlan(int orgUnitId, Date keyDate) {
		String qryStr="SELECT p FROM Plan p JOIN p.orgUnits po "
					+ "WHERE p.active=true "
					+ "AND po.key.orgUnit.id=:orgUnitId "
					+ "AND p.startDate<=:keyDate "
					+ "AND p.endDate>=:keyDate";
		TypedQuery<Plan> qry=em.createQuery(qryStr,Plan.class);
		qry.setParameter("orgUnitId", orgUnitId);
		qry.setParameter("keyDate", keyDate);
		Plan plan=null;
		try {
			plan=qry.getSingleResult();
		}
		catch(NoResultException nre) {
			
		}
		return plan;
	}

	@Override
	public List<Plan> findPlans(int orgUnitId, Date keyDate) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<Plan> findPlans(Date startDate, Date endDate) {
		// TODO Auto-generated method stub
		return null;
	}

}
