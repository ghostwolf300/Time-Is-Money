package com.tim.service.orgunit;

import com.tim.entities.OrgUnit;
import com.tim.util.JsTreeNode;
import com.tim.util.TreeNode;

public interface OrgUnitService {
	public OrgUnit findOrgUnit(int id);
	public TreeNode<OrgUnit> getOrgTree(int rootId);
	public JsTreeNode getJsOrgTree(int rootId);
}
