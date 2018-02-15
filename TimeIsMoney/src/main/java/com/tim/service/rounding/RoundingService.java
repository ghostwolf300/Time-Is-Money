package com.tim.service.rounding;

import java.sql.Date;
import java.sql.Time;
import java.sql.Timestamp;

public interface RoundingService {
	
	public static final int DIRECTION_IN=1;
	public static final int DIRECTION_OUT=2;
	
	public Time roundTimestamp(int userId,Timestamp ts,int direction);
	public void applyRoundingRule(int userId,Date startDate,Date endDate);
	
}
