package com.tim.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tim.db.orgunit.OrgUnitRepository;
import com.tim.entities.OrgUnit;
import com.tim.util.TreeNode;

@Service("orgUnitService")
public class OrgUnitServiceImpl implements OrgUnitService {
	
	@Autowired
	private OrgUnitRepository orgUnitRepo;
	
	@Override
	public OrgUnit findOrgUnit(int id) {
		return orgUnitRepo.findById(id);
	}

	@Override
	public TreeNode<OrgUnit> getOrgTree(int rootId) {
		OrgUnit rootUnit=orgUnitRepo.findById(rootId);
		TreeNode<OrgUnit> rootNode=null;
		if(rootUnit!=null) {
			rootNode=new TreeNode<OrgUnit>(rootUnit);
			findChildren(rootNode);
		}
		System.out.println(rootNode.children.size());
		return rootNode;
	}
	
	private List<TreeNode<OrgUnit>> findChildren(TreeNode<OrgUnit> parent){
		List<OrgUnit> children=orgUnitRepo.findByParentId(parent.getData().getParent().getId());
		if(children!=null && children.size()>0) {
			for(OrgUnit child : children) {
				TreeNode<OrgUnit> childNode=parent.addChild(child);
				return findChildren(childNode);
			}
		}
		return null;
	}

}
