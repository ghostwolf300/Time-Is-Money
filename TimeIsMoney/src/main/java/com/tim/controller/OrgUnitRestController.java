package com.tim.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tim.entities.OrgUnit;
import com.tim.service.OrgUnitService;
import com.tim.util.TreeNode;

@RestController
@RequestMapping("/organisation/")
public class OrgUnitRestController {
	
	@Autowired
	private OrgUnitService orgUnitService;
	
	@RequestMapping("/")
	public ResponseEntity<OrgUnit> getOrgUnit(@RequestParam int id){
		OrgUnit ou=orgUnitService.findOrgUnit(id);
		return new ResponseEntity<OrgUnit>(ou,HttpStatus.OK);
	}
	
	@RequestMapping("/tree")
	public ResponseEntity<TreeNode<OrgUnit>> getOrgTree(){
		TreeNode<OrgUnit> root=orgUnitService.getOrgTree(1);
		if(root==null) {
			new ResponseEntity<>(HttpStatus.NO_CONTENT);
		}
		return new ResponseEntity<TreeNode<OrgUnit>>(root,HttpStatus.OK);
	}
	
}
