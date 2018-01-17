package com.tim.db.orgunit;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tim.entities.OrgUnit;

@Repository
public interface OrgUnitRepository extends JpaRepository<OrgUnit, Integer>, OrgUnitRepositoryCustom {

}
