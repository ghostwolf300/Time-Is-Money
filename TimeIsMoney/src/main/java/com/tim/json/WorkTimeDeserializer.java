package com.tim.json;

import java.io.IOException;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.tim.entities.WorkTime;

public class WorkTimeDeserializer extends JsonDeserializer<WorkTime> {

	@Override
	public WorkTime deserialize(JsonParser jp, DeserializationContext ctx)
			throws IOException, JsonProcessingException {
		
		return null;
	}

}
