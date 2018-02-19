/**
 * 
 */

var csrf_header=$('meta[name="_csrf_header"]').attr('content');
var csrf_token=$('meta[name="_csrf"]').attr('content');

$(document).ready(initPage);

function initPage(){
	console.log('initializing page...'+$('meta[name="viewId"]').attr('content'));
	var view=$('meta[name="viewId"]').attr('content');
	globalSetup();
	if(view=='USER_RECORD'){
		UserSearch.init();
		UserRecord.init();
	}
	else if(view=='SHEDULE_PLANNER'){
		ScheduleEditor.init();
	}
	else if(view=='MANAGER_VIEW'){
		ManagerView.init();
	}
}

function globalSetup(){
	$.ajaxSetup({
        headers:
        { 
        	'X-CSRF-TOKEN': csrf_token,
        	'Accept': 'application/json',
	        'Content-Type': 'application/json'
        }
    });
}

var Util=(function(){
	
	function getWeekday(date){
		var n=date.getDay();
		var day;
		switch(n){
			case 0:
				day='Sun';
				break;
			case 1:
				day='Mon';
				break;
			case 2:
				day='Tue';
				break;
			case 3:
				day='Wed';
				break;
			case 4:
				day='Thu';
				break;
			case 5:
				day='Fri';
				break;
			case 6:
				day='Sat';
				break;
				
		}
		return day;
	}
	
	function getFormattedDate(date){
		var formattedDate=$.format.date(date,'yyyy-MM-dd');
		return formattedDate;
	}
	
	function getTimeSQL(time){
		var hours=time.split(':')[0];
		var minutes=time.split(':')[1];
		var formattedTime=hours+':'+minutes+':00';
		return formattedTime;
	}
	
	function getTimeHHmm(time){
		var hours=time.split(':')[0];
		var minutes=time.split(':')[1];
		var formattedTime=hours+':'+minutes;
		return formattedTime;
	}
	
	function getTimeFromDate(date){
		var hours='00'+date.getHours();
		hours=hours.substring(hours.length-2);
		var minutes='00'+date.getMinutes();
		minutes=minutes.substring(minutes.length-2);
		var time=hours+':'+minutes;
		return time;
	}
	
	function getTimestamp(date,time){
		var timeArr=time.split(':');
		var hours=parseInt(timeArr[0]);
		var minutes=parseInt(timeArr[1]);
		var year=date.getFullYear();
		var month=date.getMonth();
		var day=date.getDate();
		var dateTime=new Date(year,month,day,hours,minutes);
		return dateTime.getTime();
	}
	
	function getFormattedDateTime(date){
		var dateTime=$.format.date(date,'yyyy-MM-dd HH:mm');
		return dateTime;
	}
	
	function getLastWeek(){
		var s=new Date();
		var e=new Date();
		var day=s.getDay();
		var offset=-day-6;
		s.setDate(s.getDate()+offset);
		e.setDate(e.getDate()+offset+6);
		var period={
				start : getFormattedDate(s),
				end : getFormattedDate(e)
		}
		return period;
	}
	
	function getCurrentWeek(){
		var s=new Date();
		var e=new Date();
		var day=s.getDay();
		var offset=-day+1;
		s.setDate(s.getDate()+offset);
		e.setDate(e.getDate()+offset+6);
		var period={
				start : getFormattedDate(s),
				end : getFormattedDate(e)
		}
		return period;
	}
	
	function getCurrentPYPeriod(){
		var date=new Date();
		var s=new Date(date.getFullYear(),date.getMonth(),1);
		var e=new Date(date.getFullYear(),date.getMonth()+1,1);
		var period={
				start : getFormattedDate(s),
				end : getFormattedDate(e)
		}
		return period;
	}
	
	function getPreviousPYPeriod(){
		var date=new Date();
		var s=new Date(date.getFullYear(),date.getMonth()-1,1);
		var e=new Date(date.getFullYear(),date.getMonth(),1);
		var period={
				start : getFormattedDate(s),
				end : getFormattedDate(e)
		}
		return period;
	}
	
	function _checkTime(i) {
        return (i < 10) ? "0" + i : i;
    }
	
	return{
		getWeekday : getWeekday,
		getFormattedDate : getFormattedDate,
		getTimeSQL : getTimeSQL,
		getTimeHHmm : getTimeHHmm,
		getTimeFromDate : getTimeFromDate,
		getLastWeek : getLastWeek,
		getCurrentWeek : getCurrentWeek,
		getPreviousPYPeriod : getPreviousPYPeriod,
		getCurrentPYPeriod : getCurrentPYPeriod,
		getTimestamp : getTimestamp,
		getFormattedDateTime : getFormattedDateTime
	}
	
})();

var UserSearch=(function(){
	
	var divs={
			searchResults : "#userrecord-search-results"
	}
	
	var fields={
		searchText : '#userrecord-search-text',
		active : '#userrecord-search-activeonly',
		keyDate : '#userrecord-search-keydate',
		searchResults : '#userrecord-search-results-tbody'
	}
	
	var controls={
		searchDo : '#userrecord-search-do-button'
	}
	
	var selected;
	
	function init(){
		_bindEventHandlers();
		_setDefaultValues();
	}
	
	function _bindEventHandlers(){
		$(controls.searchDo).click(findAll);
		$(fields.searchResults).click(_showUser);
	}
	
	function _setDefaultValues(){
		var currentDate=$.format.date(new Date($.now()),'yyyy-MM-dd')
		$(fields.keyDate).val(currentDate);
	}
	
	function _showResults(users){
		var trHtml='';
		$(fields.searchResults).empty();
		$.each(users, function(i,u){
			trHtml+='<tr>\
			<td id="user_id">'+u.id+'</td>\
			<td id="username">'+u.username+'</td>\
			<td id="name">'+u.lastName+', '+u.firstName+'</td>\
			</tr>'
		});
		$(fields.searchResults).append(trHtml);
		$(divs.searchResults).show();
	}
	
	function _showUser(event){
		var tr=event.target.parentNode;
		selected=$(tr).find('#user_id').text();
		var keyDate=$(fields.keyDate).val();
		
		if(keyDate==null){
			keyDate=new Date();
		}
		
		UserRecord.show(selected,keyDate)
		
	}
	
	function findAll(){
		DAO.findAllUsers(function(status,users){
			if(status==DAO.STATUS.DONE){
				console.log(users);
				_showResults(users);
			}
		});
		
	}
	
	function removeSelected(){
		
		$(fields.searchResults+' tr').each(function(){
			console.log(selected);
			if($(this).find('#user_id').text()==selected){
				console.log('removing '+selected);
				$(this).remove();
			}
		});
		
	}
	
	return{
		init : init,
		findAll : findAll,
		removeSelected : removeSelected
	} 
	
})();

var UserRecord = (function(){
	
	var divs={
		record : '#userrecord',
		selected : '#userrecord-selected',
		data : {
			personal : '#userrecord-personal',
			contract : '#userrecord-contract',
			assignment : '#userrecord-assignment',
			credentials : '#userrecord-credentials'
		}
		
	}
	
	var fields={
		selected : '#userrecord-selected-text'
	}
	
	var controls={
		newUser : '#userrecord-new-button',
		copy : '#userrecord-copy-button',
		inactivate : '#userrecord-inactivate-button',
		del : '#userrecord-delete-button'
	}
	
	var userId;
	
	
	function test(){
		DAO.test();
	}
	
	function init(){
		
		_bindEventHandlers();
		
		Personal.init();
		Contract.init();
		Assignment.init();
		Credentials.init();
		
	}
	
	function _bindEventHandlers(){
		
		$(controls.inactivate).on('click',inactivate);
		$(controls.copy).on('click',copy);
		$(controls.newUser).on('click',newUser);
		$(controls.del).on('click',del);
	}
	
	function show(uid,keyDate){
		
		userId=uid;
		
		Credentials.show(userId);
		Personal.showOnKeyDate(userId,keyDate);
		Contract.showOnKeyDate(userId,keyDate);
		Assignment.showOnKeyDate(userId,keyDate);
		
		$(divs.record).show();
		$(fields.selected).empty();
		$(fields.selected).append('ID: '+userId);
		$(divs.selected).show();
		
		for(var view in divs.data){
			$(divs.data[view]).show();
		}
	}
	
	function inactivate(){
		console.log('inactivate user: '+userId);
	}
	
	function copy(){
		console.log('copy user: '+userId);
	}
	
	function newUser(){
		userId=null;
		console.log('new user');
		
		$(fields.selected).text('New');
		
		Credentials.newUser();
		$(divs.record).show();
		$(divs.data.credentials).show();
		$(divs.data.personal).hide();
		$(divs.data.contract).hide();
		$(divs.data.assignment).hide();
	}
	
	function userCreated(uid){
		userId=uid;
		Personal.newUser(userId);
		Contract.newUser(userId);
		Assignment.newUser(userId);
		$(divs.data.personal).show();
		$(divs.data.contract).show();
		$(divs.data.assignment).show();
		$(fields.selected).text('ID: '+userId);
		
	}
	
	function del(){
		
		$(fields.selected).text('ID: Removed');
		$(divs.record).hide();
		
		console.log('delete user: '+userId);
		DAO.delUser(userId,function(flag){
			console.log(flag);
		});
		
		userId=null;
		UserSearch.removeSelected();
	
	}
	
	return{
		test : test,
		init : init,
		show : show,
		del : del,
		userCreated : userCreated
	}
	
})();

