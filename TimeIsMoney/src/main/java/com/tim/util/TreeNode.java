package com.tim.util;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

public class TreeNode<T> implements Iterable<TreeNode<T>>,JsTreeNode,Serializable {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private String id=null;
	private String text=null;
	private String icon=null;
	private TreeNodeState state=null;
	
	protected T data;
	@JsonBackReference
	protected TreeNode<T> parent;
	@JsonManagedReference
	protected List<TreeNode<T>> children;

	protected boolean isRoot() {
		return parent == null;
	}

	protected boolean isLeaf() {
		return children.size() == 0;
	}

	private List<TreeNode<T>> elementsIndex;

	public TreeNode(T data) {
		this.data = data;
		this.children = new LinkedList<TreeNode<T>>();
		this.elementsIndex = new LinkedList<TreeNode<T>>();
		this.elementsIndex.add(this);
		this.state=new TreeNodeState(false,false,false);
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public String getIcon() {
		return icon;
	}

	public void setIcon(String icon) {
		this.icon = icon;
	}

	public TreeNodeState getState() {
		return state;
	}

	public void setState(TreeNodeState state) {
		this.state = state;
	}

	public List<JsTreeNode> getChildren() {
		List<JsTreeNode> jsChildren=new ArrayList<JsTreeNode>(children);
		return jsChildren;
	}

	/*public void setChildren(List<TreeNode<T>> children) {
		this.children = children;
	}*/

	public TreeNode<T> addChild(T child) {
		TreeNode<T> childNode = new TreeNode<T>(child);
		childNode.parent = this;
		this.children.add(childNode);
		this.registerChildForSearch(childNode);
		return childNode;
	}
	
	@JsonIgnore
	public int getLevel() {
		if (this.isRoot())
			return 0;
		else
			return parent.getLevel() + 1;
	}

	private void registerChildForSearch(TreeNode<T> node) {
		elementsIndex.add(node);
		if (parent != null)
			parent.registerChildForSearch(node);
	}

	public TreeNode<T> findTreeNode(Comparable<T> cmp) {
		for (TreeNode<T> element : this.elementsIndex) {
			T elData = element.data;
			if (cmp.compareTo(elData) == 0)
				return element;
		}

		return null;
	}

	@Override
	public String toString() {
		return data != null ? data.toString() : "[data null]";
	}

	@Override
	public Iterator<TreeNode<T>> iterator() {
		TreeNodeIter<T> iter = new TreeNodeIter<T>(this);
		return iter;
	}
	
	@JsonIgnore
	public T getData() {
		return data;
	}

	public void setData(T data) {
		this.data = data;
	}
	

}
