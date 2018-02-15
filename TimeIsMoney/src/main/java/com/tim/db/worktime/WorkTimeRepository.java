package com.tim.db.worktime;

import java.sql.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tim.entities.WorkTime;

@Repository
public interface WorkTimeRepository extends JpaRepository<WorkTime, Integer> {
	public WorkTime findById(int id);
	public List<WorkTime> findByUserIdAndStampInBetween(int userId,Date start,Date end);

}