var DAO = (function() {
	
	var STATUS={
		DONE : 'done',
		NA : 'na',
		UNKNOWN : 'unknown',
		FAIL : 'fail'
	}
	
	var NEW_ID=-10;
	
	function test(){
		var text='DAO : this is a test!';
		console.log(text);
	}
	
	function loadCredentials(userId,_callback){
		
		var url='/userrecord/show/'+userId+'/credentialsdetails';
		var credentials;
		
		$.getJSON(url,function(user,statusText,jqxhr){

		}).done(function(user,statusText,jqxhr){
			if(jqxhr.status==200){
				credentials=user;
				_callback(STATUS.DONE,credentials);
			}
			else if(jqxhr.status==204){
				_callback(STATUS.NA);
			}
			else{
				_callback(STATUS.UNKNOWN);
			}
		}).fail(function(){
			_callback(STATUS.FAIL);
		}).always(function(){

		});
	}
	
	function saveCredentials(userId,cred,_callback){
		
		var url;
		
		if(userId!=NEW_ID){
			console.log('saving old user...');
			url='/userrecord/show/credentialsdetails/save?userId='+userId;
		}
		else{
			console.log('saving new user...');
			url='/userrecord/show/credentialsdetails/save';
		}
		
		data=JSON.stringify(cred);
		
		$.ajax({
			url : url,
			method : "POST",
			data : data,
			dataType : "json"
		}).success(function(cred){
			
		}).done(function(cred){
			console.log(cred);
			_callback(STATUS.DONE,cred);

		}).fail(function(){
			alert("ERROR: Couldn't save credentials details.");
			_callback(STATUS.FAIL);
		}).always(function(){
			
		});
	}
	
	function delUser(userId,_callback){
		var url='/userrecord/delete?userId='+userId;
		
		$.ajax({
			url : url,
			method : "POST",
		}).success(function(flag){
			
		}).done(function(flag){
			console.log(flag);
			_callback(STATUS.DONE);

		}).fail(function(){
			alert("ERROR: Couldn't delete user "+userId);
			_callback(STATUS.FAIL);
		}).always(function(){
			
		});
		
	}
	
	function loadRoles(userId,_callback){
		
		var url='/userrecord/show/'+userId+'/roledetails';
		var roles;
		
		$.getJSON(url,function(roles){
			//console.log(roles);
		}).done(function(roles,statusText,jqxhr){
			console.log(roles);
			if(jqxhr.status==200){
				this.roles=roles;
				_callback(STATUS.DONE,this.roles);
			}
			else if(jqxhr.status==204){
				_callback(STATUS.NA);
			}
			else{
				_callback(STATUS.UNKNOWN);
			}
		}).fail(function(){
			_callback(STATUS.FAIL);
		}).always(function(){
			
		});
	}
	
	function saveRoles(userId,roles,_callback){
		
		var url;
		
		url='/userrecord/show/roledetails/save?userId='+userId;
		
		data=JSON.stringify(roles);
		
		$.ajax({
			url : url,
			method : "POST",
			data : data,
			dataType : "json"
		}).success(function(ur){
			
		}).done(function(ur){
			_callback(STATUS.DONE,ur);
		}).fail(function(){
			alert("ERROR: Couldn't save role details.");
			_callback(STATUS.FAIL);
		}).always(function(){
			
		});
	}
	
	function loadPersonal(userId,keyDate,_callback){
		
		var url='/userrecord/show/'+userId+'/personaldetails/?keyDate='+keyDate;
		var personal;
		
		$.getJSON(url,function(ud,statusText,jqxhr){
			
		}).done(function(ud,statusText,jqxhr){
			if(jqxhr.status==200){
				personal=ud;
				_callback(STATUS.DONE,personal);
			}
			else if(jqxhr.status==204){
				_callback(STATUS.NA);
			}
			else{
				_callback(STATUS.UNKNOWN);
			}
		}).fail(function(jqxhr, textStatus, error){
			_callback(STATUS.FAIL);
		}).always(function(){
			
		});
	}
	
	function loadNextPersonal(userId,keyDate,_callback){
		
		var url='/userrecord/show/'+userId+'/personaldetails/next?keyDate='+keyDate;
		var personal;
		
		$.getJSON(url,function(ud,statusText,jqxhr){
			
		}).done(function(ud,statusText,jqxhr){
			if(jqxhr.status==200){
				personal=ud;
				_callback(STATUS.DONE,personal);
			}
			else if(jqxhr.status==204){
				_callback(STATUS.NA);
			}
			else{
				_callback(STATUS.UNKNOWN);
			}
			
		}).fail(function(){
			_callback(STATUS.FAIL);
		}).always(function(){
			
		});
	}
	
	function loadPrevPersonal(userId,keyDate,_callback){
		
		var url='/userrecord/show/'+userId+'/personaldetails/prev?keyDate='+keyDate;
		var personal;
		
		$.getJSON(url,function(ud,statusText,jqxhr){
			
		}).done(function(ud,statusText,jqxhr){
			if(jqxhr.status==200){
				personal=ud;
				_callback(STATUS.DONE,personal);
			}
			else if(jqxhr.status==204){
				_callback(STATUS.NA);
			}
			else{
				_callback(STATUS.UNKNOWN);
			}
			
		}).fail(function(){
			_callback(STATUS.FAIL);
		}).always(function(){
			
		});
	}
	
	function savePersonal(userId,pd,_callback){
		
		var url='/userrecord/show/'+userId+'/personaldetails/save';
		
		data=JSON.stringify(pd);
		
		$.ajax({
			url : url,
			method : "POST",
			data : data,
			dataType : "json"
		}).done(function(pers){
			_callback(STATUS.DONE,pers);
		}).fail(function(){
			//alert("ERROR: Couldn't save personal details.");
			_callback(STATUS.FAIL);
		}).always(function(){
			
		});
	} 
	
	function loadContract(userId,keyDate,_callback){
		
		var url='/userrecord/show/'+userId+'/contractdetails/?keyDate='+keyDate;
		var contract;
		
		$.getJSON(url,function(ctrc,statusText,jqxhr){
			
		}).done(function(ctrc,statusText,jqxhr){
			if(jqxhr.status==200){
				contract=ctrc;
				_callback(STATUS.DONE,contract);
			}
			else if(jqxhr.status==204){
				_callback(STATUS.NA);
			}
			else{
				_callback(STATUS.UNKNOWN);
			}
		}).fail(function(jqxhr, textStatus, error){
			_callback(STATUS.FAIL);
		}).always(function(){
			
		});
	}
	
	function loadNextContract(userId,keyDate,_callback){
		
		var url='/userrecord/show/'+userId+'/contractdetails/next?keyDate='+keyDate;
		var contract;
		
		$.getJSON(url,function(ctrc,statusText,jqxhr){
			
		}).done(function(ctrc,statusText,jqxhr){
			if(jqxhr.status==200){
				contract=ctrc;
				_callback(STATUS.DONE,contract);
			}
			else if(jqxhr.status==204){
				_callback(STATUS.NA);
			}
			else{
				_callback(STATUS.UNKNOWN);
			}
		}).fail(function(){
			_callback(STATUS.FAIL);
		}).always(function(){
			
		});
	}
	
	function loadPrevContract(userId,keyDate,_callback){
		
		var url='/userrecord/show/'+userId+'/contractdetails/prev?keyDate='+keyDate;
		var contract;
		
		$.getJSON(url,function(ctrc,statusText,jqxhr){
			
		}).done(function(ctrc,statusText,jqxhr){
			if(jqxhr.status==200){
				contract=ctrc;
				_callback(STATUS.DONE,contract);
			}
			else if(jqxhr.status==204){
				_callback(STATUS.NA);
			}
			else{
				_callback(STATUS.UNKNOWN);
			}
		}).fail(function(){
			_callback(STATUS.FAIL);
		}).always(function(){
			
		});	
	}
	
	function saveContract(userId,contract,_callback){
		
		var url='/userrecord/show/'+userId+'/contractdetails/save';
		
		data=JSON.stringify(contract);
		
		$.ajax({
			url : url,
			method : "POST",
			data : data,
			dataType : "json"
		}).done(function(ctrc){
			_callback(STATUS.DONE,ctrc);
		}).fail(function(){
			alert("ERROR: Couldn't save contract details.");
			_callback(STATUS.FAIL);
		}).always(function(){
			
		});
	}
	
	function loadOrgTree(_callback){
		
		var tree=null;
		var url='/organisation/tree'

		$.getJSON(url,function(tree,statusText,jqxhr){

		}).done(function(tree,statusText,jqxhr){
			if(jqxhr.status==200){
				_callback(STATUS.DONE,tree);
			}
			else if(jqxhr.status==204){
				_callback(STATUS.NA)
			}
		}).fail(function(){
			_callback(STATUS.FAIL);
		});
	}
	
	function loadOrgUnit(id,_callback){
		
		var url='/organisation/?id='+id;
		var orgUnit;
		
		$.getJSON(url,function(ou,statusText,jqxhr){
			
		}).done(function(ou,statusText,jqxhr){
			if(jqxhr.status==200){
				orgUnit=ou;
				_callback(STATUS.DONE,orgUnit);
			}
			else if(jqxhr.status==204){
				_callback(STATUS.NA);
			}
			else{
				_callback(STATUS.UNKNOWN);
			}
		}).fail(function(jqxhr,statusText,error){
			_callback(STATUS.FAIL);
		});
	}
	
	function loadAssignment(userId,keyDate,_callback){
		
		var url='/userrecord/show/'+userId+'/assignmentdetails/?keyDate='+keyDate;
		var assignment;
		
		$.getJSON(url,function(asgn,statusText,jqxhr){
			
		}).done(function(asgn,statusText,jqxhr){
			if(jqxhr.status==200){
				assignment=asgn;
				_callback(STATUS.DONE,assignment);
			}
			else if(jqxhr.status==204){
				_callback(STATUS.NA);
			}
			else{
				_callback(STATUS.UNKNOWN);
			}
		}).fail(function(jqxhr, textStatus, error){
			_callback(STATUS.FAIL);
		}).always(function(){
			
		});
	}
	
	function loadNextAssignment(userId,keyDate,_callback){
		
		var url='/userrecord/show/'+userId+'/assignmentdetails/next?keyDate='+keyDate;
		var assignment;
		
		$.getJSON(url,function(asgn,statusText,jqxhr){
			
		}).done(function(asgn,statusText,jqxhr){
			if(jqxhr.status==200){
				assignment=asgn;
				_callback(STATUS.DONE,assignment);
			}
			else if(jqxhr.status==204){
				_callback(STATUS.NA);
			}
			else{
				_callback(STATUS.UNKNOWN);
			}
		}).fail(function(){
			_callback(STATUS.FAIL);
		}).always(function(){
			
		});
	}
	
	function loadPrevAssignment(userId,keyDate,_callback){
		
		var url='/userrecord/show/'+userId+'/assignmentdetails/prev?keyDate='+keyDate;
		var assignment;
		
		$.getJSON(url,function(asgn,statusText,jqxhr){
			
		}).done(function(asgn,statusText,jqxhr){
			if(jqxhr.status==200){
				assignment=asgn;
				_callback(STATUS.DONE,assignment);
			}
			else if(jqxhr.status==204){
				_callback(STATUS.NA);
			}
			else{
				_callback(STATUS.UNKNOWN);
			}
		}).fail(function(){
			_callback(STATUS.FAIL);
		}).always(function(){
			
		});	
	}
	
	function saveAssignment(userId,assignment,_callback){
		
		var url='/userrecord/show/'+userId+'/assignmentdetails/save';
		
		data=JSON.stringify(assignment);
		
		$.ajax({
			url : url,
			method : "POST",
			data : data,
			dataType : "json"
		}).done(function(asgn){
			_callback(STATUS.DONE,asgn);
		}).fail(function(){
			alert("ERROR: Couldn't save assignment details.");
			_callback(STATUS.FAIL);
		}).always(function(){
			
		});
	}
	
	function findAllUsers(_callback){
		
		var url='/userrecord/search/';
		var users;
		
		$.getJSON(url,function(u,statusText,jqxhr){
			
		}).done(function(u,statusText,jqxhr){
			if(jqxhr.status==200){
				users=u;
				_callback(STATUS.DONE,users);
			}
			else if(jqxhr.status==204){
				_callback(STATUS.NA);
			}
			else{
				_callback(STATUS.UNKNOWN);
			}
		}).fail(function(){
			_callback(STATUS.FAIL);
		}).always(function(){
			
		});
	}
	
	function loadSchedules(userId,planId,orgUnitId,_callback){
		var url='/schedules/find?userId='+userId+'&planId='+planId+'&orgUnitId='+orgUnitId;
		var schedules;
		
		$.getJSON(url,function(s,statusText,jqxhr){
			
		}).done(function(s,statusText,jqxhr){
			schedules=s;
			_callback(STATUS.DONE,schedules);
		}).fail(function(){
			_callback(STATUS.FAIL);
		}).always(function(){
			
		});
	}
	
	function loadActiveSchedules(userId,startDate,endDate,_callback){
		var url='/schedules/findActive?userId='+userId+'&startDate='+startDate+'&endDate='+endDate;
		var schedules;
		
		$.getJSON(url,function(s,statusText,jqxhr){
			
		}).done(function(s,statusText,jqxhr){
			schedules=s;
			_callback(STATUS.DONE,schedules);
		}).fail(function(){
			_callback(STATUS.FAIL);
		}).always(function(){
			
		});
	}
	
	function deleteSchedule(id,_callback){
		
		var url='/schedules/delete?id='+id;
		
		$.ajax({
			url : url,
			method : "POST",
		}).success(function(flag){
			
		}).done(function(flag){
			_callback(STATUS.DONE);

		}).fail(function(){
			_callback(STATUS.FAIL);
		}).always(function(){
			
		});
	}
	
	function saveSchedule(userId,schedule,_callback){
		var url='/schedules/save?userId='+userId;
		
		console.log(schedule);
		
		data=JSON.stringify(schedule);
		
		$.ajax({
			url : url,
			method : "POST",
			data : data,
			dataType : "json"
		}).done(function(schd){
			_callback(STATUS.DONE,schd);
		}).fail(function(){
			alert("ERROR: Couldn't save schedule!");
			_callback(STATUS.FAIL);
		}).always(function(){
			
		});
	}
	
	function saveSchedules(userId,schedules,_callback){
		
	}
	
	function saveWorkTime(workTime,tr,_callback){
		var url='/worktimes/save';
		
		console.log(workTime);
		
		data=JSON.stringify(workTime);
		
		$.ajax({
			url : url,
			method : "POST",
			data : data,
			dataType : "json"
		}).done(function(wt){
			_callback(STATUS.DONE,wt,tr);
		}).fail(function(){
			alert("ERROR: Couldn't save work time!");
			_callback(STATUS.FAIL);
		}).always(function(){
			
		});
	}
	
	function loadActivePlan(orgUnitId,keyDate,_callback){
		
		var url='/plans/active?orgUnitId='+orgUnitId+'&keyDate='+keyDate;
		var plan;
		
		$.getJSON(url,function(p,statusText,jqxhr){
			
		}).done(function(p,statusText,jqxhr){
			if(jqxhr.status==200){
				plan=p;
				_callback(STATUS.DONE,plan);
			}
			else if(jqxhr.status==204){
				_callback(STATUS.NA);
			}
		}).fail(function(){
			_callback(STATUS.FAIL);
		}).always(function(){
			
		});
	}
	
	function loadPlan(planId,_callback){
		var url='/plans/find?planId='+planId;
		var plan;
		
		$.getJSON(url,function(p,statusText,jqxhr){
			
		}).done(function(p,statusText,jqxhr){
			if(jqxhr.status==200){
				plan=p;
				_callback(STATUS.DONE,plan);
			}
			else if(jqxhr.status==204){
				_callback(STATUS.NA);
			}
		}).fail(function(){
			_callback(STATUS.FAIL);
		}).always(function(){
			
		});
	}
	
	function loadAssignedEmployees(orgUnitId,startDate,endDate,_callback){
		var url='/userrecord/assignments?orgUnitId='+orgUnitId+'&startDate='+startDate+'&endDate='+endDate;
		var employees;
		
		$.getJSON(url,function(el,statusText,jqxhr){
			
		}).done(function(el,statusText,jqxhr){
			if(jqxhr.status==200){
				employees=el;
				_callback(STATUS.DONE,employees);
			}
			else if(jqxhr.status==204){
				_callback(STATUS.NA);
			}
		}).fail(function(){
			_callback(STATUS.FAIL);
		}).always(function(){
			
		});
	}
	
	function loadEmployeesAssignedTo(orgUnitId,keyDate,_callback){
		var url='/userrecord/assignedto?orgUnitId='+orgUnitId+'&keyDate='+keyDate;
		var employees;
		
		$.getJSON(url,function(el,statusText,jqxhr){
			
		}).done(function(el,statusText,jqxhr){
			if(jqxhr.status==200){
				employees=el;
				_callback(STATUS.DONE,employees);
			}
			else if(jqxhr.status==204){
				_callback(STATUS.NA);
			}
		}).fail(function(){
			_callback(STATUS.FAIL);
		}).always(function(){
			
		});
	}
	
	function loadWorkTimes(userId,startDate,endDate,_callback){
		var url='/worktimes/show?userId='+userId+'&startDate='+startDate+'&endDate='+endDate;
		var worktimes;
		
		$.getJSON(url,function(wts,statusText,jqxhr){
			
		}).done(function(wts,statusText,jqxhr){
			if(jqxhr.status==200){
				worktimes=wts;
				_callback(STATUS.DONE,worktimes);
			}
			else if(jqxhr.status==204){
				_callback(STATUS.NA);
			}
		}).fail(function(){
			_callback(STATUS.FAIL);
		}).always(function(){
			
		});
	}
	
	function loadWorkTimeTest(_callback){
		var url='/worktimes/test';
		var worktime;
		
		$.getJSON(url,function(wt,statusText,jqxhr){
			
		}).done(function(wt,statusText,jqxhr){
			if(jqxhr.status==200){
				worktime=wt;
				_callback(STATUS.DONE,worktime);
			}
			else if(jqxhr.status==204){
				_callback(STATUS.NA);
			}
		}).fail(function(){
			_callback(STATUS.FAIL);
		}).always(function(){
			
		});
	}
	
	return{
		STATUS : STATUS,
		NEW_ID : NEW_ID,
		test : test,
		findAllUsers : findAllUsers,
		delUser : delUser,
		loadOrgTree : loadOrgTree,
		loadOrgUnit : loadOrgUnit,
		loadCredentials : loadCredentials,
		saveCredentials : saveCredentials,
		loadRoles : loadRoles,
		saveRoles : saveRoles,
		loadPersonal : loadPersonal,
		loadNextPersonal : loadNextPersonal,
		loadPrevPersonal : loadPrevPersonal,
		savePersonal : savePersonal,
		loadContract : loadContract,
		loadNextContract : loadNextContract,
		loadPrevContract : loadPrevContract,
		saveContract : saveContract,
		loadAssignment : loadAssignment,
		loadNextAssignment : loadNextAssignment,
		loadPrevAssignment : loadPrevAssignment,
		saveAssignment : saveAssignment,
		loadSchedules : loadSchedules,
		loadActiveSchedules : loadActiveSchedules,
		saveSchedule : saveSchedule,
		saveSchedules : saveSchedules,
		deleteSchedule : deleteSchedule,
		loadActivePlan : loadActivePlan,
		loadPlan : loadPlan,
		loadAssignedEmployees : loadAssignedEmployees,
		loadEmployeesAssignedTo : loadEmployeesAssignedTo,
		loadWorkTimes : loadWorkTimes,
		saveWorkTime : saveWorkTime,
		loadWorkTimeTest : loadWorkTimeTest
	}
	
})();

