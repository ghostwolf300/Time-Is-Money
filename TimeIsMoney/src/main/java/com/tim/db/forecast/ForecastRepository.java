package com.tim.db.forecast;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tim.entities.Forecast;

@Repository
public interface ForecastRepository extends JpaRepository<Forecast, Integer>,ForecastRepositoryCustom {
	
	public Forecast findById(Integer id);
	
}
