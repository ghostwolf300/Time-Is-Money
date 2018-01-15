package com.tim.entities;

import java.io.Serializable;
import java.sql.Date;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name="user_personal")
public class UserPersonal implements Serializable {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@EmbeddedId
	private UserPersonalKey userPersonalKey=null;
	
	@Column(name="end_date")
	private Date endDate=null;
	@Column(name="first_name")
	private String firstName=null;
	@Column(name="last_name")
	private String lastName=null;
	@Column(name="middle_name")
	private String middleName=null;
	@Column(name="birth_date")
	private Date birthDate=null;
	@Column(name="phone")
	private String phone=null;
	@Column(name="email")
	private String email=null;
	@Column(name="change_ts")
	private Timestamp changeTs=null;
	
	@ManyToOne
	@JoinColumn(name="user_id", nullable=false,insertable=false,updatable=false)
	@JsonBackReference
	private User user=null;
	
	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="changed_by", nullable=true)
	@JsonBackReference
	private User changedBy=null;
	
	public UserPersonal() {
		
	}

	public UserPersonalKey getUserPersonalKey() {
		return userPersonalKey;
	}

	public void setUserPersonalKey(UserPersonalKey userPersonalId) {
		this.userPersonalKey = userPersonalId;
	}

	public Date getEndDate() {
		return endDate;
	}

	public void setEndDate(Date endDate) {
		this.endDate = endDate;
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

	public String getMiddleName() {
		return middleName;
	}

	public void setMiddleName(String middleName) {
		this.middleName = middleName;
	}

	public Date getBirthDate() {
		return birthDate;
	}

	public void setBirthDate(Date birthDate) {
		this.birthDate = birthDate;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public User getChangedBy() {
		return changedBy;
	}

	public void setChangedBy(User changedBy) {
		this.changedBy = changedBy;
	}

	public Timestamp getChangeTs() {
		return changeTs;
	}

	public void setChangeTs(Timestamp changeTs) {
		this.changeTs = changeTs;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}
	
}