var Personal=(function(){
	
	var userId;
	
	var divs={
			content : '#userrecord-personal-content',
			na : '#userrecord-personal-na'
	}
	
	var fields={
			startDate : '#personalStartDate',
			endDate : '#personalEndDate',
			firstName : '#firstName',
			middleName : '#middleName',
			lastName : '#lastName',
			birthDate : '#birthDate',
			phone : '#phone',
			email : '#email',
			changedBy : '#personalChangedBy',
			changeTs : '#personalChangedTs',
			counter : '#userrecord-personal-counter',
			isChanged : '#userrecord-personal-isChanged'
	}
	
	var controls={
			prev : '#userrecord-personal-prev-button',
			next : '#userrecord-personal-next-button',
			copy : '#userrecord-personal-copy-button',
			newRec : '#userrecord-personal-new-button',
			newRecNA : '#userrecord-personal-na-new-button',
			del : '#userrecord-personal-del-button',
			save : '#userrecord-personal-save-button'	
	}
	
	var STATUS={
			FIRST : 'first',
			LAST : 'last',
			NORMAL : 'normal',
			NEW : 'new'
	}
	
	var currentStatus;
	var changed=false;
	
	function init(){
		console.log('Initializing Module Personal...')
		_bindEventHandlers();
	}
	
	function _bindEventHandlers(){
		$(controls.save).on('click',save);
		$(controls.next).on('click',next);
		$(controls.prev).on('click',prev);
		$(controls.copy).on('click',copy);
		$(controls.newRec).on('click',newRec);
		$(controls.newRecNA).on('click',newRec);
		$(controls.del).on('click',del);
		
		$(fields.startDate).keyup(_changeHandler);
		$(fields.endDate).keyup(_changeHandler);
		$(fields.firstName).keyup(_changeHandler);
		$(fields.middleName).keyup(_changeHandler);
		$(fields.lastName).keyup(_changeHandler);
		$(fields.phone).keyup(_changeHandler);
		$(fields.email).keyup(_changeHandler);
		
	}
	
	function _changeHandler(){
		changed=true;
		$(fields.isChanged).text('save changes');
	}
	
	function isChanged(){
		return changed;
	}
	
	function _clear(){
		$(fields.startDate).val(null);
		$(fields.endDate).val(null);
		$(fields.firstName).val(null);
		$(fields.middleName).val(null);
		$(fields.lastName).val(null);
		$(fields.birthDate).val(null);
		$(fields.phone).val(null);
		$(fields.email).val(null);
		
		$(fields.changeTs).empty();
		$(fields.changedBy).empty();
		$(fields.counter).empty();
		$(fields.isChanged).empty();
	}
	
	function _fill(p){
		
		$(divs.content).show();
		$(divs.na).hide();
		
		$(fields.startDate).val(p.key.startDate);
		$(fields.endDate).val(p.endDate);
		$(fields.firstName).val(p.firstName);
		$(fields.middleName).val(p.middleName);
		$(fields.lastName).val(p.lastName);
		$(fields.birthDate).val(p.birthDate);
		$(fields.phone).val(p.phone);
		$(fields.email).val(p.email);
		var ts=$.format.date(new Date(p.changeTs),'dd.MM.yyyy hh:mm');
		$(fields.changeTs).text(ts);
		$(fields.counter).text(p.currentRecord+'/'+p.totalRecords);
		
		_addUsernameToElement(p.key.userId,fields.changedBy);
		
		$(controls.next).prop('disabled',false);
		$(controls.prev).prop('disabled',false);

		if(p.currentRecord==p.totalRecords && p.totalRecords==1){
			$(controls.next).prop('disabled',true);
			$(controls.prev).prop('disabled',true);
		}
		else if(p.currentRecord==p.totalRecords){
			$(controls.next).prop('disabled',true);
		}
		else if(p.currentRecord==1){
			$(controls.prev).prop('disabled',true);
		}
	}
	
	function _getJSON(){
		var pd={
				key : {
					userId : userId,
					startDate : $(fields.startDate).val()
				},
				endDate : $(fields.endDate).val(),
				firstName : $(fields.firstName).val(),
				middleName : $(fields.middleName).val(),
				lastName : $(fields.lastName).val(),
				birthDate : $(fields.birthDate).val(),
				phone : $(fields.phone).val(),
				email : $(fields.email).val()
		}
		return pd;
	}
	
	function _addUsernameToElement(userId,elementId){
		var url='/userrecord/show/'+userId+'/credentialsdetails';
		$(elementId).empty();
		$.getJSON(url,function(u){
			$(elementId).append(u.username);
		});
	}
	
	function showOnKeyDate(uid,keyDate){
	
		var personal;
		userId=uid;
		changed=false;
		_clear();
		
		DAO.loadPersonal(userId,keyDate,function(status,personal){
			
			console.log('Module Personal, DAO returned : '+status);
			if(status==DAO.STATUS.DONE){
				_fill(personal);
			}
			else if(status==DAO.STATUS.NA){
				$(divs.content).hide();
				$(divs.na).show();
			}
			else if(status==DAO.STATUS.FAIL){
				
			}
		});
	}
	
	function save(){
		var pers=_getJSON();
		console.log(pers);
		DAO.savePersonal(userId,pers,function(status,p){
			if(status==DAO.STATUS.DONE){
				//saved
				changed=false;
				$(fields.isChanged).empty();
				_clear();
				_fill(p);
			}
			else if(status==DAO.STATUS.FAIL){
				//save failed
			}
		});
		
	}
	
	function next(){
		
		var startDate=$(fields.startDate).val();
		var p;
		
		changed=false;
		_clear();
		
		DAO.loadNextPersonal(userId,startDate,function(status,p){
			if(status==DAO.STATUS.DONE){
				_fill(p);
			}
			else if(status==DAO.STATUS.NA){
				$(divs.content).hide();
				$(divs.na).show();
			}
			else if(status==DAO.STATUS.FAIL){
				
			}
		});
	}
	
	function prev(){
		var startDate=$(fields.startDate).val();
		var p;
		
		changed=false;
		_clear();
		
		DAO.loadPrevPersonal(userId,startDate,function(status,p){
			if(status==DAO.STATUS.DONE){
				_fill(p);
			}
			else if(status==DAO.STATUS.NA){
				$(divs.content).hide();
				$(divs.na).show();
			}
			else if(status==DAO.STATUS.FAIL){
				
			}
		});
	}
	
	function copy(){
		$(divs.content).show();
		$(divs.na).hide();
		
		changed=false;
		$(fields.isChanged).empty();
		
		var today=$.now();
		$(fields.startDate).val($.format.date(today, 'yyyy-MM-dd'));
		$(fields.endDate).val(null);
		$(fields.counter).text("New");
	}
	
	function newRec(){
		$(divs.content).show();
		$(divs.na).hide();
		
		changed=false;
		_clear();
		
		var today=$.now();
		$(fields.startDate).val($.format.date(today, 'yyyy-MM-dd'));
		$(fields.counter).text("New");
	}
	
	function del(){
		changed=false;
		$(fields.isChanged).empty();
	}
	
	function newUser(uid){
		userId=uid;
		newRec();
	}
	
	return{
		init : init,
		isChanged : isChanged,
		showOnKeyDate : showOnKeyDate,
		next : next,
		prev : prev,
		copy : copy,
		newRec : newRec,
		del : del,
		save : save,
		newUser : newUser
	}
	
})();

