package com.tim.service;

import com.tim.entities.OrgUnit;
import com.tim.util.TreeNode;

public interface OrgUnitService {
	public OrgUnit findOrgUnit(int id);
	public TreeNode<OrgUnit> getOrgTree(int rootId);
}
