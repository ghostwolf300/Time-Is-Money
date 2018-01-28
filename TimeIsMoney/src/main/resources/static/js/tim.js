/**
 * 
 */

var csrf_header=$('meta[name="_csrf_header"]').attr('content');
var csrf_token=$('meta[name="_csrf"]').attr('content');

$(document).ready(initPage);

function initPage(){
	console.log('initializing page...'+$(document.body).data('viewId'));
	globalSetup();
	UserRecord.init();
	UserRecord.setDefaultValues();
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

var UserRecord = (function(){
	
	function test(){
		DAO.test();
	}
	
	function init(){
		Personal.init();
		Contract.init();
		Assignment.init();
		Credentials.init();
		bindEventHandlers();
	}
	
	function bindEventHandlers(){
		
		$('#searchUsers').on('click',searchUsers);
		$('#searchResults-tbody').on('click',showUser);
		
		$('#userrecord-inactivate-button').on('click',inactivateUser);
		$('#userrecord-copy-button').on('click',copyUser);
		$('#userrecord-new-button').on('click',newUser);
		$('#userrecord-delete-button').on('click',deleteUser);
	}
	
	function setDefaultValues(){
		var currentDate=$.format.date(new Date($.now()),'yyyy-MM-dd')
		$('#searchKeyDate').val(currentDate);
	}
	
	function searchUsers(){
		
		DAO.findAllUsers(function(status,users){
			//console.log('DAO returned: '+status);
			if(status=='done'){
				console.log(users);
				displaySearchResults(users);
			}
		});
	}
	
	function displaySearchResults(users){
		var trHtml='';
		$('#searchResults-tbody').empty();
		$.each(users, function(i,up){
			trHtml+='<tr>\
			<td id="user_id">'+up.key.userId+'</td>\
			<td id="username">'+up.user.username+'</td>\
			<td id="name">'+up.lastName+', '+up.firstName+'</td>\
			</tr>'
		});
		$('#searchResults-tbody').append(trHtml);
	}
	
	function showUser(event){
		
		var tr=event.target.parentNode;
		var userId=$(tr).find('#user_id').text();
		var keyDate=$('#searchKeyDate').val();
		
		//console.log(keyDate);
		if(keyDate==null){
			keyDate=new Date();
		}
		
		Credentials.show(userId);
		Personal.showOnKeyDate(userId,keyDate);
		Contract.showOnKeyDate(userId,keyDate);
		Assignment.showOnKeyDate(userId,keyDate);
		
		//showCredentials(userId);
		//showRoles(userId);
		
		$('#userrecord').show();
		$('#userrecord-selected-text').empty();
		$('#userrecord-selected-text').append('ID: '+userId);
		$('#userrecord-selected').show();
	}
	
	function inactivateUser(){
		
	}
	
	function copyUser(){
		
	}
	
	function newUser(){
		
	}
	
	function deleteUser(){
		
	}
	
	return{
		test : test,
		init : init,
		setDefaultValues : setDefaultValues,
		showUser : showUser
	}
	
})();

var DAO = (function() {
	
	var STATUS={
		DONE : 'done',
		NA : 'na',
		UNKNOWN : 'unknown',
		FAIL : 'fail'
	}
	
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
		
		var url='/userrecord/show/'+userId+'/credentialsdetails/save';
		
		data=JSON.stringify(cred);
		
		$.ajax({
			url : url,
			method : "POST",
			data : data,
			dataType : "json"
		}).success(function(cred){
			
		}).done(function(cred){
			console.log(cred);
			_callback(STATUS.DONE);

		}).fail(function(){
			alert("ERROR: Couldn't save credentials details.");
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
		
		var url='/userrecord/show/'+userId+'/roledetails/save';
		
		data=JSON.stringify(roles);
		
		$.ajax({
			url : url,
			method : "POST",
			data : data,
			dataType : "json"
		}).success(function(ur){
			
		}).done(function(ur){
			console.log(ur);
			_callback(STATUS.DONE);
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
			_callback(STATUS.DONE);
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
			_callback(STATUS.DONE);
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
			_callback(STATUS.DONE);
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
		test : test,
		findAllUsers : findAllUsers,
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
		Personal.changed=true;
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
					userId : Personal.userId,
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
	
	function showOnKeyDate(userId,keyDate){
	
		var personal;
		Personal.userId=userId;
		Personal.changed=false;
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
		var pd=_getJSON();
		
		DAO.savePersonal(Personal.userId,pd,function(status){
			if(status==DAO.STATUS.DONE){
				//saved
				Personal.changed=false;
				$(fields.isChanged).empty();
			}
			else if(status==DAO.STATUS.FAIL){
				//save failed
			}
		});
		
	}
	
	function next(){
		
		var startDate=$(fields.startDate).val();
		var p;
		
		Personal.changed=false;
		_clear();
		
		DAO.loadNextPersonal(Personal.userId,startDate,function(status,p){
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
		
		Personal.changed=false;
		_clear();
		
		DAO.loadPrevPersonal(Personal.userId,startDate,function(status,p){
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
		
		Personal.changed=false;
		$(fields.isChanged).empty();
		
		var today=$.now();
		$(fields.startDate).val($.format.date(today, 'yyyy-MM-dd'));
		$(fields.endDate).val(null);
		$(fields.counter).text("New");
	}
	
	function newRec(){
		$(divs.content).show();
		$(divs.na).hide();
		
		Personal.changed=false;
		_clear();
		
		var today=$.now();
		$(fields.startDate).val($.format.date(today, 'yyyy-MM-dd'));
		$(fields.counter).text("New");
	}
	
	function del(){
		Personal.changed=false;
		$(fields.isChanged).empty();
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
		save : save
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
					userId : Contract.userId,
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
	
	function showOnKeyDate(userId,keyDate){
	
		var contract;
		Contract.userId=userId;
		Contract.changed=false;
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
		var c=_getJSON();
		
		DAO.saveContract(Contract.userId,c,function(status){
			if(status==DAO.STATUS.DONE){
				//saved
				Contract.changed=false;
				$(fields.isChanged).empty();
			}
			else if(status==DAO.STATUS.FAIL){
				//save failed
			}
		});
		
	}
	
	function next(){
		
		var startDate=$(fields.startDate).val();
		var c;
		
		Contract.changed=false;
		_clear();
		
		DAO.loadNextContract(Contract.userId,startDate,function(status,c){
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
		
		Contract.changed=false;
		_clear();
		
		DAO.loadPrevContract(Contract.userId,startDate,function(status,c){
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
		
		Contract.changed=false;
		$(fields.isChanged).empty();
		
		var today=$.now();
		$(fields.startDate).val($.format.date(today, 'yyyy-MM-dd'));
		$(fields.endDate).val(null);
		$(fields.counter).text("New");
	}
	
	function newRec(){
		$(divs.na).hide();
		$(divs.content).show();
		
		
		Contract.changed=false;
		_clear();
		
		var today=$.now();
		$(fields.startDate).val($.format.date(today, 'yyyy-MM-dd'));
		$(fields.counter).text("New");
	}
	
	function del(){
		Contract.changed=false;
		$(fields.isChanged).empty();
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
		save : save
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
		$(controls.del).on('click',del);
		$(controls.orgTree).on('click',_showOrgTree);
		
		$(fields.startDate).keyup(_changeHandler);
		$(fields.endDate).keyup(_changeHandler);
		
		$(fields.orgTree).on('changed.jstree', _orgTreeChangeHandler);
		
	}
	
	function _changeHandler(){
		Contract.changed=true;
		$(fields.isChanged).text('save changes');
	}
	
	function _orgTreeChangeHandler(e,data){
		var orgUnitId=data.selected;
		_addOrgUnitDetails(orgUnitId);
		Contract.changed=true;
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
					userId : Assignment.userId,
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
	
	function showOnKeyDate(userId,keyDate){
	
		var assignment;
		Assignment.userId=userId;
		Assignment.changed=false;
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
		var a=_getJSON();
		
		DAO.saveAssignment(Assignment.userId,a,function(status){
			if(status==DAO.STATUS.DONE){
				//saved
				Assignment.changed=false;
				$(fields.isChanged).empty();
			}
			else if(status==DAO.STATUS.FAIL){
				//save failed
			}
		});
		
	}
	
	function next(){
		
		var startDate=$(fields.startDate).val();
		var a;
		
		Assignment.changed=false;
		_clear();
		
		DAO.loadNextAssignment(Assignment.userId,startDate,function(status,a){
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
		
		Assignment.changed=false;
		_clear();
		
		DAO.loadPrevAssignment(Assignment.userId,startDate,function(status,a){
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
	
	return{
		init : init,
		isChanged : isChanged,
		showOnKeyDate : showOnKeyDate,
		next : next,
		prev : prev,
		copy : copy,
		newRec : newRec,
		del : del,
		save : save
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
			isChanged : '#userrecord-contract-isChanged'
	}
	
	var controls={
			newRecNA : '#userrecord-contract-na-new-button',
			save : '#userrecord-contract-save-button'	
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
		$(controls.newRecNA).on('click',newRec);
	}
	
	function _changeHandler(){
		Credentials.changed=true;
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
				if(cb.data('role_id')==r.userRoleKey.roleId){
					cb.prop('checked',true);
				}
			});
		}
	}
	
	function _getCredentialsJSON(){
		var cred={
				id : $(fields.id).val(),
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
				'userRoleKey' :{
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
	
	function show(userId){
	
		var cred;
		Credentials.userId=userId;
		Credentials.changed=false;
		_clearCredentials();
		_clearRoles();
		
		DAO.loadCredentials(this.userId,function(status,credentials){
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
		
		DAO.saveCredentials(this.userId,cred,function(status){
			if(status==DAO.STATUS.DONE){
				//saved
			}
			else if(status==DAO.STATUS.FAIL){
				//save failed
			}
		})
		
		var roles=_getRolesJSON(this.userId);
		
		DAO.saveRoles(this.userId,roles,function(status){
			if(status==DAO.STATUS.DONE){
				
			}
			else if(status==DAO.STATUS.FAIL){
				
			}
		});
		
	}
	
	function newRec(){
		
	}
	
	return{
		init : init,
		isChanged : isChanged,
		show : show,
		save : save
	}
	
})();