var Contract=(function(){
	
	var userId;
	
	var divs={
			content : '#userrecord-contract-content',
			na : '#userrecord-contract-na'
	}
	
	var fields={
			startDate : '#contractStartDate',
			endDate : '#contractEndDate',
			contractType : '#contractType',
			minHours : '#minHours',
			maxHours : '#maxHours',
			changedBy : '#contractChangedBy',
			changeTs : '#contractChangedTs',
			counter : '#userrecord-contract-counter',
			isChanged : '#userrecord-contract-isChanged'
	}
	
	var controls={
			prev : '#userrecord-contract-prev-button',
			next : '#userrecord-contract-next-button',
			copy : '#userrecord-contract-copy-button',
			newRec : '#userrecord-contract-new-button',
			newRecNA : '#userrecord-contract-na-new-button',
			del : '#userrecord-contract-del-button',
			save : '#userrecord-contract-save-button'	
	}
	
	var STATUS={
			FIRST : 'first',
			LAST : 'last',
			NORMAL : 'normal',
			NEW : 'new'
	}
	
	var currentStatus;
	var changed=false;
	
	function init(){
		console.log('Initializing Module Contract...')
		_bindEventHandlers();
	}
	
	function _bindEventHandlers(){
		$(controls.save).on('click',save);
		$(controls.next).on('click',next);
		$(controls.prev).on('click',prev);
		$(controls.copy).on('click',copy);
		$(controls.newRec).on('click',newRec);
		$(controls.newRecNA).on('click',newRec);
		$(controls.del).on('click',del);
		
		$(fields.startDate).keyup(_changeHandler);
		$(fields.endDate).keyup(_changeHandler);
		$(fields.contractType).change(_changeHandler);
		$(fields.minHours).keyup(_changeHandler);
		$(fields.maxHours).keyup(_changeHandler);
	}
	
	function _changeHandler(){
		Contract.changed=true;
		$(fields.isChanged).text('save changes');
	}
	
	function isChanged(){
		return changed;
	}
	
	function _clear(){
		$(fields.startDate).val(null);
		$(fields.endDate).val(null);
		$(fields.contractType).val(null);
		$(fields.minHours).val(null);
		$(fields.maxHours).val(null);
		$(fields.changeTs).empty();
		$(fields.changedBy).empty();
		$(fields.counter).empty();
		$(fields.isChanged).empty();
	}
	
	function _fill(c){
		
		$(divs.content).show();
		$(divs.na).hide();
		
		$(fields.startDate).val(c.key.startDate);
		$(fields.endDate).val(c.endDate);
		$(fields.contractType).val(c.contractType.id);
		$(fields.minHours).val(c.minHours);
		$(fields.maxHours).val(c.maxHours);
		
		var ts=$.format.date(new Date(c.changeTs),'dd.MM.yyyy hh:mm');
		$(fields.changeTs).text(ts);
		$(fields.counter).text(c.currentRecord+'/'+c.totalRecords);
		
		_addUsernameToElement(c.key.userId,fields.changedBy);
		
		$(controls.next).prop('disabled',false);
		$(controls.prev).prop('disabled',false);

		if(c.currentRecord==c.totalRecords && c.totalRecords==1){
			$(controls.next).prop('disabled',true);
			$(controls.prev).prop('disabled',true);
		}
		else if(c.currentRecord==c.totalRecords){
			$(controls.next).prop('disabled',true);
		}
		else if(c.currentRecord==1){
			$(controls.prev).prop('disabled',true);
		}
	}
	
	function _getJSON(){
		var cd={
				key : {
					userId : userId,
					startDate : $(fields.startDate).val()
				},
				endDate : $(fields.endDate).val(),
				contractType : {
					id : $(fields.contractType).val()
				},
				minHours : $(fields.minHours).val(),
				maxHours : $(fields.maxHours).val()
		}
		return cd;
	}
	
	function _addUsernameToElement(userId,elementId){
		var url='/userrecord/show/'+userId+'/credentialsdetails';
		$(elementId).empty();
		$.getJSON(url,function(u){
			$(elementId).append(u.username);
		});
	}
	
	function showOnKeyDate(uid,keyDate){
	
		var contract;
		userId=uid;
		changed=false;
		_clear();
		
		DAO.loadContract(userId,keyDate,function(status,contract){
			
			console.log('Module Contract, DAO returned : '+status);
			if(status==DAO.STATUS.DONE){
				_fill(contract);
			}
			else if(status==DAO.STATUS.NA){
				$(divs.content).hide();
				$(divs.na).show();
			}
			else if(status==DAO.STATUS.FAIL){
				
			}
		});
	}
	
	function save(){
		var ctrc=_getJSON();
		DAO.saveContract(userId,ctrc,function(status,c){
			if(status==DAO.STATUS.DONE){
				//saved
				changed=false;
				$(fields.isChanged).empty();
				_clear();
				_fill(c);
			}
			else if(status==DAO.STATUS.FAIL){
				//save failed
			}
		});
		
	}
	
	function next(){
		
		var startDate=$(fields.startDate).val();
		var c;
		
		changed=false;
		_clear();
		
		DAO.loadNextContract(userId,startDate,function(status,c){
			if(status==DAO.STATUS.DONE){
				_fill(c);
			}
			else if(status==DAO.STATUS.NA){
				$(divs.content).hide();
				$(divs.na).show();
			}
			else if(status==DAO.STATUS.FAIL){
				
			}
		});
	}
	
	function prev(){
		var startDate=$(fields.startDate).val();
		var c;
		
		changed=false;
		_clear();
		
		DAO.loadPrevContract(userId,startDate,function(status,c){
			if(status==DAO.STATUS.DONE){
				_fill(c);
			}
			else if(status==DAO.STATUS.NA){
				$(divs.content).hide();
				$(divs.na).show();
			}
			else if(status==DAO.STATUS.FAIL){
				
			}
		});
	}
	
	function copy(){
		
		changed=false;
		$(fields.isChanged).empty();
		
		var today=$.now();
		$(fields.startDate).val($.format.date(today, 'yyyy-MM-dd'));
		$(fields.endDate).val(null);
		$(fields.counter).text("New");
	}
	
	function newRec(){
		$(divs.na).hide();
		$(divs.content).show();
		
		
		changed=false;
		_clear();
		
		var today=$.now();
		$(fields.startDate).val($.format.date(today, 'yyyy-MM-dd'));
		$(fields.counter).text("New");
	}
	
	function del(){
		changed=false;
		$(fields.isChanged).empty();
	}
	
	function newUser(uid){
		userId=uid;
		newRec();
	}
	
	return{
		init : init,
		isChanged : isChanged,
		showOnKeyDate : showOnKeyDate,
		next : next,
		prev : prev,
		copy : copy,
		newRec : newRec,
		del : del,
		save : save,
		newUser : newUser
	}
	
})();

