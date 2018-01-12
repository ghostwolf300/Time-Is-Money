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
@Table(name="role")
public class Role implements Serializable {
	
	@Id
	@Column(name="id")
	private int id=-1;
	@Column(name="role_name")
	private String roleName=null;
	
	@OneToMany(mappedBy="role",cascade=CascadeType.ALL)
	private Set<UserRole> userRolesSet;
	
	public Role() {
		
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getRoleName() {
		return roleName;
	}

	public void setRoleName(String roleName) {
		this.roleName = roleName;
	}

	public Set<UserRole> getUserRolesSet() {
		return userRolesSet;
	}

	public void setUserRolesSet(Set<UserRole> userRolesSet) {
		this.userRolesSet = userRolesSet;
	}

}
