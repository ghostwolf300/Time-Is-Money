package com.tim.entities;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Embeddable;

@Embeddable
public class UserRoleKey implements Serializable {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@Column(name="user_id")
	private int userId;
	@Column(name="role_id")
	private int roleId;
	
	public UserRoleKey() {
		
	}
	
	public UserRoleKey(int userId,int roleId) {
		this.userId=userId;
		this.roleId=roleId;
	}

	public int getUserId() {
		return userId;
	}

	public void setUserId(int userId) {
		this.userId = userId;
	}

}