var Assignment=(function(){
	
	var userId;
	
	var divs={
			content : '#userrecord-assignment-content',
			na : '#userrecord-assignment-na'
	}
	
	var fields={
			startDate : '#assignmentStartDate',
			endDate : '#assignmentEndDate',
			orgUnitId : '#orgUnitId',
			orgUnitName : '#orgUnitName',
			costCenterId : '#costCenterId',
			costCenterName : '#costCenterName',
			orgTree : '#userrecord-assignment-orgtree',
			changedBy : '#assignmentChangedBy',
			changeTs : '#assignmentChangedTs',
			counter : '#userrecord-assignment-counter',
			isChanged : '#userrecord-assignment-isChanged'
	}
	
	var controls={
			prev : '#userrecord-assignment-prev-button',
			next : '#userrecord-assignment-next-button',
			copy : '#userrecord-assignment-copy-button',
			newRec : '#userrecord-assignment-new-button',
			newRecNA : '#userrecord-assignment-na-new-button',
			del : '#userrecord-assignment-del-button',
			save : '#userrecord-assignment-save-button',
			orgTree :'#userrecord-assignment-orgtree-button'
	}
	
	var STATUS={
			FIRST : 'first',
			LAST : 'last',
			NORMAL : 'normal',
			NEW : 'new'
	}
	
	var currentStatus;
	var changed=false;
	
	function init(){
		console.log('Initializing Module Assignment...')
		_bindEventHandlers();
	}
	
	function _bindEventHandlers(){
		$(controls.save).on('click',save);
		$(controls.next).on('click',next);
		$(controls.prev).on('click',prev);
		$(controls.copy).on('click',copy);
		$(controls.newRec).on('click',newRec);
		$(controls.newRecNA).on('click',newRec);
		$(controls.del).on('click',del);
		$(controls.orgTree).on('click',_showOrgTree);
		
		$(fields.startDate).keyup(_changeHandler);
		$(fields.endDate).keyup(_changeHandler);
		
		$(fields.orgTree).on('changed.jstree', _orgTreeChangeHandler);
		
	}
	
	function _changeHandler(){
		changed=true;
		$(fields.isChanged).text('save changes');
	}
	
	function _orgTreeChangeHandler(e,data){
		var orgUnitId=data.selected;
		_addOrgUnitDetails(orgUnitId);
		changed=true;
		$(fields.isChanged).text('save changes');
	}
	
	function _addOrgUnitDetails(id){
		var url='/organisation/?id='+id;
		
		$.getJSON(url,function(ou){
			console.log(ou);
			$(fields.orgUnitId).val(ou.id);
			$(fields.orgUnitName).val(ou.name);
			if(ou.costCenter!=null){
				$(fields.costCenterId).val(ou.costCenter.id);
				$(fields.costCenterName).val(ou.costCenter.name);
			}
			else{
				$(fields.costCenterId).val('N/A');
				$(fields.costCenterName).val('N/A');
			}
		}).done(function(ou){
			
		}).fail(function(ou){
			
		});
	}
	
	function _showOrgTree(){
		if($(controls.orgTree).data('treevisible')==true){
			$('#orgTreeDiv').hide();
			$(controls.orgTree).data('treevisible',false);
			$(controls.orgTree).val('Show Org. Tree');
		}
		else{
			_loadOrgTree();
			$('#orgTreeDiv').show();
			$(controls.orgTree).data('treevisible',true);
			$(controls.orgTree).val('Hide Org. Tree');
		}
	}
	
	function _loadOrgTree(){
		var tree;
		DAO.loadOrgTree(function(status,tree){
			if(status==DAO.STATUS.DONE){
				_fillOrgTree(tree);
			}
		});
	}
	
	function _fillOrgTree(data){
		$(fields.orgTree).jstree({ 
			'core' : {
				'data' : data
			} 
		});
	}
	
	function isChanged(){
		return changed;
	}
	
	function _clear(){
		$(fields.startDate).val(null);
		$(fields.endDate).val(null);
		$(fields.orgUnitId).val(null);
		$(fields.orgUnitName).val(null);
		$(fields.costCenterId).val(null);
		$(fields.costCenterName).val(null);
		$(fields.changeTs).empty();
		$(fields.changedBy).empty();
		$(fields.counter).empty();
		$(fields.isChanged).empty();
	}
	
	function _fill(a){
		
		$(divs.content).show();
		$(divs.na).hide();
		
		$(fields.startDate).val(a.key.startDate);
		$(fields.endDate).val(a.endDate);
		var ts=$.format.date(new Date(a.changeTs),'dd.MM.yyyy hh:mm');
		$(fields.changeTs).append(ts);
		$(fields.counter).append(a.currentRecord+'/'+a.totalRecords);
		
		_addUsernameToElement(a.key.userId,fields.changedBy);
		_addOrgUnitDetails(a.orgUnit.id);
		
		$(controls.next).prop('disabled',false);
		$(controls.prev).prop('disabled',false);
		
		if(a.currentRecord==a.totalRecords && a.totalRecords==1){
			$(controls.next).prop('disabled',true);
			$(controls.prev).prop('disabled',true);
		}
		else if(a.currentRecord==a.totalRecords){
			$(controls.next).prop('disabled',true);
		}
		else if(a.currentRecord==1){
			$(controls.prev).prop('disabled',true);
		}
	}
	
	function _getJSON(){
		var ad={
				key : {
					userId : userId,
					startDate : $(fields.startDate).val()
				},
				endDate : $(fields.endDate).val(),
				orgUnit : {
					id : $(fields.orgUnitId).val(),
				}
		}
		return ad;
	}
	
	function _addUsernameToElement(userId,elementId){
		var url='/userrecord/show/'+userId+'/credentialsdetails';
		$(elementId).empty();
		$.getJSON(url,function(u){
			$(elementId).append(u.username);
		});
	}
	
	function showOnKeyDate(uid,keyDate){
	
		var assignment;
		userId=uid;
		changed=false;
		_clear();
		
		DAO.loadAssignment(userId,keyDate,function(status,assignment){
			
			console.log('Module Assignment, DAO returned : '+status);
			if(status==DAO.STATUS.DONE){
				_fill(assignment);
			}
			else if(status==DAO.STATUS.NA){
				$(divs.content).hide();
				$(divs.na).show();
			}
			else if(status==DAO.STATUS.FAIL){
				
			}
		});
	}
	
	function save(){
		var assignment=_getJSON();
		
		DAO.saveAssignment(userId,assignment,function(status,a){
			if(status==DAO.STATUS.DONE){
				//saved
				Assignment.changed=false;
				$(fields.isChanged).empty();
				_clear();
				_fill(a);
			}
			else if(status==DAO.STATUS.FAIL){
				//save failed
			}
		});
		
	}
	
	function next(){
		
		var startDate=$(fields.startDate).val();
		var a;
		
		changed=false;
		_clear();
		
		DAO.loadNextAssignment(userId,startDate,function(status,a){
			if(status==DAO.STATUS.DONE){
				_fill(a);
			}
			else if(status==DAO.STATUS.NA){
				$(divs.content).hide();
				$(divs.na).show();
			}
			else if(status==DAO.STATUS.FAIL){
				
			}
		});
	}
	
	function prev(){
		var startDate=$(fields.startDate).val();
		var a;
		
		changed=false;
		_clear();
		
		DAO.loadPrevAssignment(userId,startDate,function(status,a){
			if(status==DAO.STATUS.DONE){
				_fill(a);
			}
			else if(status==DAO.STATUS.NA){
				$(divs.content).hide();
				$(divs.na).show();
			}
			else if(status==DAO.STATUS.FAIL){
				
			}
		});
	}
	
	function copy(){
		$(divs.content).show();
		$(divs.na).hide();
		
		Assignment.changed=false;
		$(fields.isChanged).empty();
		
		var today=$.now();
		$(fields.startDate).val($.format.date(today, 'yyyy-MM-dd'));
		$(fields.endDate).val(null);
		$(fields.counter).text("New");
	}
	
	function newRec(){
		$(divs.content).show();
		$(divs.na).hide();
		
		Assignment.changed=false;
		_clear();
		
		var today=$.now();
		$(fields.startDate).val($.format.date(today, 'yyyy-MM-dd'));
		$(fields.counter).text("New");
	}
	
	function del(){
		Assignment.changed=false;
		$(fields.isChanged).empty();
	}
	
	function newUser(uid){
		userId=uid;
		newRec();
	}
	
	return{
		init : init,
		isChanged : isChanged,
		showOnKeyDate : showOnKeyDate,
		next : next,
		prev : prev,
		copy : copy,
		newRec : newRec,
		del : del,
		save : save,
		newUser : newUser
	}
	
})();

var Credentials=(function(){
	
	var userId;
	
	var divs={
			content : '#userrecord-credentials-content',
			na : '#userrecord-credentials-na'
	}
	
	var fields={
			id : '#id',
			secondaryId : '#secondaryId',
			username : '#uname',
			password : '#pword',
			enabled : '#enabled',
			roles : '#userrecord-roles',
			changedBy : '#credentialsChangedBy',
			changeTs : '#credentialsChangedTs',
			isChanged : '#userrecord-credentials-isChanged'
	}
	
	var controls={
			newRecNA : '#userrecord-credentials-na-new-button',
			save : '#userrecord-credentials-save-button'	
	}
	
	var STATUS={
			NORMAL : 'normal',
			NEW : 'new'
	}
	
	var currentStatus;
	var changed=false;
	
	function init(){
		console.log('Initializing Module Credentials...')
		_bindEventHandlers();
	}
	
	function _bindEventHandlers(){
		$(controls.save).on('click',save);
		$(controls.newRecNA).on('click',newUser);
		
		
		$(fields.secondaryId).keyup(_changeHandler);
		$(fields.username).keyup(_changeHandler);
		$(fields.password).keyup(_changeHandler);
		
		$(fields.enabled).change(_changeHandler);
		$(fields.roles).find('input[type="checkbox"]').each(function(){
			cb=$(this);
			cb.change(_changeHandler);
		});
		
		
	}
	
	function _changeHandler(){
		changed=true;
		$(fields.isChanged).text('save changes');
	}
	
	function isChanged(){
		return changed;
	}
	
	function _clearCredentials(){
		$(fields.id).val(null);
		$(fields.secondaryId).val(null);
		$(fields.username).val(null);
		$(fields.password).val(null);
		
		$(fields.changeTs).empty();
		$(fields.changedBy).empty();
		$(fields.isChanged).empty();
	}
	
	function _clearRoles(){
		$(fields.roles).find('input[type="checkbox"]').each(function(){
			var cb=$(this);
			cb.prop('checked',false);
		});
	}
	
	function _fillCredentials(c){
		
		$(divs.content).show();
		$(divs.na).hide();
		
		$(fields.id).val(c.id);
		$(fields.secondaryId).val(c.secondaryId);
		$(fields.username).val(c.username);
		$(fields.password).val(c.password);
		$(fields.enabled).prop("checked",c.enabled);
		
		var ts=$.format.date(new Date(c.changeTs),'dd.MM.yyyy hh:mm');
		$(fields.changeTs).text(ts);
		
		_addUsernameToElement(c.id,fields.changedBy);
		
		$(controls.next).prop('disabled',false);
		$(controls.prev).prop('disabled',false);

		if(c.currentRecord==c.totalRecords && c.totalRecords==1){
			$(controls.next).prop('disabled',true);
			$(controls.prev).prop('disabled',true);
		}
		else if(c.currentRecord==c.totalRecords){
			$(controls.next).prop('disabled',true);
		}
		else if(c.currentRecord==1){
			$(controls.prev).prop('disabled',true);
		}
	}
	
	function _fillRoles(roles){
		var r;
		var cb;
		
		for(var i=0;i<roles.length;i++){
			r=roles[i];
			$(fields.roles).find('input[type="checkbox"]').each(function(){
				cb=$(this);
				if(cb.data('role_id')==r.key.roleId){
					cb.prop('checked',true);
				}
			});
		}
	}
	
	function _getCredentialsJSON(){
		var cred={
				id : userId,
				secondaryId : $(fields.secondaryId).val(),
				username : $(fields.username).val(),
				password : $(fields.password).val(),
				enabled : $(fields.enabled).prop('checked')
		}
		return cred;
	}
	
	function _getRolesJSON(userId){
		var roles=[];
		var roleId;
		
		$(fields.roles+' input:checked').each(function(){
			roleId=$(this).data('role_id');
			roles.push({
				'key' :{
					'userId' : userId,
					'roleId' : roleId
				}
			});
		});
		return roles;
	}
	
	function _addUsernameToElement(userId,elementId){
		var url='/userrecord/show/'+userId+'/credentialsdetails';
		$(elementId).empty();
		$.getJSON(url,function(u){
			$(elementId).append(u.username);
		});
	}
	
	function show(uid){
	
		var cred;
		
		userId=uid;
		changed=false;
		_clearCredentials();
		_clearRoles();
		
		DAO.loadCredentials(userId,function(status,credentials){
			if(status==DAO.STATUS.DONE){
				_fillCredentials(credentials);
				
			}
			else if(status==DAO.STATUS.NA){
				
			}
			else if(status==DAO.STATUS.FAIL){
				
			}
		});
		
		_showRoles(userId)
	}
	
	function _showRoles(userId){
		
		var roles;
		
		_clearRoles();
		
		DAO.loadRoles(userId,function(status,roles){
			if(status==DAO.STATUS.DONE){
				_fillRoles(roles);
			}
			else if(status==DAO.STATUS.NA){
				
			}
			else if(status==DAO.STATUS.FAIL){
				
			}
		});
	}
	
	function save(){
		
		var cred=_getCredentialsJSON();
		var roles;
		var credSaveOk=false;
		var rolesSaveOk=false;
		
		console.log('saving Credentials '+userId);
		
		DAO.saveCredentials(userId,cred,function(status,c){
			if(status==DAO.STATUS.DONE){
				
				userId=c.id;
				_clearCredentials();
				_fillCredentials(c);
				credSaveOk=true;
				
				UserRecord.userCreated(userId);
				
				roles=_getRolesJSON(userId);
	
				DAO.saveRoles(userId,roles,function(status,r){
					if(status==DAO.STATUS.DONE){
						_clearRoles();
						_fillRoles(r);
						rolesSaveOk=true;
						if(credSaveOk && rolesSaveOk){
							changed=false;
							$(fields.isChanged).empty();
						}
						
					}
					else if(status==DAO.STATUS.FAIL){
						
					}
				});
			}
			else if(status==DAO.STATUS.FAIL){
				//save failed
			}
		})
		
	}
	
	function newUser(){
		changed=false;
		userId=DAO.NEW_ID;
		_clearCredentials();
		_clearRoles();
	}
	
	return{
		init : init,
		isChanged : isChanged,
		show : show,
		save : save,
		newUser : newUser
	}
	
})();

