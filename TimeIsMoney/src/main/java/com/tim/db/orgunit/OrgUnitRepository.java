package com.tim.db.orgunit;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tim.entities.OrgUnit;

@Repository
public interface OrgUnitRepository extends JpaRepository<OrgUnit, Integer>, OrgUnitRepositoryCustom {
	
	public OrgUnit findById(int id);
	public List<OrgUnit> findByParentId(int parentId);
	
}
