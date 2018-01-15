package com.tim.entities;

import java.io.Serializable;
import java.util.List;
import java.util.Set;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;



@Entity
@Table(name="user")
@JsonIdentityInfo(
		generator=ObjectIdGenerators.PropertyGenerator.class,
		property="id"
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
	//@JsonBackReference
	private List<UserPersonal> personalRecords;
	
	@OneToMany(mappedBy="changedBy",cascade=CascadeType.ALL)
	//@JsonBackReference
	private List<UserPersonal> personalRecordsChanged;
	
	@OneToMany(mappedBy="user",cascade=CascadeType.ALL)
	//@JsonBackReference
	private List<UserRole> userRoles;
	
	public User() {
		
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
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

	public List<UserPersonal> getPersonalRecordsChanged() {
		return personalRecordsChanged;
	}

	public void setPersonalRecordsChanged(List<UserPersonal> personalRecordsChanged) {
		this.personalRecordsChanged = personalRecordsChanged;
	}

	public List<UserRole> getUserRoles() {
		return userRoles;
	}

	public void setUserRoles(List<UserRole> userRoles) {
		this.userRoles = userRoles;
	}

	public List<UserPersonal> getPersonalRecords() {
		return personalRecords;
	}

	public void setPersonalRecords(List<UserPersonal> personalRecords) {
		this.personalRecords = personalRecords;
	}
	
	
	
}