var ScheduleEditor=(function(){
	
	//var orgUnitId;
	var plan;
	var orgTree;
	
	var controls={
			planSelect : '#scheduler-plan-select',
			refresh : '#scheduler-period-refresh-button',
			changePlan : '#scheduler-plan-change-button'
			
	}
	var fields={
			unitDetails :'#scheduler-org-unit-details',
			planDetails :'#scheduler-plan-details',
			keyDate : '#schedule-editor-key-date',
			periodStart : '#scheduler-period-start',
			periodEnd : '#scheduler-period-end'
	}
	var headerRowDates='#schedule-editor-thead-row-dates';
	var headerRowWeekdays='#schedule-editor-thead-row-weekdays';
	var tbody='#schedule-editor-tbody';
	var copyCell;
	var pasteCell;
	var currentCell;
	var locked=false;
	
	function init(){
		console.log('Initializing Module Schedule Editor');
		orgTree=new OrgTree('#scheduler-org-structure-tree',_orgTreeChangeListener)
		_bindEventHandlers();
		ScheduleEditDialog.init();
	}
	
	function _bindEventHandlers(){
		$(controls.refresh).click(function(){
			_clearDateColumns();
			_createDateColumns();
			_clearSchedules();
			_loadSchedules();
		});
		_bindPlanChangeListener();
		_bindKeyListener();
		_bindCells();
	}
	
	function _bindKeyListener(){
		$(document).keydown(function(event){
			if(event.which==67 && event.ctrlKey){
				_copyEvent(event);
			}
			else if(event.which==86 && event.ctrlKey){
				_pasteEvent(event);
			}
			else if(event.which==46){
				_deleteEvent(event);
			}
		});
	}
	
	function _bindPlanChangeListener(){
		$(controls.planSelect).change(function(event){
			//var oid=SEOrgStructure.getSelectedOrgUnitId();
			var oid=orgTree.selectedValue;
			var pid=$(controls.planSelect).val();
			showSchedules(oid,pid);
		})
	}
	
	function _bindCells(){
		$(tbody).find('td').each(function(){
			_bindSingleCell(this);
		});
	}
	
	function _bindSingleCell(td){
		$(td).click(ScheduleEditDialog.edit);
		$(td).mouseenter(function(event){
			var cell=event.target;
			if($(cell).index()>0 && !locked){
				currentCell=cell;
			}
		});
	}
	
	function _orgTreeChangeListener(e,data){
		var oid=orgTree.selectedValue;
		var pid=$('#scheduler-plan-select').val();
		showSchedules(oid,pid);
	}
	
	function getDate(colIndex){
		return $(headerRowDates).find('th').eq(colIndex).attr('data-date');
	}
	
	function getUserId(td){
		var tr=$(td.parentNode);
		console.log(tr.attr('data-userId'));
		var userId=tr.attr('data-userId');
		return userId;
	}
	
	function _copyEvent(event){
		console.log('Copying cell');
		if(!locked){
			copyCell=currentCell;
		}
	}
	
	function _pasteEvent(event){
		if(copyCell!=null 
				&& $(currentCell).index()>0 
				&& $(currentCell).attr('class')=='cell-schedule'){
			
			//lock, so currentCell & copyCell can't change
			locked=true;
			
			//save this to DB...
			var userId=getUserId(currentCell);
			console.log('user id: '+userId);
			var schedule=_getJSON(userId,copyCell);
			schedule.scheduleDate=getDate($(currentCell).index());
			
			pasteCell=currentCell;
			if($(currentCell).attr('data-id')){
				console.log('existing schedule found... deleting');
				_deleteCell(currentCell,function(isDeleted){
					if(isDeleted){
						_pasteCopiedCell();
					}
					else{
						//release lock if delete failed;
						locked=false;
					}
				})
			}
			else{
				console.log('no existing schedule. saving.');
				_pasteCopiedCell();
			}
		}
	}
	
	function _deleteEvent(event){
		if(!locked && 
				$(currentCell).index()>0 
				&& $(currentCell).attr('class')=='cell-schedule'){
			locked=true;
			_deleteCell(currentCell,function(isDeleted){
				if(isDeleted){
					_clearCell(currentCell);
				}
				locked=false;
			});
		}
	}
	
	function _deleteCell(cell,_callback){
		var id=$(cell).attr('data-id');
		
		DAO.deleteSchedule(id,function(status){
			var isDeleted=false;
			if(status==DAO.STATUS.DONE){
				isDeleted=true;
			}
			_callback(isDeleted);
		});
	}
	
	function _pasteCopiedCell(){
		
		var userId=getUserId(currentCell);
		var schedule=_getJSON(userId,copyCell);
		schedule.scheduleDate=getDate($(currentCell).index());
		
		DAO.saveSchedule(userId,schedule,function(status,s){
			if(status==DAO.STATUS.DONE){
				console.log('saved... now pasting');
				_fillCell(currentCell,s);
			}
			else if(status==DAO.STATUS.FAIL){
				//fail
			}
			//always release lock;
			locked=false;
		})
	}
	
	function _fillCell(td,schd){
		$(td).attr('data-id',schd.id);
		$(td).attr('data-typeId',schd.typeId);
		$(td).attr('data-date',schd.scheduleDate);
		$(td).attr('data-start',schd.start);
		$(td).attr('data-end',schd.end);
		$(td).text(Util.getTimeHHmm(schd.start)+'-'+Util.getTimeHHmm(schd.end));
	}
	
	function _clearCell(td){
		$(td).replaceWith('<td class="cell-schedule"></td>');
	}
	
	function _getJSON(userId,td){
		var schedule={
			id : null,
			planId : plan.id,
			userId : userId,
			orgUnitId : parseInt(orgTree.selectedValue[0]),
			scheduleDate : null,
			scheduleTypeId : $(td).attr('data-typeId') || 1,
			start : $(td).attr('data-start'),
			end : $(td).attr('data-end')
		}
		return schedule;
	}
	
	function _getScheduleCell(schedule){
		var td;
		if(schedule!=null){
			td=$('<td class="cell-schedule" \
					data-id="'+schedule.id+'" \
					data-typeId="'+schedule.scheduleTypeId+'" \
					data-date="'+schedule.scheduleDate+'" \
					data-start="'+schedule.start+'" \
					data-end="'+schedule.end+'">'+Util.getTimeHHmm(schedule.start)+'-'+Util.getTimeHHmm(schedule.end)+'</td>');
		}
		else{
			td=$('<td class="cell-schedule"></td>');
		}
		_bindSingleCell(td);
		return td;			
	}
	
	function _getInactiveCell(){
		var td=$('<td class="cell-schedule-inactive"></td>');
		return td;
	}
	
	function _getPastDateCell(schedule){
		var td;
		if(schedule!=null){
			td=$('<td class="cell-schedule-pastdate" \
					data-id="'+schedule.id+'" \
					data-typeId="'+schedule.scheduleTypeId+'" \
					data-date="'+schedule.scheduleDate+'" \
					data-start="'+schedule.start+'" \
					data-end="'+schedule.end+'">'+Util.getTimeHHmm(schedule.start)+'-'+Util.getTimeHHmm(schedule.end)+'</td>');
		}
		else{
			td=$('<td class="cell-schedule-pastdate"></td>');
		}
		return td;
	}
	
	function _clearDateColumns(){
		$(headerRowDates).find('th:gt(0)').remove();
		$(headerRowWeekdays).find('th').remove();
	}
	
	function _createDateColumns(){
		//var startDate=new Date($(fields.periodStart).val());
		//var endDate=new Date($(fields.periodEnd).val());
		var d=new Date(plan.startDate);
		var b=new Date(plan.endDate);
		b.setDate(b.getDate()+1)
		
		var thDateHtml;
		var thWeekDayHtml;
		var formattedDate;
		
		while(d < b){
			formattedDate=Util.getFormattedDate(d);
			thDateHtml='<th data-date="'+formattedDate+'">'+formattedDate+'</th>';
			thWeekdayHtml='<th>'+Util.getWeekday(d)+'</th>';
			$(headerRowDates).append(thDateHtml);
			$(headerRowWeekdays).append(thWeekdayHtml);
			d.setDate(d.getDate()+1);
		}
	}
	
	function showSchedules(oid,pid){
		
		orgUnitId=oid;
		DAO.loadOrgUnit(orgUnitId,function(status,ou){
			if(status==DAO.STATUS.DONE){
				_fillOrgUnitDetails(ou);
				DAO.loadPlan(pid,function(status,p){
					if(status==DAO.STATUS.DONE){
						setPlan(p);
					}
					else if(status==DAO.STATUS.NA){
						_fillPlanDetails(null);
						_clearDateColumns();
						_clearRows();
					}
				});
			}
		});
	}
	
	function _fillOrgUnitDetails(ou){
		$(fields.unitDetails).text('ID: '+ou.id+' '+ou.name);
	}
	
	function _fillPlanDetails(p){
		if(p!=null && p!=''){
			/*var start=$.format.date(p.startDate,'yyyy-MM-dd');
			var end=$.format.date(p.endDate,'yyyy-MM-dd');*/
			$(fields.planDetails).text('Plan: '+p.name);
		}
		else{
			$(fields.planDetails).text('No plan found');
		}
	}
	
	function setPlan(p){
		plan=p;
		_fillPlanDetails(p);
		_clearDateColumns();
		_clearRows();
		_createDateColumns();
		_createRows();
	}
	
	function getPlan(){
		return plan;
	}
	
	function getOrgUnitId(){
		return orgTree.selectedValue;
	}
	
	function _clearRows(){
		$(tbody).empty();
	}
	
	function _createRows(){
		console.log('loading employees...'+orgUnitId+' '+plan.startDate);
		//load employees assigned to org. unit between p.startDate and p.endDate
		DAO.loadAssignedEmployees(orgUnitId,plan.startDate,plan.endDate,function(status,el){
			if(status==DAO.STATUS.DONE){
				console.log(el);
				for(var i=0;i<el.length;i++){
					var tr=$('<tr></tr>');
					$(tbody).append(tr);
					_createRow(tr,el[i]);
				}
				
			}
			else if(status==DAO.STATUS.NA){
				
			}
			else{
				
			}
		});
	}
	
	function _createRow(tr,employee){
		_createEmployeeCells(tr,employee);
		var orgUnitId=orgTree.selectedValue;
		DAO.loadSchedules(employee.userId,plan.id,orgUnitId,function(status,schedules){
			if(status==DAO.STATUS.DONE){
				_createScheduleCells(tr,employee,schedules);
			}
			else if(status==DAO.STATUS.NA){
				
			}
			else if(status==DAO.STATUS.FAIL){
				
			}
		});
	}
	
	function _createEmployeeCells(tr,employee){
		
		$(tr).attr('data-userId',employee.userId);
		var td=$('<td class="cell-user">'+employee.firstName+' '+employee.lastName+'</td>');
		$(tr).append(td);
	}
	
	function _createScheduleCells(tr,employee,schedules){
		var columnCount=$(headerRowDates+' > th').length-1;
		var date;
		var s;
		var td;
		
		for(var c=1;c<columnCount+1;c++){
			date=getDate(c);
			s=schedules[date];
			if(_isActive(employee,date)){
				if(_isPastDate(date)){
					td=_getPastDateCell(s);
				}
				else{
					td=_getScheduleCell(s);
				}
			}
			else{
				td=_getInactiveCell();
			}
			tr.append(td);
		}
	}
	
	function _isActive(employee,date){
		active=false;
		for(var i=0;i<employee.activePeriods.length;i++){
			var p=employee.activePeriods[i];
			var startDate=new Date(p.startDate);
			var endDate=new Date(p.endDate);
			var d=new Date(date);
			if(d.getTime()>=startDate.getTime() && (p.endDate==null || d.getTime()<=endDate.getTime())){
				active=true;
			}
		}
		return active;
	}
	
	function _isPastDate(date){
		datePassed=false;
		var d=new Date(date);
		var currentDate=new Date();
		if(d.getTime()<=currentDate.getTime()){
			datePassed=true;
		}
		return datePassed;
	}
	
	return{
		init : init,
		getDate : getDate,
		getUserId : getUserId,
		showSchedules : showSchedules,
		setPlan : setPlan,
		getPlan : getPlan,
		getOrgUnitId : getOrgUnitId
	}
	
})();

