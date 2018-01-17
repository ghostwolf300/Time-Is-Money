package com.tim.entities;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.List;
import java.util.Set;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonValue;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;



@Entity
@Table(name="user")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class User implements Serializable {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@Id
	@Column(name="id",table="user")
	private int id;
	@Column(name="username",table="user")
	private String username;
	@Column(name="password",table="user")
	private String password;
	@Column(name="enabled",table="user")
	private boolean enabled;
	@Column(name="changeTs")
	private Timestamp changeTs;
	
	@ManyToOne
	@JoinColumn(name="changed_by", nullable=false)
	@JsonManagedReference
	private User changedBy;
	
	@OneToMany(mappedBy="changedBy")
	@JsonBackReference
	private List<User> userRecordsChanged;
	
	/*@OneToMany(mappedBy="user",cascade=CascadeType.ALL)
	@JsonBackReference
	private List<UserPersonal> personalRecords;
	
	@OneToMany(mappedBy="changedBy",cascade=CascadeType.ALL)
	@JsonBackReference
	private List<UserPersonal> personalRecordsChanged;
	
	@OneToMany(mappedBy="user",cascade=CascadeType.ALL)
	@JsonBackReference
	private List<UserRole> userRoles;*/
	
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

	/*public List<UserPersonal> getPersonalRecordsChanged() {
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
	}*/

	public Timestamp getChangeTs() {
		return changeTs;
	}

	public void setChangeTs(Timestamp changeTs) {
		this.changeTs = changeTs;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public User getChangedBy() {
		return changedBy;
	}

	public void setChangedBy(User changedBy) {
		this.changedBy = changedBy;
	}

	public List<User> getUserRecordsChanged() {
		return userRecordsChanged;
	}

	public void setUserRecordsChanged(List<User> userRecordsChanged) {
		this.userRecordsChanged = userRecordsChanged;
	}
	
	
	
}
