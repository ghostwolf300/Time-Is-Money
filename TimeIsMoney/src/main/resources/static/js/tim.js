/**
 * 
 */

var csrf_header=$('meta[name="_csrf_header"]').attr('content');
var csrf_token=$('meta[name="_csrf"]').attr('content');

$(document).ready(initPage);

function initPage(){
	console.log('initializing page...'+$(document.body).data('viewId'));
	globalSetup();
	UserSearch.init();
	UserRecord.init();
	ScheduleEditor.init();
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
	
	return{
		STATUS : STATUS,
		NEW_ID : NEW_ID,
		test : test,
		findAllUsers : findAllUsers,
		delUser : delUser,
		loadOrgTree : loadOrgTree,
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
		saveAssignment : saveAssignment
	}
	
})();

var DateEffective=(function(){
	
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
	
	var controls={
			refresh : '#scheduler-period-refresh-button'
	}
	var fields={
			periodStart : '#scheduler-period-start',
			periodEnd : '#scheduler-period-end'
	}
	var headerRowDates='#schedule-editor-thead-row-dates';
	var headerRowWeekdays='#schedule-editor-thead-row-weekdays';
	var tbody='#schedule-editor-tbody';
	
	function init(){
		console.log('Initializing Module Schedule Editor');
		_bindEventHandlers();
	}
	
	function _bindEventHandlers(){
		$(tbody).click(_edit);
	}
	
	function _edit(event){
		console.log('Click table cell');
		var td=event.target;
		var tr=event.target.parentNode;
		//selected=$(tr).find('#user_id').text();
		alert($(td).text());
		
	}
	
	return{
		init : init
	}
	
})();
