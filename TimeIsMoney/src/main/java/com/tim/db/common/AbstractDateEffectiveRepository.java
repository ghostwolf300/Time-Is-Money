package com.tim.db.common;

import java.sql.Date;
import java.util.Calendar;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaDelete;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;
import javax.transaction.Transactional;

import com.tim.entities.DateEffectiveKey;
import com.tim.entities.DateEffectiveRecord;


public abstract class AbstractDateEffectiveRepository<T extends DateEffectiveRecord> {
	
	@PersistenceContext
    protected EntityManager em;
	private Class<T> recClass;
	
	public AbstractDateEffectiveRepository() {
		
	}
	
	public AbstractDateEffectiveRepository(Class<T> recClass) {
		this.recClass=recClass;
	}
	
	public Class<T> getRecClass() {
		return recClass;
	}

	public void setRecClass(Class<T> recClass) {
		this.recClass = recClass;
	}

	@Transactional
	protected int deleteRecordsBetweenDates(int userId,Date startDate, Date endDate) {
		CriteriaBuilder cb=em.getCriteriaBuilder();
		CriteriaDelete<T> delete=cb.createCriteriaDelete(recClass);
		Root<T> root=delete.from(recClass);
		delete.where(
				cb.equal(root.get("key").get("userId"), userId),
				cb.greaterThan(root.get("key").get("startDate"), startDate),
				cb.lessThanOrEqualTo(root.get("endDate"), endDate)
		);
		return em.createQuery(delete).executeUpdate();
	}
	
	@Transactional
	protected int deleteRecordsAfterStartDate(int userId,Date startDate) {
		CriteriaBuilder cb=em.getCriteriaBuilder();
		CriteriaDelete<T> delete=cb.createCriteriaDelete(recClass);
		Root<T> root=delete.from(recClass);
		delete.where(
				cb.equal(root.get("key").get("userId"), userId),
				cb.greaterThan(root.get("key").get("startDate"), startDate)
		);
		return em.createQuery(delete).executeUpdate();
	}
	
	public T findByKey(DateEffectiveKey key) {
		CriteriaBuilder builder=em.getCriteriaBuilder();
		CriteriaQuery<T> query=builder.createQuery(recClass);
		Root<T> root=query.from(recClass);
		query.select(root);
		query.where(
				builder.equal(root.get("key").get("userId"), key.getUserId()),
				builder.equal(root.get("key").get("startDate"), key.getStartDate())
		);
		
		T rec=null;
		try {
			rec=em.createQuery(query).getSingleResult();
		}
		catch(NoResultException nre) {
			System.out.println("findByKey: No results!");
		}
		return rec;
	}

	public int getRecordCountBeforeDate(int userId, Date date) {
		
		CriteriaBuilder cb=em.getCriteriaBuilder();
		
		CriteriaQuery<Long> cq=cb.createQuery(Long.class);
		Root<T> up=cq.from(recClass);
		
		cq.select(cb.count(up));
		cq.where(
				cb.equal(up.get("key").get("userId"), userId),
				cb.lessThan(up.get("key").get("startDate"),date)
		);
		return em.createQuery(cq).getSingleResult().intValue();
	}

	public int getRecordCountAfterDate(int userId, Date date) {
		
		CriteriaBuilder cb=em.getCriteriaBuilder();
		
		CriteriaQuery<Long> cq=cb.createQuery(Long.class);
		Root<T> up=cq.from(recClass);
		
		cq.select(cb.count(up));
		cq.where(
				cb.equal(up.get("key").get("userId"), userId),
				cb.greaterThan(up.get("key").get("startDate"),date)
		);
		
		return em.createQuery(cq).getSingleResult().intValue();
	}

	public T findNextRecord(int userId, Date keyDate) {
		CriteriaBuilder builder=em.getCriteriaBuilder();
		CriteriaQuery<T> query=builder.createQuery(recClass);
		Root<T> root=query.from(recClass);
		query.select(root).distinct(true).orderBy(builder.asc(root.get("key").get("startDate")));
		query.where(
				builder.equal(root.get("key").get("userId"), userId),
				builder.greaterThan(root.get("key").get("startDate"), keyDate)
		);
		
		T rec=null;
		try {
			rec=em.createQuery(query).setMaxResults(1).getSingleResult();
		}
		catch(NoResultException nre) {
			//No results
		}
		return rec;
	}

	public T findPreviousRecord(int userId, Date keyDate) {
		CriteriaBuilder builder=em.getCriteriaBuilder();
		CriteriaQuery<T> query=builder.createQuery(recClass);
		Root<T> root=query.from(recClass);
		query.select(root).distinct(true).orderBy(builder.desc(root.get("key").get("startDate")));
		
		query.where(
				builder.equal(root.get("key").get("userId"), userId),
				builder.lessThan(root.get("key").get("startDate"), keyDate)
		);
		
		T rec=null;
		try {
			rec=em.createQuery(query).setMaxResults(1).getSingleResult();
		}
		catch(NoResultException nre) {
			//No results
		}
		return rec;
	}

	public T findFirstRecord(int userId) {
		// TODO Auto-generated method stub
		return null;
	}

	public T findLastRecord(int userId) {
		// TODO Auto-generated method stub
		return null;
	}
	
	@SuppressWarnings("unchecked")
	@Transactional
	public T save(T newRec) {
		System.out.println("saving record...");
		
		T dbRec=null;
		T next=null;
		T prev=null;
		Calendar c=Calendar.getInstance();
		
		dbRec=em.find(recClass,newRec.getKey());
		
		if(dbRec!=null) {
			System.out.println("record found. updating.");
			dbRec.copy(newRec);
			next=findNextRecord(dbRec.getKey().getUserId(),dbRec.getKey().getStartDate());
			//if next exists
			if(next!=null) {
				System.out.println("next found");
				//if next.startDate!=this.endDate+1
				c.setTime(dbRec.getEndDate());
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
			System.out.println("inserting new");
			dbRec=newRec;
			em.persist(dbRec);
			//if previous record exist
			prev=findPreviousRecord(dbRec.getKey().getUserId(),dbRec.getKey().getStartDate());
			if(prev!=null) {
				//update prev.endDate=this.startDate-1
				System.out.println("prev found. updating prev end date");
				c.setTime(dbRec.getKey().getStartDate());
				c.add(Calendar.DATE, -1);
				prev.setEndDate(new Date(c.getTimeInMillis()));
			}
			
			//if this.endDate==null
			if(dbRec.getEndDate()==null) {
				System.out.println("no end date. deleting future records.");
				deleteRecordsAfterStartDate(dbRec.getKey().getUserId(),dbRec.getKey().getStartDate());
			}
			else {
				System.out.println("end date exist. deleting records between start_date and end_date.");
				//delete where startDate>this.startDate and endDate<=this.endDate and userId=this.userId
				deleteRecordsBetweenDates(
						newRec.getKey().getUserId(),
						newRec.getKey().getStartDate(),
						newRec.getEndDate()
						);
				next=findNextRecord(dbRec.getKey().getUserId(),dbRec.getKey().getStartDate());
				if(next!=null) {
					c.setTime(dbRec.getEndDate());
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
		return dbRec;
	}
	
}
