package com.tim.service;

import java.util.ArrayList;
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
		System.out.println("root: "+rootUnit.getId());
		TreeNode<OrgUnit> rootNode=null;
		if(rootUnit!=null) {
			rootNode=new TreeNode<OrgUnit>(rootUnit);
			addChildren(rootNode);
		}
		return rootNode;
	}
	
	private List<TreeNode<OrgUnit>> findChildren(TreeNode<OrgUnit> parent){
		
		List<OrgUnit> children=orgUnitRepo.findByParentId(parent.getData().getId());
		List<TreeNode<OrgUnit>> childNodes=null;
		if(children!=null) {
			System.out.println("Children count: "+children.size());
		}
		
		if(children!=null && children.size()>0) {
			childNodes=new ArrayList<TreeNode<OrgUnit>>();
			for(OrgUnit child : children) {
				System.out.println("parent: "+parent.getData().getId()+" adding child: "+child.getId());
				TreeNode<OrgUnit> childNode=parent.addChild(child);
				childNodes.add(childNode);
				return findChildren(childNode);
			}
		}
		return childNodes;
	}
	
	private List<TreeNode<OrgUnit>> addChildren(TreeNode<OrgUnit> parent) {
		List<OrgUnit> children=orgUnitRepo.findByParentId(parent.getData().getId());
		List<TreeNode<OrgUnit>> childNodes=null;
		if(children!=null && children.size()>0) {
			childNodes=new ArrayList<TreeNode<OrgUnit>>();
			for(OrgUnit child : children) {
				System.out.println("parent: "+parent.getData().getId()+" adding child: "+child.getId());
				TreeNode<OrgUnit> childNode=parent.addChild(child);
				childNodes.add(childNode);
				addChildren(childNode);
			}
			return childNodes;
		}
		else {
			return null;
		}
	}

}
