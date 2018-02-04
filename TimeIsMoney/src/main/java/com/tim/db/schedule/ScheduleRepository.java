package com.tim.db.schedule;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.tim.entities.Schedule;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Integer>,ScheduleRepositoryCustom {
	
	public List<Schedule> findByUserIdAndPlanId(int userId,int planId);
	
}
