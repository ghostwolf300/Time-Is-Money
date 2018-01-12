package com.tim.entities;

import java.io.Serializable;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@Table(name="user")
@NamedQuery(
name="User.findCurrentRecord",
query="SELECT u from User u INNER JOIN UserPersonal u.userPersonalSet up where u.username=:username and up.endDate is null"
)
public class User implements Serializable {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@Id
	@Column(name="id",table="user")
	private int id=-1;
	@Column(name="username",table="user")
	private String username=null;
	@Column(name="password",table="user")
	private String password=null;
	@Column(name="enabled",table="user")
	private boolean enabled=false;
	
	@OneToMany(mappedBy="user",cascade=CascadeType.ALL)
	private Set<UserPersonal> userPersonalSet;
	
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

	public Set<UserPersonal> getUserPersonalSet() {
		return userPersonalSet;
	}

	public void setUserPersonalSet(Set<UserPersonal> userPersonalSet) {
		this.userPersonalSet = userPersonalSet;
	}
	
	
	
}