var ScheduleEditDialog=(function(){
	
	const dialog='#schedule-edit-dialog';
	const fields={
			start : '#start',
			end : '#end'
	}
	
	var td;
	
	function init(){
		$(dialog).dialog({
			modal: true,
			dialogClass :'no-close',
			autoOpen: false,
			buttons: [
				{
					text: 'OK',
					click: ScheduleEditDialog.save
				},
				{
					text: 'Cancel',
					click: ScheduleEditDialog.cancel
				}
			]
		});
	}
	
	function edit(event){
		console.log('showing dialog...'+event.target);
		td=event.target;
		$(dialog).find(fields.start).val($(td).attr('data-start'));
		$(dialog).find(fields.end).val($(td).attr('data-end'));
		$(dialog).dialog('open');
	}

	function cancel(){
		$(dialog).find(fields.start).val(null);
		$(dialog).find(fields.end).val(null);
		td=null;
		$(dialog).dialog( "close" );
	}

	function save(event){
		
		var start=Util.getTimeSQL($(dialog).find(fields.start).val());
		var end=Util.getTimeSQL($(dialog).find(fields.end).val());
		
		var colIndex=$(td).index();
		var date=ScheduleEditor.getDate(colIndex);
		var userId=ScheduleEditor.getUserId(td);
		var planId=ScheduleEditor.getPlan().id;
		var orgUnitId=parseInt(ScheduleEditor.getOrgUnitId()[0]);
		
		if(!start){
			$(dialog).find(fields.start).focus();
		}
		else if(!end){
			$(dialog).find(fields.end).focus();
		}
		else{
			
			var schedule={
					id : $(td).attr('data-id'),
					planId : planId,
					userId : userId,
					orgUnitId : orgUnitId, 
					scheduleDate : date,
					scheduleTypeId : $(td).attr('data-typeId') || 1,
					start : start,
					end : end,
			}
			console.log(schedule);
			DAO.saveSchedule(userId,schedule,function(status,schd){
				if(status==DAO.STATUS.DONE){
					$(td).attr('data-id',schd.id);
					$(td).attr('data-typeId',schd.scheduleTypeId);
					$(td).attr('data-start',schd.start);
					$(td).attr('data-end',schd.end);
					$(td).text(Util.getTimeHHmm(schedule.start)+'-'+Util.getTimeHHmm(schedule.end));
				}
				else if(status==DAO.STATUS.FAIL){
					//add some error handling...
				}
			});
			$(dialog).dialog( "close" );
		}
	}
	
	return{
		init : init,
		edit : edit,
		save : save,
		cancel : cancel
	}
	
})();

