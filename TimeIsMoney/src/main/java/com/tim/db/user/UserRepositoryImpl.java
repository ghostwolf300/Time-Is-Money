package com.tim.db.user;

import java.sql.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import com.tim.entities.User;
import com.tim.pojo.UserSearchResult;



public class UserRepositoryImpl implements UserRepositoryCustom {
	
	@PersistenceContext
	private EntityManager em;
	
	@Override
	public User myQuery(String username) {
		String queryString="SELECT u FROM User u INNER JOIN u.personalRecords up WHERE up.endDate IS NULL AND u.username=:username";
		Query query=em.createQuery(queryString);
		query.setParameter("username", username);
		User u=(User)query.getSingleResult();
		return u;
	}

	@Override
	public List<User> currentRecords() {
		String queryString="SELECT u FROM User u INNER JOIN u.personalRecords up WHERE up.endDate IS NULL ORDER BY up.lastName";
		Query query=em.createQuery(queryString);
		@SuppressWarnings("unchecked")
		List<User> users=query.getResultList();
		return users;
	}
	
	public List<UserSearchResult> findAllCustom(){
		String queryString="SELECT u.id,u.username,up.first_name,up.last_name FROM user u LEFT JOIN user_personal up ON u.id=up.user_id " + 
				"WHERE up.start_date IS NULL OR (up.start_date<=:keyDate AND (up.end_date>=:keyDate OR up.end_date IS NULL))";
		Query query=em.createNativeQuery(queryString, "UserSearchResults");
		query.setParameter("keyDate", new Date(System.currentTimeMillis()));
		@SuppressWarnings("unchecked")
		List<UserSearchResult> results=query.getResultList();
		/*for(UserSearchResult r : results) {
			System.out.println(r.getId()+" "+r.getUsername()+" "+r.getLastName());
		}*/
		return results;
	}

}
