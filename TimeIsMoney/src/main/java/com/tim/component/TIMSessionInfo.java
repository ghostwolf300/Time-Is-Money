package com.tim.component;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.WebApplicationContext;

import com.tim.entities.User;
import com.tim.service.user.UserService;

@Component
@Scope(value=WebApplicationContext.SCOPE_SESSION, proxyMode = ScopedProxyMode.TARGET_CLASS)
public class TIMSessionInfo {
	
	private User user;
	
	@Autowired
	private UserService userService;
	
	public TIMSessionInfo() {
		
	}
	
	public User getCurrentUser() {
		if(user==null) {
			user=userService.findByUsername(SecurityContextHolder.getContext().getAuthentication().getName());
		}
		return user;
	}
	
	
}
