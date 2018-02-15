package com.tim.db.userpersonal;

import java.sql.Date;

import javax.persistence.NoResultException;
import javax.persistence.TypedQuery;

import com.tim.db.common.AbstractDateEffectiveRepository;
import com.tim.entities.UserPersonal;

public class UserPersonalRepositoryImpl extends AbstractDateEffectiveRepository<UserPersonal> implements UserPersonalRepositoryCustom {
	
	public UserPersonalRepositoryImpl() {
		System.out.println("UserPersonalRepository initializing...");
		this.setRecClass(UserPersonal.class);
	}
	
	@Override
	public UserPersonal findByUserIdAndKeyDate(int userId, Date date) {
		String sqlStr="SELECT up FROM UserPersonal up "
				+ "WHERE up.key.userId=:userId "
				+ "AND up.key.startDate<=:keyDate "
				+ "AND (up.endDate>=:keyDate OR up.endDate IS NULL)";
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

	/*@Override
	@Transactional
	public UserPersonal save(UserPersonal userPersonal) {
		System.out.println("saving record...");
		
		UserPersonal up=null;
		UserPersonal next=null;
		UserPersonal prev=null;
		Calendar c=Calendar.getInstance();
		
		up=em.find(UserPersonal.class,userPersonal.getKey());
		
		if(up!=null) {
			System.out.println("record found. updating.");
			up.setEndDate(userPersonal.getEndDate());
			up.setFirstName(userPersonal.getFirstName());
			up.setMiddleName(userPersonal.getMiddleName());
			up.setLastName(userPersonal.getLastName());
			up.setBirthDate(userPersonal.getBirthDate());
			up.setPhone(userPersonal.getPhone());
			up.setEmail(userPersonal.getEmail());
			up.setChangedBy(userPersonal.getChangedBy());
			
			next=findNextRecord(up.getKey().getUserId(),up.getKey().getStartDate());
			//if next exists
			if(next!=null) {
				System.out.println("next found");
				//if next.startDate!=this.endDate+1
				c.setTime(up.getEndDate());
				c.add(Calendar.DATE, 1);
				if(next.getKey().getStartDate().compareTo(c.getTime())!=0) {
					//if next.endDate==null or this.endDate+1<=next.endDate
					if(next.getEndDate()==null 
							|| c.getTime().compareTo(next.getEndDate())==-1 
							|| c.getTime().compareTo(next.getEndDate())==0){
						//update next.startDate=this.endDate+1
						System.out.println("moving next start date");
						next.getKey().setStartDate(new Date(c.getTimeInMillis()));
					}	
					//else
					else {
						System.out.println("deleting next");
						//delete next
						em.remove(next);
					}
				}
				
			}
			
				
		}
		else {
			//insert this
			up=new UserPersonal(userPersonal);
			em.persist(up);
			System.out.println("inserting new");
			//if previous record exist
			prev=findPreviousRecord(up.getKey().getUserId(),up.getKey().getStartDate());
			if(prev!=null) {
				//update prev.endDate=this.startDate-1
				System.out.println("prev found. updating prev end date");
				c.setTime(up.getKey().getStartDate());
				c.add(Calendar.DATE, -1);
				prev.setEndDate(new Date(c.getTimeInMillis()));
			}
			
			//if this.endDate==null
			if(up.getEndDate()==null) {
				System.out.println("no end date. deleting future records.");
				deleteRecordsAfterStartDate(up.getKey().getUserId(),up.getKey().getStartDate());
			}
			else {
				System.out.println("end date exist. deleting records between start_date and end_date.");
				//delete where startDate>this.startDate and endDate<=this.endDate and userId=this.userId
				deleteRecordsBetweenDates(
						userPersonal.getKey().getUserId(),
						userPersonal.getKey().getStartDate(),
						userPersonal.getEndDate()
						);
				next=findNextRecord(up.getKey().getUserId(),up.getKey().getStartDate());
				if(next!=null) {
					c.setTime(up.getEndDate());
					c.add(Calendar.DATE, 1);
					if(next.getEndDate()==null 
							|| c.getTime().compareTo(next.getEndDate())==-1 
							|| c.getTime().compareTo(next.getEndDate())==0){
						//update next.startDate=this.endDate+1
						System.out.println("next found. updating next start date.");
						next.getKey().setStartDate(new Date(c.getTimeInMillis()));
					}	
					//else
					else {
						//delete next
						System.out.println("deleting next");
						em.remove(next);
					}
				}
			}
		}
		return up;
	}*/
	
	/*@Transactional
	private int deleteRecordsBetweenDates(int userId,Date startDate, Date endDate) {
		CriteriaBuilder cb=em.getCriteriaBuilder();
		CriteriaDelete<UserPersonal> delete=cb.createCriteriaDelete(UserPersonal.class);
		Root<UserPersonal> root=delete.from(UserPersonal.class);
		delete.where(
				cb.equal(root.get("key").get("userId"), userId),
				cb.greaterThan(root.get("key").get("startDate"), startDate),
				cb.lessThanOrEqualTo(root.get("endDate"), endDate)
		);
		return em.createQuery(delete).executeUpdate();
	}
	
	@Transactional
	private int deleteRecordsAfterStartDate(int userId,Date startDate) {
		CriteriaBuilder cb=em.getCriteriaBuilder();
		CriteriaDelete<UserPersonal> delete=cb.createCriteriaDelete(UserPersonal.class);
		Root<UserPersonal> root=delete.from(UserPersonal.class);
		delete.where(
				cb.equal(root.get("key").get("userId"), userId),
				cb.greaterThan(root.get("key").get("startDate"), startDate)
		);
		return em.createQuery(delete).executeUpdate();
	}
*/
}
