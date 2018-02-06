package com.tim.entities;

import java.io.Serializable;
import java.sql.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name="forecast_hours")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class ForecastHours implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@Id
	@Column(name="id")
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Integer id;
	@Column(name="forecast_date")
	private Date forecastDate;
	@Column(name="forecast_time")
	private Integer forecastTime;
	@Column(name="hours_needed")
	private Double hoursNeeded;
	
	@ManyToOne
	@JoinColumn(name="forecast_id")
	private Forecast forecast;
	
	
	public ForecastHours() {
		
	}


	public Integer getId() {
		return id;
	}


	public void setId(Integer id) {
		this.id = id;
	}


	public Date getForecastDate() {
		return forecastDate;
	}


	public void setForecastDate(Date forecastDate) {
		this.forecastDate = forecastDate;
	}


	public Integer getForecastTime() {
		return forecastTime;
	}


	public void setForecastTime(Integer forecastTime) {
		this.forecastTime = forecastTime;
	}


	public Double getHoursNeeded() {
		return hoursNeeded;
	}


	public void setHoursNeeded(Double hoursNeeded) {
		this.hoursNeeded = hoursNeeded;
	}


	public Forecast getForecast() {
		return forecast;
	}


	public void setForecast(Forecast forecast) {
		this.forecast = forecast;
	}
	
	

}
