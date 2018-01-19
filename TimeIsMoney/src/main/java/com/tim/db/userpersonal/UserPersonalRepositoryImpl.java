package com.tim.db.userpersonal;

import java.sql.Date;
import java.util.Calendar;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaDelete;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;
import javax.transaction.Transactional;

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

	@Override
	@Transactional
	public UserPersonal save(UserPersonal userPersonal) {
		System.out.println("saving record...");
		
		UserPersonal up=null;
		UserPersonal next=null;
		UserPersonal prev=null;
		Calendar c=Calendar.getInstance();
		
		up=em.find(UserPersonal.class,userPersonal.getUserPersonalKey());
		
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
			
			next=findNextRecord(up.getUserPersonalKey().getUserId(),up.getUserPersonalKey().getStartDate());
			//if next exists
			if(next!=null) {
				System.out.println("next found");
				//if next.startDate!=this.endDate+1
				c.setTime(up.getEndDate());
				c.add(Calendar.DATE, 1);
				if(next.getUserPersonalKey().getStartDate().compareTo(c.getTime())!=0) {
					//if next.endDate==null or this.endDate+1<=next.endDate
					if(next.getEndDate()==null 
							|| c.getTime().compareTo(next.getEndDate())==-1 
							|| c.getTime().compareTo(next.getEndDate())==0){
						//update next.startDate=this.endDate+1
						System.out.println("moving next start date");
						next.getUserPersonalKey().setStartDate(new Date(c.getTimeInMillis()));
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
			prev=findPreviousRecord(up.getUserPersonalKey().getUserId(),up.getUserPersonalKey().getStartDate());
			if(prev!=null) {
				//update prev.endDate=this.startDate-1
				System.out.println("prev found. updating prev end date");
				c.setTime(up.getUserPersonalKey().getStartDate());
				c.add(Calendar.DATE, -1);
				prev.setEndDate(new Date(c.getTimeInMillis()));
			}
			
			//if this.endDate==null
			if(up.getEndDate()==null) {
				System.out.println("no end date. deleting future records.");
				deleteRecordsAfterStartDate(up.getUserPersonalKey().getUserId(),up.getUserPersonalKey().getStartDate());
			}
			else {
				System.out.println("end date exist. deleting records between start_date and end_date.");
				//delete where startDate>this.startDate and endDate<=this.endDate and userId=this.userId
				deleteRecordsBetweenDates(
						userPersonal.getUserPersonalKey().getUserId(),
						userPersonal.getUserPersonalKey().getStartDate(),
						userPersonal.getEndDate()
						);
				next=findNextRecord(up.getUserPersonalKey().getUserId(),up.getUserPersonalKey().getStartDate());
				if(next!=null) {
					c.setTime(up.getEndDate());
					c.add(Calendar.DATE, 1);
					if(next.getEndDate()==null 
							|| c.getTime().compareTo(next.getEndDate())==-1 
							|| c.getTime().compareTo(next.getEndDate())==0){
						//update next.startDate=this.endDate+1
						System.out.println("next found. updating next start date.");
						next.getUserPersonalKey().setStartDate(new Date(c.getTimeInMillis()));
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
	}
	
	@Transactional
	private int deleteRecordsBetweenDates(int userId,Date startDate, Date endDate) {
		CriteriaBuilder cb=em.getCriteriaBuilder();
		CriteriaDelete<UserPersonal> delete=cb.createCriteriaDelete(UserPersonal.class);
		Root<UserPersonal> root=delete.from(UserPersonal.class);
		delete.where(
				cb.equal(root.get("userPersonalKey").get("userId"), userId),
				cb.greaterThan(root.get("userPersonalKey").get("startDate"), startDate),
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
				cb.equal(root.get("userPersonalKey").get("userId"), userId),
				cb.greaterThan(root.get("userPersonalKey").get("startDate"), startDate)
		);
		return em.createQuery(delete).executeUpdate();
	}

}
