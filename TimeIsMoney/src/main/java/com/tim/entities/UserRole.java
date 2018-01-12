package com.tim.entities;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name="user_role")
public class UserRole implements Serializable {
	@Id
	@Column(name="user_id")
	private int userId=-1;
	@Id
	@Column(name="user_role")
	private int roleId=-1;
	
	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="user_id", nullable=false)
	private User user=null;
	
	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="role_id", nullable=false)
	private Role role=null;
	
	public UserRole() {
		
	}

	public int getUserId() {
		return userId;
	}

	public void setUserId(int userId) {
		this.userId = userId;
	}

	public int getRoleId() {
		return roleId;
	}

	public void setRoleId(int roleId) {
		this.roleId = roleId;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public Role getRole() {
		return role;
	}

	public void setRole(Role role) {
		this.role = role;
	}

}
