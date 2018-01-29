package com.tim.pojo;

import java.io.Serializable;

public class UserSearchResult implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private Integer id;
	private String username;
	private String lastName;
	private String firstName;
	
	public UserSearchResult() {
		
	}
	
	public UserSearchResult(Integer userId, String username,String firstName,String lastName) {
		this.id = userId;
		this.username = username;
		this.lastName = lastName;
		this.firstName = firstName;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer userId) {
		this.id = userId;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

}
