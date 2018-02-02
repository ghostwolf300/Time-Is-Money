package com.tim.db.userassignment;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.NoResultException;
import javax.persistence.Query;
import javax.persistence.TypedQuery;

import com.tim.db.common.AbstractDateEffectiveRepository;
import com.tim.entities.UserAssignment;

import com.tim.pojo.AssignedResult;
import com.tim.pojo.Period;

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

	@Override
	public List<AssignedResult> findAssignedTo(int orgUnitId, Date startDate, Date endDate) {
		System.out.println(orgUnitId+" "+startDate+"-"+endDate);
		String qrySql=
				"select a.user_id,a.first_name,a.last_name,b.start_date,b.end_date from "
				+"("
				+"select user_id,first_name,last_name from user_personal " 
				+"where (start_date between :startDate and :endDate) "
				+"or (end_date between :startDate and :endDate) "
				+"or (start_date<=:startDate and end_date>=:endDate) "
				+"or (start_date<=:startDate and end_date is null) group by user_id"
				+") as a "
				+"right join "
				+"("
				+"select user_id,start_date,end_date from user_assignment " 
				+"where org_unit_id=:orgUnitId " 
				+"and ("
				+"(start_date between :startDate and :endDate) "
				+"or (end_date between :startDate and :endDate) "
				+"or (start_date<=:startDate and end_date>=:endDate) "
				+"or (start_date<=:startDate and end_date is null))"
				+") as b on a.user_id=b.user_id";
		
		Query qry=em.createNativeQuery(qrySql);
		qry.setParameter("startDate", startDate);
		qry.setParameter("endDate", endDate);
		qry.setParameter("orgUnitId", orgUnitId);
		
		List<Object[]> results=qry.getResultList();
		
		List<AssignedResult> assignedList=new ArrayList<AssignedResult>();
		for(Object[] r : results) {
			int userId=(int) r[0];
			String firstName=(String) r[1];
			String lastName=(String) r[2];
			Date aStartDate=(Date) r[3];
			Date aEndDate=(Date) r[4];
			boolean found=false;
			for(AssignedResult ar : assignedList) {
				if(ar.getUserId()==userId) {
					ar.addActivePeriod(new Period(aStartDate,aEndDate));
					found=true;
					break;
				}
			}
			if(!found) {
				AssignedResult ar=new AssignedResult(userId,firstName,lastName);
				ar.addActivePeriod(new Period(aStartDate,aEndDate));
				assignedList.add(ar);
			}
		}
		System.out.println("Employees found: "+assignedList.size());
		return assignedList;
	}
	
	/*public UserAssignment save(UserAssignment ua) {
		UserAssignment saved=super.save(ua);
		UserAssignment rec=null;
		System.out.println("Saved assignment..."+saved.getOrgUnit().getId());
		String sqlStr="SELECT ua FROM UserAssignment ua "
				+ "WHERE ua.key.userId=:userId "
				+ "AND ua.key.startDate=:startDate";
		TypedQuery<UserAssignment> query=em.createQuery(sqlStr, UserAssignment.class);
		query.setParameter("userId",saved.getKey().getUserId());
		query.setParameter("startDate",saved.getKey().getStartDate());
		try {
			rec=query.getSingleResult();
		}
		catch(NoResultException nre) {
			//No results found
		}
		System.out.println("after save... ccid: "+rec.getOrgUnit().getCostCenterId());
		return saved;
	}*/
	
}
