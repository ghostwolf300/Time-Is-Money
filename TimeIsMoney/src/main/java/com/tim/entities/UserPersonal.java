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
import javax.persistence.Transient;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerator;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

@Entity
@Table(name="user_personal")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class UserPersonal extends DateEffectiveRecord implements Serializable {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@EmbeddedId
	private UserPersonalKey userPersonalKey;
	@Column(name="end_date")
	private Date endDate;
	@Column(name="first_name")
	private String firstName;
	@Column(name="last_name")
	private String lastName;
	@Column(name="middle_name")
	private String middleName;
	@Column(name="birth_date")
	private Date birthDate;
	@Column(name="phone")
	private String phone;
	@Column(name="email")
	private String email;
	/*@ManyToOne
	@JoinColumn(name="changed_by", nullable=false)
	private User changedBy;*/
	@Column(name="changed_by")
	private int changedBy;
	@Column(name="change_ts")
	private Timestamp changeTs;
	
	@ManyToOne
	@JoinColumn(name="user_id", nullable=false,insertable=false,updatable=false)
	private User user;
	
	public UserPersonal() {
		
	}
	
	public UserPersonal(UserPersonal up) {
		this.userPersonalKey=new UserPersonalKey(up.userPersonalKey);
		if(up.endDate!=null) {
			this.endDate=new Date(up.endDate.getTime());
		}
		this.firstName=new String(up.firstName);
		this.lastName=new String(up.lastName);
		this.middleName=new String(up.middleName);
		if(up.birthDate!=null) {
			this.birthDate=new Date(up.birthDate.getTime());
		}
		this.phone=new String(up.phone);
		this.email=new String(up.email);
		this.changedBy=up.changedBy;
		if(up.changeTs!=null) {
			this.changeTs=new Timestamp(up.changeTs.getTime());
		}
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

	/*public User getChangedBy() {
		return changedBy;
	}

	public void setChangedBy(User changedBy) {
		this.changedBy = changedBy;
	}*/

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

	public int getChangedBy() {
		return changedBy;
	}

	public void setChangedBy(int changedBy) {
		this.changedBy = changedBy;
	}
	
}
