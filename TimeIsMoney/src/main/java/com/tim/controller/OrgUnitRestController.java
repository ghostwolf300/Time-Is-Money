package com.tim.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tim.entities.OrgUnit;
import com.tim.service.orgunit.OrgUnitService;
import com.tim.util.JsTreeNode;
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
	public ResponseEntity<List<JsTreeNode>> getOrgTree(){
		System.out.println("OrgUnitRestController");
		JsTreeNode root=orgUnitService.getOrgTree(1);
		List<JsTreeNode> tree=new ArrayList<JsTreeNode>();
		tree.add(root);
		if(root==null) {
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		}
		return new ResponseEntity<List<JsTreeNode>>(tree,HttpStatus.OK);
	}
	
}
