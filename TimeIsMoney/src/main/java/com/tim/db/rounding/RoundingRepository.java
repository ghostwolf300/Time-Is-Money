package com.tim.db.rounding;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tim.entities.RoundingRule;

@Repository
public interface RoundingRepository extends JpaRepository<RoundingRule, Integer>, RoundingRepositoryCustom {
	
	public RoundingRule findById(Integer id);
	
	
}
