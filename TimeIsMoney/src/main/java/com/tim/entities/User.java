package com.tim.entities;

import java.io.Serializable;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@Table(name="user")
public class User implements Serializable {
	
	@Id
	@Column(name="id",table="user")
	private int id=-1;
	@Column(name="username",table="user")
	private String username=null;
	@Column(name="password",table="user")
	private String password=null;
	//Map user_personal...
	@Column(name="first_name",table="user")
	private String firstName=null;
	@Column(name="last_name",table="user")
	private String lastName=null;
	@Column(name="enabled",table="user")
	private boolean enabled=false;
	
	@OneToMany(mappedBy="changedBy",cascade=CascadeType.ALL)
	private Set<UserPersonal> userPersonalChangedSet;
	
	@OneToMany(mappedBy="user",cascade=CascadeType.ALL)
	private Set<UserRole> userRolesSet;
	
	public User() {
		
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
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

	public boolean isEnabled() {
		return enabled;
	}

	public void setEnabled(boolean enabled) {
		this.enabled = enabled;
	}

	public Set<UserPersonal> getUserPersonalChangedSet() {
		return userPersonalChangedSet;
	}

	public void setUserPersonalChangedSet(Set<UserPersonal> userPersonalChangedSet) {
		this.userPersonalChangedSet = userPersonalChangedSet;
	}

	public Set<UserRole> getUserRolesSet() {
		return userRolesSet;
	}

	public void setUserRolesSet(Set<UserRole> userRolesSet) {
		this.userRolesSet = userRolesSet;
	}
	
	
	
}
