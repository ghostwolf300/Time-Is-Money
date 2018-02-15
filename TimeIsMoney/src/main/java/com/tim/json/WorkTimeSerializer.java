package com.tim.json;

import java.io.IOException;
import java.text.SimpleDateFormat;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;
import com.tim.entities.WorkTime;

public class WorkTimeSerializer extends StdSerializer<WorkTime> {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private static final SimpleDateFormat DATE_FORMATTER=new SimpleDateFormat("yyyy-MM-dd HH:mm");

	public WorkTimeSerializer() {
		this(null);
	}
	
	public WorkTimeSerializer(Class<WorkTime> t) {
		super(t);
	}

	@Override
	public void serialize(WorkTime wt, JsonGenerator jgen, SerializerProvider provider) throws JsonProcessingException,IOException {
		
		jgen.writeStartObject();
		jgen.writeNumberField("id", wt.getId());
		jgen.writeNumberField("userId", wt.getUserId());
		jgen.writeFieldName("stampIn");
		if(wt.getStampIn()!=null) {
			jgen.writeNumber(wt.getStampIn().getTime());
		}
		else {
			jgen.writeNull();
		}
		jgen.writeFieldName("stampOut");
		if(wt.getStampOut()!=null) {
			jgen.writeNumber(wt.getStampOut().getTime());
		}
		else {
			jgen.writeNull();
		}
		jgen.writeFieldName("dateIn");
		if(wt.getDateIn()!=null) {
			jgen.writeString(wt.getDateIn().toString());
		}
		else {
			jgen.writeNull();
		}
		jgen.writeFieldName("dateOut");
		if(wt.getDateOut()!=null) {
			jgen.writeString(wt.getDateOut().toString());
		}
		else {
			jgen.writeNull();
		}
		jgen.writeFieldName("roundedInTime");
		if(wt.getRoundedInTime()!=null) {
			jgen.writeString(wt.getRoundedInTime().toString());
		}
		else {
			jgen.writeNull();
		}
		jgen.writeFieldName("roundedOutTime");
		if(wt.getRoundedOutTime()!=null) {
			jgen.writeString(wt.getRoundedOutTime().toString());
		}
		else {
			jgen.writeNull();
		}
		jgen.writeFieldName("changedByText");
		if(wt.getChangedBy()!=null && wt.getChangeTs()!=null) {
			String txt=wt.getChangedBy().getUsername()+": "+DATE_FORMATTER.format(wt.getChangeTs());
			jgen.writeString(txt);
		}
		else {
			jgen.writeNull();
		}
		jgen.writeFieldName("orgUnit");
		if(wt.getOrgUnit()!=null) {
			jgen.writeObject(wt.getOrgUnit());
		}
		else {
			jgen.writeNull();
		}
		jgen.writeEndObject();
		
	}

	
}
