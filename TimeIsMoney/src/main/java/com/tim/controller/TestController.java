package com.tim.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;


@Controller
public class TestController {
	
	@RequestMapping(value="/test",method = RequestMethod.GET)
	public String test(Model m) {
		System.out.println("adding some text... and sending back");
		String greeting="Hello World!";
		m.addAttribute("a1", greeting);
		return "test";
	}

}
