package com.tim.db.plan;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tim.entities.Plan;

@Repository
public interface PlanRepository extends JpaRepository<Plan, Integer>, PlanRepositoryCustom {

}
