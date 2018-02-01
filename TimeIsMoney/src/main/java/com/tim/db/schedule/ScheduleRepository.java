package com.tim.db.schedule;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tim.entities.Schedule;

public interface ScheduleRepository extends JpaRepository<Schedule, Integer>,ScheduleRepositoryCustom {
	
	
}