var ManagerView=(function(){
	
	var orgTree;
	var employeeList;
	var orgUnitSelectDialog;
	var selectedOrgUnitId;
	var selectedEmployeeId;
	var selectedTimeRow;
	
	var fields={
			periodStart : '#mgrview-period-start',
			periodEnd : '#mgrview-period-end',
			periodSelect : '#mgrview-period-select'
	}
	
	var tables={
			timerecords : "#mgrview-details-timerecords-table",
			schedules :  "#mgrview-details-schedules-table"
	}
	
	var controls={
			periodShow : '#mgrview-period-refresh-button'
	}
	
	function init(){
		orgTree=new OrgTree('#mgrview-orgstructure',_orgTreeChangeListener);
		$('#mgrview-details-tabs').tabs();
		employeeList=new EmployeeList('#mgrview-worker-table',_employeeListClickListener);
		$(fields.periodSelect).change(_periodSelectListener);
		$(controls.periodShow).click(_periodShowClickListener);
		orgUnitSelectDialog=new OrgUnitSelectDialog(_orgUnitSelectListener);
	}
	
	function _periodSelectListener(e){
		console.log('period changed...');
		var p=$(fields.periodSelect).val();
		console.log(p);
		var period=null;
		
		switch(parseInt(p)){
		case 0:
			break;
		case 1:
			period=Util.getLastWeek();
			console.log(period);
			break;
		case 2:
			period=Util.getCurrentWeek();
			console.log(period);
			break;
		case 3:
			period=Util.getCurrentPYPeriod();
			break;
		case 4:
			period=Util.getPreviousPYPeriod();
			break;
		}
	
		if(period!=null){
			$(fields.periodStart).val(period.start);
			$(fields.periodEnd).val(period.end);
		}
	}
	
	function _orgTreeChangeListener(e,data){
		selectedOrgUnitId=orgTree.selectedValue;		
		employeeList.showEmployees(selectedOrgUnitId);
	}
	
	function _employeeListClickListener(e){
		var tr=event.target.parentNode;
		selectedEmployeeId=$(tr).attr('data-userId');
		_showEmployee(selectedEmployeeId);
	}
	
	function _periodShowClickListener(e){
		var periodStart=$(fields.periodStart).val();
		var periodEnd=$(fields.periodEnd).val();
		
	}
	
	function _orgUnitSelectListener(e){
		var oid=parseInt(orgUnitSelectDialog.selectedValue);
		console.log('selected org unit: '+oid);
		$(selectedTimeRow).find('td').eq(8).attr('data-orgUnitId',oid);
		saveWorkTime(selectedTimeRow);
		orgUnitSelectDialog.close();
		selectedTimeRow=null;
	}
	
	function _showEmployee(id){
		var periodStart=$(fields.periodStart).val();
		var periodEnd=$(fields.periodEnd).val();
		_showWorkTime(id,periodStart,periodEnd);
		_showSchedules(id,periodStart,periodEnd);
	}
	
	function _showWorkTime(eeId,periodStart,periodEnd){
		_clearWorkTimeView();
		DAO.loadWorkTimes(eeId,periodStart,periodEnd,function(status,worktimes){
			if(status==DAO.STATUS.DONE){
				console.log(worktimes);
				_createWorkTimeView(worktimes,periodStart,periodEnd);
			}
			else if(status==DAO.STATUS.NA){
				
			}
		});
	}
	
	function _clearWorkTimeView(){
		$(tables.timerecords+' > tbody').empty();
	}
	
	function _createWorkTimeView(worktimes,periodStart,periodEnd){
		var d=new Date(periodStart);
		var e=new Date(periodEnd);
		e.setDate(e.getDate()+1);
		var html='';
		var row;
		var eewt
		var tbody=$(tables.timerecords+' > tbody');
		while(d < e){
			eewt=worktimes[Util.getFormattedDate(d)];
			if(eewt){
				for(var i=0;i<eewt.length;i++){
					row=_createFilledWorkTimeRow(d,eewt[i]);
					tbody.append(row);
				}
			}
			else{
				row=_createEmptyWorkTimeRow(d);
				tbody.append(row);
			}
			d.setDate(d.getDate()+1);
		}
		
	}
	
	function _createFilledWorkTimeRow(date,wt){
		
		var row;
		var weekday;
		var rowClass;
		
		weekday=Util.getWeekday(date);
		if(weekday=="Sat" || weekday=="Sun"){
			rowClass="row-worktime-weekend";
		}
		else{
			rowClass="row-worktime-normal";
		}
		row=$('<tr class="'+rowClass+'" data-id="'+wt.id+'" data-userId="'+wt.userId+'"></tr>');
		$(row).append(_getRowDelCell());
		$(row).append(_getRowAddCell());
		$(row).append('<td class="cell-worktime-date" data-date="'+date+'">'+Util.getFormattedDate(date)+'</td>');
		$(row).append('<td class="cell-worktime-day">'+weekday+'</td>');
		$(row).append(_getActualTimeCell(wt.stampIn,'in'));
		$(row).append(_getActualTimeCell(wt.stampOut,'out'));
		$(row).append(_getRoundedTimeCell(wt.roundedInTime));
		$(row).append(_getRoundedTimeCell(wt.roundedOutTime));
		$(row).append(_getOrgUnitCell(wt.orgUnit));
		$(row).append('<td class="cell-worktime-changed">'+wt.changedByText+'</td>');

		
		return row;
	}
	
	function _createEmptyWorkTimeRow(date){
		var weekday=Util.getWeekday(date);
		var row;
		var rowClass;
		if(weekday=='Sat' || weekday=='Sun'){
			rowClass="row-worktime-weekend";
		}
		else{
			rowClass="row-worktime-normal";
		}
		row=$('<tr class="'+rowClass+'"></tr>');
		$(row).append(_getRowDelCell());
		$(row).append(_getRowAddCell());
		$(row).append('<td class="cell-worktime-date" data-date="'+date+'">'+Util.getFormattedDate(date)+'</td>');
		$(row).append('<td class="cell-worktime-day">'+weekday+'</td>');
		$(row).append(_getActualTimeCell(null,'in'));
		$(row).append(_getActualTimeCell(null,'out'));
		$(row).append(_getRoundedTimeCell(null));
		$(row).append(_getRoundedTimeCell(null));
		$(row).append(_getOrgUnitCell(null));
		$(row).append('<td class="cell-worktime-changed"></td>');
		return row;
	}
	
	function _getRowDelCell(){
		var td=$('<td class="cell-worktime-del"></td>');
		$(td).click(_rowDelListener);
		return td;
	}
	
	function _getRowAddCell(){
		var td=$('<td class="cell-worktime-add"></td>');
		$(td).click(_rowAddListener);
		return td;
	}
	
	function _getRoundedTimeCell(time){
		var td;
		if(time){
			td=$('<td class="cell-worktime-rounded-time">'+Util.getTimeHHmm(time)+'</td>');
		}
		else{
			td=$('<td class="cell-worktime-rounded-time"></td>');
		}
		return td;
	}
	
	function _getActualTimeCell(ts,direction){
		var td;
		var timeInput;
		var time=Util.getTimeFromDate(new Date(ts));
		timeInput=$('<input class="input-worktime" type="time"/>')
		if(ts){
			td=$('<td class="cell-worktime-time" data-stamp="'+ts+'"></td>');
			$(timeInput).val(time);
		}
		else{
			td=$('<td class="cell-worktime-time"></td>');
		}
		$(td).append(timeInput);
		_bindTimeInputListener(timeInput);
		return td;			
	}
	
	function _bindTimeInputListener(input){
		$(input).change(_timeInputListener);
	}
	
	function _timeInputListener(e){
		var tr=$(e.target.parentNode.parentNode);
		saveWorkTime(e.target.parentNode.parentNode);
	}
	
	function saveWorkTime(tr){
		
		var id=$(tr).attr('data-id');
		var date=new Date($(tr).find('td').eq(2).attr('data-date'));
		var startTime=$(tr).find('td').eq(4).find('input').val();
		var endTime=$(tr).find('td').eq(5).find('input').val();
		var oid=$(tr).find('td').eq(8).attr('data-orgUnitId');
		var tsIn=null;
		var tsOut=null;
		
		if(startTime){
			tsIn=Util.getTimestamp(date,startTime);
		}
		if(endTime){
			tsOut=Util.getTimestamp(date,endTime);
		}
		
		var worktime={
				id : id || null,
				userId : parseInt(selectedEmployeeId),
				orgUnit : {
					id : oid || parseInt(selectedOrgUnitId[0])
				},
				stampIn : tsIn,
				stampOut : tsOut,
				dateIn : date,
				dateOut : date,
				roundedInTime : null,
				roundedOutTime : null
		}
		
		console.log(worktime);
		
		var wt;
		DAO.saveWorkTime(worktime,tr,_handleSaveResponse);
		
	}
	
	function _handleSaveResponse(status,wt,tr){
		var cell;
		if(status==DAO.STATUS.DONE){
			console.log(wt);
			$(tr).attr('data-id',wt.id);
			
			if(wt.stampIn){
				cell=$(tr).find('td').eq(4);
				$(cell).attr('data-ts',wt.stampIn);
				$(cell).find('input').val(Util.getTimeFromDate(new Date(wt.stampIn)));
			}
			
			if(wt.stampOut){
				cell=$(tr).find('td').eq(5);
				$(cell).attr('data-ts',wt.stampOut);
				$(cell).find('input').val(Util.getTimeFromDate(new Date(wt.stampOut)));
			}
			
			if(wt.roundedInTime){
				cell=$(tr).find('td').eq(6);
				$(cell).text(Util.getTimeHHmm(wt.roundedInTime));
			}
			
			if(wt.roundedOutTime){
				cell=$(tr).find('td').eq(7);
				$(cell).text(Util.getTimeHHmm(wt.roundedOutTime));
			}
			
			cell=$(tr).find('td').eq(8);
			$(cell).attr('data-orgUnitId',wt.orgUnit.id);
			$(cell).text(wt.orgUnit.id+'/'+wt.orgUnit.costCenter.id);
			cell=$(tr).find('td').eq(9);
			$(cell).text(wt.changedByText);
			
		}
		else if(status==DAO.STATUS.FAIL){
			
		}
	}
	
	function _getOrgUnitCell(ou){
		var cell;
		if(ou){
			cell=$('<td class="cell-worktime-orgunit" data-orgUnitId="'+ou.id+'">'+ou.id+'/'+ou.costCenter.id+'</td>');
		}
		else{
			cell=$('<td class="cell-worktime-orgunit"></td>');
		}
		$(cell).click(_orgUnitCellListener);
		return cell;
	}
	
	function _orgUnitCellListener(e){
		selectedTimeRow=e.target.parentNode;
		orgUnitSelectDialog.show();
	}
	
	function _rowAddListener(e){
		var row=e.target.parentNode;
		var id=$(row).attr('data-id');
		if(id){
			console.log('add row '+id);
			var date=new Date($(row).find('td').eq(2).attr('data-date'));
			var newRow=_createEmptyWorkTimeRow(date);
			$(row).after(newRow);
		}
	}
	
	function _rowDelListener(e){
		var row=e.target.parentNode;
		var id=$(row).attr('data-id');
		if(id){
			console.log('del row '+id);
		}
	}
	
	function _showSchedules(eeId,periodStart,periodEnd){
		_clearSchedulesView();
		DAO.loadActiveSchedules(eeId,periodStart,periodEnd,function(status,schedules){
			if(status==DAO.STATUS.DONE){
				_createSchedulesView(schedules,periodStart,periodEnd);
			}
			else if(status==DAO.STATUS.NA){
				
			}
		});
	}
	
	function _clearSchedulesView(){
		$(tables.schedules+' > tbody').empty();
	}
	
	function _createSchedulesView(schedules,periodStart,periodEnd){
		var d=new Date(periodStart);
		var e=new Date(periodEnd);
		e.setDate(e.getDate()+1);
		var row;
		var schd;
		var tbody=$(tables.schedules+' > tbody');
		
		while(d < e){
			schd=schedules[Util.getFormattedDate(d)];
			if(schd){
				row=_createFilledScheduleRow(d,schd);
				tbody.append(row);
			}
			else{
				row=_createEmptyScheduleRow(d);
				tbody.append(row);
			}
			d.setDate(d.getDate()+1);
		}
	}
	
	function _createFilledScheduleRow(date,schedule){
		
		var row;
		var weekday;
		var rowClass;
		
		weekday=Util.getWeekday(date);
		if(weekday=="Sat" || weekday=="Sun"){
			rowClass="row-worktime-weekend";
		}
		else{
			rowClass="row-worktime-normal";
		}
		row=$('<tr class="'+rowClass+'" data-id="'+schedule.id+'" data-userId="'+schedule.userId+'"></tr>');
		$(row).append('<td class="cell-worktime-date" data-date="'+date+'">'+Util.getFormattedDate(date)+'</td>');
		$(row).append('<td class="cell-worktime-day">'+weekday+'</td>');
		$(row).append('<td>'+Util.getTimeHHmm(schedule.start)+'-'+Util.getTimeHHmm(schedule.end)+'</td>');

		
		return row;
	}
	
	function _createEmptyScheduleRow(date){
		var row;
		var weekday;
		var rowClass;
		
		weekday=Util.getWeekday(date);
		if(weekday=="Sat" || weekday=="Sun"){
			rowClass="row-worktime-weekend";
		}
		else{
			rowClass="row-worktime-normal";
		}
		row=$('<tr class="'+rowClass+'"></tr>');
		$(row).append('<td class="cell-worktime-date" data-date="'+date+'">'+Util.getFormattedDate(date)+'</td>');
		$(row).append('<td class="cell-worktime-day">'+weekday+'</td>');
		$(row).append('<td></td>');
		
		return row;
	}
	
	return{
		init : init
	}
	
})();


class EmployeeList{
	
	constructor(table,clickEventListener){
		this.table=table;
		$(this._table+' > tbody').click(clickEventListener);
	}
	
	set table(val){
		this._table=val;
	}
	
	get table(){
		return this._table;
	}
	
	showEmployees(orgUnitId){
		var me=this;
		console.log('loading org unit '+orgUnitId);
		me._clearTable();
		DAO.loadEmployeesAssignedTo(orgUnitId,Util.getFormattedDate(new Date()),function(status,el){
			if(status==DAO.STATUS.DONE){
				console.log('got results');
				console.log(el);
				me._fillTable(el);
			}
			else if(status==DAO.STATUS.NA){
				console.log('no results');
			}
			else if(status==DAO.STATUS.FAIL){
				console.log('no results');
			}
		});
	}
	
	_fillTable(employees){
		var html='';
		for(var i=0;i<employees.length;i++){
			html+=this._addRow(employees[i]);
			console.log('appending row '+i);
		}
		$(this._table+' > tbody').append(html);
		
	}
	
	_clearTable(){
		$(this._table+' > tbody').empty();
	}
	
	_addRow(employee){
		var html='<tr data-userId="'+employee.id+'">\
			<td>'+employee.id+'</td>\
			<td>'+employee.firstName+'</td>\
			<td>'+employee.lastName+'</td>\
			</tr>';
		var tr=$(html);
		return html;
	}
}

class OrgUnitSelectDialog{
	
	constructor(selectListener){
		this.dialog='#org-unit-dialog';
		this._init(selectListener);
		this.orgTree=new OrgTree('#org-unit-dialog-tree',this._changeListener);
		console.log('dialog initialized...');
	}
	
	_init(selectListener){
		$(this.dialog).dialog({
			modal: true,
			autoOpen: false,
			buttons: [
				{
					text: 'OK',
					click: selectListener
				}
			]
		});
		
	}
	
	_changeListener(event){
		console.log('dialog tree value changed');
	}
	
	get selectedValue(){
		return this.orgTree.selectedValue;
	}
	
	show(){
		console.log('opening dialog...');
		$(this.dialog).dialog('open');
	}
	
	close(){
		$(this.dialog).dialog('close');
	}
	
}


class OrgTree{
	
	constructor(tree,changeHandler){
		this.tree=tree;
		this._loadTree();
		this._bindTreeChangeHandler(changeHandler);
	}
	
	set tree(val){
		this._tree=val;
	}
	
	get tree(){
		return this._tree;
	}
	
	get selectedValue(){
		return $(this._tree).jstree('get_selected');
	}
	
	_bindTreeChangeHandler(changeHandler){
		$(this._tree).on('changed.jstree', changeHandler);
	}
	
	_loadTree(){
		var treeData;
		var me=this;
		DAO.loadOrgTree(function(status,treeData){
			if(status==DAO.STATUS.DONE){
				me._fillTree(treeData);
			}
		});
	}
	
	_fillTree(treeData){
		$(this._tree).jstree({ 
			'core' : {
				'data' : treeData
			} 
		});
	}
}
