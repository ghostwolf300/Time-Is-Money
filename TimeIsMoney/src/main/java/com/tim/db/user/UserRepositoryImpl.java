package com.tim.db.user;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import com.tim.entities.User;



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

}
