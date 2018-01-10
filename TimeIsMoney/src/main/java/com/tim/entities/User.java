package com.tim.entities;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.SecondaryTable;
import javax.persistence.Table;

@Entity
@Table(name="users")
@SecondaryTable(
		name="user_roles",
		pkJoinColumns = @PrimaryKeyJoinColumn(name="username", referencedColumnName="username")
		)
public class User {
	
	@Id
	@Column(name="username",table="users")
	private String userName=null;
	@Column(name="firstname",table="users")
	private String firstName=null;
	@Column(name="lastname",table="users")
	private String lastName=null;
	@Column(name="role",table="user_roles")
	private String role=null;
	@Column(name="user_role_id",table="user_roles")
	private int userRoleId=-1;
	@Column(name="enabled",table="users")
	private boolean enabled=false;
	
	public User() {
		
	}
	
	public String getFirstName() {
		return firstName;
	}
	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}
	public String getLastName() {
		return lastName;
	}
	public void setLastName(String lastName) {
		this.lastName = lastName;
	}
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	public String getUserRole() {
		return role;
	}
	public void setRole(String role) {
		this.role = role;
	}
	public int getUserRoleId() {
		return userRoleId;
	}
	public void setUserRoleId(int userRoleId) {
		this.userRoleId = userRoleId;
	}

	public boolean isEnabled() {
		return enabled;
	}

	public void setEnabled(boolean enabled) {
		this.enabled = enabled;
	}
	
	
}
