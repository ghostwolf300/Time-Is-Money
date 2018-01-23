package com.tim.util;

import java.util.List;

public interface JsTreeNode {
	public String getId();
	public String getText();
	public String getIcon();
	public TreeNodeState getState();
	public List<JsTreeNode> getChildren();
}
