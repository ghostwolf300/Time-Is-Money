package com.tim.db.user;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import com.tim.entities.User;



public class UserRepositoryImpl implements UserRepositoryCustom {
	
	@PersistenceContext
	private EntityManager em;
	
	@Override
	public User myQuery(String username) {
		String queryString="SELECT u FROM User u INNER JOIN u.userPersonalSet up WHERE up.endDate IS NULL AND u.username=:username";
		Query query=em.createQuery(queryString);
		query.setParameter("username", username);
		User u=(User)query.getSingleResult();
		return u;
	}

}
