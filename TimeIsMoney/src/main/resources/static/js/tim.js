/**
 * 
 */

var csrf_header=$('meta[name="_csrf_header"]').attr('content');
var csrf_token=$('meta[name="_csrf"]').attr('content');

$(document).ready(initPage);

function initPage(){
	console.log('initializing page...'+$(document.body).data('viewId'));
	globalSetup();
	console.log(DAO.STATUS.DONE);
	UserRecord.bindEventHandlers();
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
	
	function bindEventHandlers(){
		
		$('#searchUsers').on('click',searchUsers);
		$('#searchResults-tbody').on('click',showUser);
		$('#showOrgTree').on('click',showOrgTree);
		/*$('#assignmentOrgTree').on('changed.jstree', function(e,data){
			orgTreeChanged(e, data);
		})*/;
		$('#assignmentOrgTree').on('changed.jstree', orgTreeChanged);
			
		
		$('#userrecord-credentials-save-button').on('click',saveCredentials);
		
		$('#userrecord-personal-save-button').on('click',savePersonal);
		$('#userrecord-personal-next-button').on('click',showPersonalNext);
		$('#userrecord-personal-prev-button').on('click',showPersonalPrev);
		$('#userrecord-personal-new-button').on('click',newPersonal);
		$('#userrecord-personal-del-button').on('click',deletePersonal);
		
		$('#userrecord-contract-save-button').on('click',saveContract);
		$('#userrecord-contract-next-button').on('click',showContractNext);
		$('#userrecord-contract-prev-button').on('click',showContractPrev);
		$('#userrecord-contract-new-button').on('click',newContract);
		$('#userrecord-contract-del-button').on('click',deleteContract);
		
		$('#userrecord-assignment-save-button').on('click',saveAssignment);
		$('#userrecord-assignment-next-button').on('click',showAssignmentNext);
		$('#userrecord-assignment-prev-button').on('click',showAssignmentPrev);
		$('#userrecord-assignment-new-button').on('click',newAssignment);
		$('#userrecord-assignment-del-button').on('click',deleteAssignment);
		
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
		
		showPersonalOnKeyDate(userId,keyDate);
		showContractOnKeyDate(userId,keyDate);
		showAssignmentOnKeyDate(userId,keyDate);
		showCredentials(userId);
		showRoles(userId);
		
		$('#userrecord').show();
		$('#userrecord-selected-text').empty();
		$('#userrecord-selected-text').append('ID: '+userId);
		$('#userrecord-selected').show();
	}
	
	function _addUsernameToElement(userId,elementId){
		var url='/userrecord/show/'+userId+'/credentialsdetails';
		$(elementId).empty();
		$.getJSON(url,function(u){
			$(elementId).append(u.username);
		});
	}
	
	function _addOrgUnitDetails(orgUnitId){
		var url='/organisation/?id='+orgUnitId;
		
		$.getJSON(url,function(ou){
			console.log(ou);
			$('#orgUnitId').val(ou.id);
			$('#orgUnitName').val(ou.name);
			if(ou.costCenter!=null){
				$('#costCenterId').val(ou.costCenter.id);
				$('#costCenterName').val(ou.costCenter.name);
			}
			else{
				$('#costCenterId').val('N/A');
				$('#costCenterName').val('N/A');
			}
		}).done(function(ou){
			
		}).fail(function(ou){
			
		});
	}
	
	function showPersonalOnKeyDate(userId,keyDate){
		
		var personal;
		
		_clearPersonal();
		
		DAO.loadPersonal(userId,keyDate,function(status,personal){
			
			console.log('DAO returned : '+status);
			if(status==DAO.STATUS.DONE){
				console.log(personal.firstName);
				_fillPersonal(personal);
			}
			else if(status==DAO.STATUS.NA){
				console.log('no results. hiding div...');
				$('#userpersonal_record').hide();
				$('#userpersonal_noRecordFound').show();
			}
			else if(status==DAO.STATUS.FAIL){
				
			}
		});
	}
	
	function showPersonalNext(){
		
		var startDate=$('#personalStartDate').val();
		var userId=$('#id').val();
		var personal;
		
		_clearPersonal();
		
		DAO.loadNextPersonal(userId,startDate,function(status,personal){
			if(status==DAO.STATUS.DONE){
				_fillPersonal(personal);
			}
			else if(status==DAO.STATUS.NA){
				$('#userpersonal_record').hide();
				$('#userpersonal_noRecordFound').show();
			}
			else if(status==DAO.STATUS.FAIL){
				
			}
		});
	}
	
	function showPersonalPrev(){
		var startDate=$('#personalStartDate').val();
		var userId=$('#id').val();
		var personal;
		
		_clearPersonal();
		
		DAO.loadPrevPersonal(userId,startDate,function(status,personal){
			if(status==DAO.STATUS.DONE){
				_fillPersonal(personal);
			}
			else if(status==DAO.STATUS.NA){
				$('#userpersonal_record').hide();
				$('#userpersonal_noRecordFound').show();
			}
			else if(status==DAO.STATUS.FAIL){
				
			}
		});
	}
	
	function _clearPersonal(){
		$('#personalStartDate').val(null);
		$('#personalEndDate').val(null);
		$('#firstName').val(null);
		$('#middleName').val(null);
		$('#lastName').val(null);
		$('#birthDate').val(null);
		$('#phone').val(null);
		$('#email').val(null);
		$('#personalChangedTs').empty();
		$('#userrecord-personal-counter').empty();
	}
	
	function _fillPersonal(personal){
		$('#userpersonal_record').show();
		$('#userpersonal_noRecordFound').hide();
		
		$('#personalStartDate').val(personal.key.startDate);
		$('#personalEndDate').val(personal.endDate);
		$('#firstName').val(personal.firstName);
		$('#middleName').val(personal.middleName);
		$('#lastName').val(personal.lastName);
		$('#birthDate').val(personal.birthDate);
		$('#phone').val(personal.phone);
		$('#email').val(personal.email);
		var ts=$.format.date(new Date(personal.changeTs),'dd.MM.yyyy hh:mm');
		$('#personalChangedTs').append(ts);
		$('#userrecord-personal-counter').append(personal.currentRecord+'/'+personal.totalRecords);
		
		_addUsernameToElement(personal.key.userId,'#personalChangedBy');
		
		$('#userrecord-personal-next-button').prop('disabled',false);
		$('#userrecord-personal-prev-button').prop('disabled',false);

		if(personal.currentRecord==personal.totalRecords && personal.totalRecords==1){
			$('#userrecord-personal-next-button').prop('disabled',true);
			$('#userrecord-personal-prev-button').prop('disabled',true);
		}
		else if(personal.currentRecord==personal.totalRecords){
			$('#userrecord-personal-next-button').prop('disabled',true);
		}
		else if(personal.currentRecord==1){
			$('#userrecord-personal-prev-button').prop('disabled',true);
		}
	}
	
	function showContractOnKeyDate(userId,keyDate){
		
		var contract;
		_clearContract();
		
		DAO.loadContract(userId,keyDate,function(status,contract){
			if(status==DAO.STATUS.DONE){
				_fillContract(contract);
			}
			else if(status==DAO.STATUS.NA){
				$('#usercontract_record').hide();
				$('#usercontract_noRecordFound').show();
			}
			else if(status==DAO.STATUS.FAIL){
				
			}
		});
	}
	
	function showContractNext(){
		
		var startDate=$('#contractStartDate').val();
		var userId=$('#id').val();
		var contract;
		
		_clearContract();
		
		DAO.loadNextContract(userId,startDate,function(status,contract){
			if(status==DAO.STATUS.DONE){
				_fillContract(contract);
			}
			else if(status==DAO.STATUS.NA){
				$('#usercontract_record').hide();
				$('#usercontract_noRecordFound').show();
			}
			else if(status==DAO.STATUS.FAIL){
				
			}
		});
	}
	
	function showContractPrev(){
		var startDate=$('#contractStartDate').val();
		var userId=$('#id').val();
		var contract;
		
		_clearContract();
		
		DAO.loadPrevContract(userId,startDate,function(status,contract){
			if(status==DAO.STATUS.DONE){
				_fillContract(contract);
			}
			else if(status==DAO.STATUS.NA){
				$('#usercontract_record').hide();
				$('#usercontract_noRecordFound').show();
			}
			else if(status==DAO.STATUS.FAIL){
				
			}
		});
	}
	
	function _clearContract(){
		$('#contractStartDate').val(null);
		$('#contractEndDate').val(null);
		$('#contractType').val(null);
		$('#minHours').val(null);
		$('#maxHours').val(null);
		$('#contractChangedTs').empty();
		$('#userrecord-contract-counter').empty();
	}
	
	function _fillContract(cd){
		$('#usercontract_record').show();
		$('#usercontract_noRecordFound').hide();
		
		$('#contractStartDate').val(cd.key.startDate);
		$('#contractEndDate').val(cd.endDate);
		$('#contractType').val(cd.contractType.id);
		$('#minHours').val(cd.minHours);
		$('#maxHours').val(cd.maxHours);
		var ts=$.format.date(new Date(cd.changeTs),'dd.MM.yyyy hh:mm');
		$('#contractChangedTs').append(ts);
		$('#userrecord-contract-counter').append(cd.currentRecord+'/'+cd.totalRecords);
		
		_addUsernameToElement(cd.key.userId,'#contractChangedBy');
		
		$('#userrecord-contract-next-button').prop('disabled',false);
		$('#userrecord-contract-prev-button').prop('disabled',false);

		if(cd.currentRecord==cd.totalRecords && cd.totalRecords==1){
			$('#userrecord-contract-next-button').prop('disabled',true);
			$('#userrecord-contract-prev-button').prop('disabled',true);
		}
		else if(cd.currentRecord==cd.totalRecords){
			$('#userrecord-contract-next-button').prop('disabled',true);
		}
		else if(cd.currentRecord==1){
			$('#userrecord-contract-prev-button').prop('disabled',true);
		}
	}
	
	function showAssignmentOnKeyDate(userId,keyDate){
		var assignment;
		_clearAssignment();
		
		DAO.loadAssignment(userId,keyDate,function(status,assignment){
			if(status==DAO.STATUS.DONE){
				_fillAssignment(assignment);
			}
			else if(status==DAO.STATUS.NA){
				$('#userassignment_record').hide();
				$('#userassignment_noRecordFound').show();
			}
			else if(status==DAO.STATUS.FAIL){
				
			}
		});
	}
	
	function showAssignmentNext(){
		var startDate=$('#assignmentStartDate').val();
		var userId=$('#id').val();
		var assignment;
		
		_clearAssignment();
		
		DAO.loadNextAssignment(userId,startDate,function(status,assignment){
			if(status==DAO.STATUS.DONE){
				_fillAssignment(assignment);
			}
			else if(status==DAO.STATUS.NA){
				$('#userassignment_record').hide();
				$('#userassignment_noRecordFound').show();
			}
			else if(status==DAO.STATUS.FAIL){
				
			}
		});
	}
	
	function showAssignmentPrev(){
		var startDate=$('#assignmentStartDate').val();
		var userId=$('#id').val();
		var assignment;
		
		_clearAssignment();
		
		DAO.loadPrevAssignment(userId,startDate,function(status,assignment){
			if(status==DAO.STATUS.DONE){
				_fillAssignment(assignment);
			}
			else if(status==DAO.STATUS.NA){
				$('#userassignment_record').hide();
				$('#userassignment_noRecordFound').show();
			}
			else if(status==DAO.STATUS.FAIL){
				
			}
		});
	}
	
	function _clearAssignment(){
		$('#assignmentStartDate').val(null);
		$('#assignmentEndDate').val(null);
		$('#orgUnitId').val(null);
		$('#orgUnitName').val(null);
		$('#costCenterId').val(null);
		$('#costCenterName').val(null);
		$('#assignmentChangedTs').empty();
		$('#userrecord-assignment-counter').empty();
	}
	
	function _fillAssignment(ad){
		$('#userassignment_record').show();
		$('#userassignment_noRecordFound').hide();
		
		$('#assignmentStartDate').val(ad.key.startDate);
		$('#assignmentEndDate').val(ad.endDate);
		
		var ts=$.format.date(new Date(ad.changeTs),'dd.MM.yyyy hh:mm');
		$('#assignmentChangedTs').append(ts);
		$('#userrecord-assignment-counter').append(ad.currentRecord+'/'+ad.totalRecords);
		
		_addUsernameToElement(ad.key.userId,'#assignmentChangedBy');
		_addOrgUnitDetails(ad.orgUnit.id);
		
		$('#userrecord-assignment-next-button').prop('disabled',false);
		$('#userrecord-assignment-prev-button').prop('disabled',false);
		
		if(ad.currentRecord==ad.totalRecords && ad.totalRecords==1){
			$('#userrecord-assignment-next-button').prop('disabled',true);
			$('#userrecord-assignment-prev-button').prop('disabled',true);
		}
		else if(ad.currentRecord==ad.totalRecords){
			$('#userrecord-assignment-next-button').prop('disabled',true);
		}
		else if(ad.currentRecord==1){
			$('#userrecord-assignment-prev-button').prop('disabled',true);
		}
	}
	
	function showCredentials(userId){
		
		var credentials;
		_clearCredentials();
	
		DAO.loadCredentials(userId,function(status,credentials){
			if(status==DAO.STATUS.DONE){
				_fillCredentials(credentials);
				
			}
			else if(status==DAO.STATUS.NA){
				
			}
			else if(status==DAO.STATUS.FAIL){
				
			}
		});
		
		showRoles(userId);
		
	}
	
	function _clearCredentials(){
		$('#id').val(null);
		$('#secondaryId').val(null);
		$('#uname').val(null);
		$('#pword').val(null);
		$('#enabled').prop("checked",false);
		$('#credentialsChangedTs').empty();
		$('#credentialsChangedBy').empty();
	}
	
	function _fillCredentials(user){
		$('#id').val(user.id);
		$('#secondaryId').val(user.secondaryId);
		$('#uname').val(user.username);
		$('#pword').val(user.password);
		$('#enabled').prop("checked",user.enabled);
		var ts=$.format.date(new Date(user.changeTs),'dd.MM.yyyy hh:mm');
		$('#credentialsChangedTs').append(ts);
		_addUsernameToElement(user.changedBy,'#credentialsChangedBy');
	}
	
	function showRoles(userId){
		
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
	
	function _clearRoles(){
		$('#userrecord-roles').find('input[type="checkbox"]').each(function(){
			var cb=$(this);
			cb.prop('checked',false);
		});
	}
	
	function _fillRoles(roles){
		
		var r;
		var cb;
		
		console.log('checking roles...');
		
		for(var i=0;i<roles.length;i++){
			r=roles[i];
			$('#userrecord-roles').find('input[type="checkbox"]').each(function(){
				cb=$(this);
				if(cb.data('role_id')==r.userRoleKey.roleId){
					cb.prop('checked',true);
				}
			});
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
		$('#assignmentOrgTree').jstree({ 
			'core' : {
				'data' : data
			} 
		});
	}
	
	function _getCredentials(){
		var cred={
				id : $('#id').val(),
				secondaryId : $('#secondaryId').val(),
				username : $('#uname').val(),
				password : $('#pword').val(),
				enabled : $('#enabled').prop('checked')
		}
		return cred;
	}
	
	function _getRoles(userId){
		var roles=[];
		var roleId;
		
		$('#userrecord-roles input:checked').each(function(){
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
	
	function _getPersonal(){
		var pd={
				key : {
					userId : parseInt($('#id').val()),
					startDate : $('#personalStartDate').val()
				},
				endDate : $('#personalEndDate').val(),
				firstName : $('#firstName').val(),
				middleName : $('#middleName').val(),
				lastName : $('#lastName').val(),
				birthDate : $('#birthDate').val(),
				phone : $('#phone').val(),
				email : $('#email').val()
		}
		return pd;
	}
	
	function _getContract(){
		var cd={
				key : {
					userId : $('#id').val(),
					startDate : $('#contractStartDate').val()
				},
				endDate : $('#contractEndDate').val(),
				contractType : {
					id : $('#contractType').val(),
				},
				minHours : $('#minHours').val(),
				maxHours : $('#maxHours').val()
		}
		return cd;
	}
	
	function _getAssignment(){
		var ad={
				key : {
					userId : $('#id').val(),
					startDate : $('#assignmentStartDate').val()
				},
				endDate : $('#assignmentEndDate').val(),
				orgUnit : {
					id : $('#orgUnitId').val(),
				}
		}
		return ad;
	}
	
	function showOrgTree(){
		if($('#showOrgTree').data('treevisible')==true){
			$('#orgTreeDiv').hide();
			$('#showOrgTree').data('treevisible',false);
			$('#showOrgTree').val('Show Org. Tree');
		}
		else{
			_loadOrgTree();
			$('#orgTreeDiv').show();
			$('#showOrgTree').data('treevisible',true);
			$('#showOrgTree').val('Hide Org. Tree');
		}
	}
	
	function orgTreeChanged(e,data){
		var orgUnitId=data.selected;
		_addOrgUnitDetails(orgUnitId);
	}
	
	function saveCredentials(){
		var u=_getCredentials();
		
		DAO.saveCredentials(u,function(status){
			if(status==DAO.STATUS.DONE){
				//saved
			}
			else if(status==DAO.STATUS.FAIL){
				//save failed
			}
		})
		
		var roles=_getRoles(u.id);
		
		DAO.saveRoles(roles,function(status){
			if(status==DAO.STATUS.DONE){
				
			}
			else if(status==DAO.STATUS.FAIL){
				
			}
		});
		
	}
	
	function savePersonal(){
		
		var pd=_getPersonal();
		
		DAO.savePersonal(pd,function(status){
			if(status==DAO.STATUS.DONE){
				//saved
			}
			else if(status==DAO.STATUS.FAIL){
				//save failed
			}
		});
		
	}
	
	function newPersonal(){
		
	}
	
	function deletePersonal(){
		
	}
	
	function saveContract(){
		var contract=_getContract();
		
		DAO.saveContract(contract,function(status){
			if(status==DAO.STATUS.DONE){
				
			}
			else if(status==DAO.STATUS.FAIL){
				
			}
		});
	}
	
	function newContract(){
		
	}
	
	function deleteContract(){
		
	}
	
	function saveAssignment(){
		var assignment=_getAssignment();
		
		DAO.saveAssignment(assignment,function(status){
			if(status==DAO.STATUS.DONE){
				
			}
			else if(status==DAO.STATUS.FAIL){
				
			}
		});
		
	}
	
	function newAssignment(){
		
	}
	
	function deleteAssignment(){
		
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
		bindEventHandlers : bindEventHandlers,
		setDefaultValues : setDefaultValues,
		showUser : showUser,
		//getPersonal : getPersonal
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

/*function bindEventHandlers(){
	
	$('#searchUsers').on('click',searchUsers);
	//$('#searchResults-tbody').delegate('tr','click',testFunction);
	$('#searchResults-tbody').on('click',showUser);
	$('#showOrgTree').on('click',showAssignmentOrgTreeClick);
	$('#assignmentOrgTree').on('changed.jstree', function(e,data){
		assignmentOrgTreeChanged(e, data);
	});
	
	$('#userrecord-save-credentials-button').on('click',saveCredentialsRecord);
	$('#userrecord-save-personal-button').on('click',savePersonalRecord);
	$('#userrecord-save-contract-button').on('click',saveContractRecord);
	$('#userrecord-save-assignment-button').on('click',saveAssignmentRecord);
	
	$('#userrecord-inactivate-button').on('click',inactivateUser);
	$('#userrecord-copy-button').on('click',copyUser);
	$('#userrecord-new-button').on('click',newUser);
	$('#userrecord-delete-button').on('click',deleteUser);
}*/

/*function setDefaultValues(){
	var currentDate=$.format.date(new Date($.now()),'yyyy-MM-dd')
	$('#searchKeyDate').val(currentDate);
}*/

/*
function testFunction(event){
	
	var userId=$('#id').val();
	alert('Inactivate/Copy/New user: '+userId);
	
	
}

function newUser(){
	
	clearPersonalDetails();
	clearContractDetails();
	clearAssignmentDetails();
	clearCredentialsDetails();
	
	$('#userrecord-selected-text').text('New user');
}

function copyUser(){
	var userId=$('#id').val();
	$('#userrecord-selected-text').text('Copy of user '+userId);
}

function inactivateUser(){
	var userId=$('#id').val();
}

function deleteUser(){
	var userId=$('#id').val();
}

function searchUsers(){
	//var username=$('#freesearch').val();
	//findUserByUsername(username);
	findAll();
	$('#searchResults').show();
}

function findUserByUsername(username){
	var url='/userrecord/search/'+username;
	$.getJSON(url,function(users){
		console.log(users);
		displayResults(users);
	});
}

function findAll(){
	var url='/userrecord/search/';
	$.getJSON(url,function(users){
		console.log(users);
		displayResults(users);
	});
}

function displayResults(users){
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
	showPersonalDetails(userId,keyDate);
	showContractDetails(userId,keyDate);
	showAssignmentDetails(userId,keyDate);
	showCredentialsDetails(userId);
	showRolesDetails(userId);
	
	$('#userrecord').show();
	$('#userrecord-selected-text').empty();
	$('#userrecord-selected-text').append('ID: '+userId);
	$('#userrecord-selected').show();
}

function newPersonalRecord(){
	
	$('#userpersonal_record').show();
	$('#userpersonal_noRecordFound').hide();
	
	clearPersonalDetails();
	var today=$.now();
	$('#personalStartDate').val($.format.date(today, 'yyyy-MM-dd'));
	$('#personalDetailRecord').append("New");
}

function newContractRecord(){
	
	$('#usercontract_record').show();
	$('#usercontract_noRecordFound').hide();
	
	clearContractDetails();
	var today=$.now();
	$('#contractStartDate').val($.format.date(today, 'yyyy-MM-dd'));
	$('#contractDetailRecord').append("New");
}

function newAssignmentRecord(){
	
	$('#userassignment_record').show();
	$('#userassignment_noRecordFound').hide();
	
	clearAssignmentDetails();
	var today=$.now();
	$('#assignmentStartDate').val($.format.date(today, 'yyyy-MM-dd'));
	$('#assignmentDetailRecord').append("New");
}

function showPersonalDetails(userId,keyDate){
	
	clearPersonalDetails();
	
	var url='/userrecord/show/'+userId+'/personaldetails/?keyDate='+keyDate;
	
	$.getJSON(url,function(ud,statusText,jqxhr){
		if(jqxhr.status==200){
			//do something here... 
			//note: can't call outside this function. User "done" function if you want call
		}
		else if(jqxhr.status==204){
			//no results
		}
		
	}).done(function(ud,statusText,jqxhr){
		if(jqxhr.status==200){
			populatePersonalDetails(ud);
		}
		else if(jqxhr.status==204){
			//no results
			console.log('no results. hiding div...')
			$('#userpersonal_record').hide();
			$('#userpersonal_noRecordFound').show();
		}
	}).fail(function(jqxhr, textStatus, error){
		console.log('Search failed '+textStatus+': '+jqxhr.status);
	}).always(function(){
		
	});

}

function nextPersonalRecord(){
	
	var startDate=$('#personalStartDate').val();
	var userId=$('#id').val();
	var url='/userrecord/show/'+userId+'/personaldetails/next?keyDate='+startDate;
	
	clearPersonalDetails();
	
	$.getJSON(url,function(ud,statusText,jqxhr){
		if(jqxhr.status==200){
			//do something here... 
			//note: can't call outside this function. User "done" function if you want call
		}
		else if(jqxhr.status==204){
			//No results
		}
		
	}).done(function(ud,statusText,jqxhr){
		if(jqxhr.status==200){
			populatePersonalDetails(ud);
		}
		else if(jqxhr.status==204){
			//no results
			$('#userpersonal_record').hide();
			$('#userpersonal_noRecordFound').show();
		}
	});
	
}

function previousPersonalRecord(){
	
	var startDate=$('#personalStartDate').val();
	var userId=$('#id').val();
	var url='/userrecord/show/'+userId+'/personaldetails/prev?keyDate='+startDate;
	
	clearPersonalDetails();
	
	$.getJSON(url,function(ud,statusText,jqxhr){
		if(jqxhr.status==200){
			//do something here... 
			//note: can't call outside this function. User "done" function if you want call
		}
		else if(jqxhr.status==204){
			//no results
		}
	}).done(function(ud,statusText,jqxhr){
		if(jqxhr.status==200){
			populatePersonalDetails(ud);
		}
		else if(jqxhr.status==204){
			//no results
			$('#userpersonal_record').hide();
			$('#userpersonal_noRecordFound').show();
		}
	});
}

function savePersonalRecord(){
	
	var pd={
			key : {
				userId : $('#id').val(),
				startDate : $('#personalStartDate').val()
			},
			endDate : $('#personalEndDate').val(),
			firstName : $('#firstName').val(),
			middleName : $('#middleName').val(),
			lastName : $('#lastName').val(),
			birthDate : $('#birthDate').val(),
			phone : $('#phone').val(),
			email : $('#email').val()
	}
	
	console.log(pd);
	
	var url='/userrecord/show/'+pd.key.userId+'/personaldetails/save';
	
	data=JSON.stringify(pd);
	
	$.ajax({
		url : url,
		method : "POST",
		data : data,
		dataType : "json"
	}).success(function(up){
		//console.log('success: '+data.firstName);
	}).done(function(up){
		//console.log('done: '+data.changedBy);
		clearPersonalDetails();
		populatePersonalDetails(up);
	}).fail(function(){
		alert("ERROR: Couldn't save personal details.");
	}).always(function(){
		
	});
	
}

function clearPersonalDetails(){
	$('#personalStartDate').val(null);
	$('#personalEndDate').val(null);
	$('#firstName').val(null);
	$('#middleName').val(null);
	$('#lastName').val(null);
	$('#birthDate').val(null);
	$('#phone').val(null);
	$('#email').val(null);
	$('#personalChangedTs').empty();
	$('#personalDetailRecord').empty();
}

function populatePersonalDetails(ud){
	
	$('#userpersonal_record').show();
	$('#userpersonal_noRecordFound').hide();
	
	$('#personalStartDate').val(ud.key.startDate);
	$('#personalEndDate').val(ud.endDate);
	$('#firstName').val(ud.firstName);
	$('#middleName').val(ud.middleName);
	$('#lastName').val(ud.lastName);
	$('#birthDate').val(ud.birthDate);
	$('#phone').val(ud.phone);
	$('#email').val(ud.email);
	var ts=$.format.date(new Date(ud.changeTs),'dd.MM.yyyy hh:mm');
	$('#personalChangedTs').append(ts);
	$('#personalDetailRecord').append(ud.currentRecord+'/'+ud.totalRecords);
	
	addUsernameToElement(ud.key.userId,'#personalChangedBy');
	
	$('#nextPersonalDetail').prop('disabled',false);
	$('#prevPersonalDetail').prop('disabled',false);

	if(ud.currentRecord==ud.totalRecords && ud.totalRecords==1){
		$('#nextPersonalDetail').prop('disabled',true);
		$('#prevPersonalDetail').prop('disabled',true);
	}
	else if(ud.currentRecord==ud.totalRecords){
		$('#nextPersonalDetail').prop('disabled',true);
	}
	else if(ud.currentRecord==1){
		$('#prevPersonalDetail').prop('disabled',true);
	}
	
}

function showContractDetails(userId,keyDate){
	
	clearContractDetails();
	
	var url='/userrecord/show/'+userId+'/contractdetails/?keyDate='+keyDate;
	$.getJSON(url,function(cd,statusText,jqxhr){
		if(jqxhr.status==200){
			//do something here... 
			//note: can't call outside this function. User "done" function if you want call
		}
		else if(jqxhr.status==204){
			//No results
		}
		
	}).done(function(cd,statusText,jqxhr){
		if(jqxhr.status==200){
			populateContractDetails(cd);
		}
		else if(jqxhr.status==204){
			//no results
			$('#usercontract_record').hide();
			$('#usercontract_noRecordFound').show();
		}
	});
}

function nextContractRecord(){
	var startDate=$('#contractStartDate').val();
	var userId=$('#id').val();
	var url='/userrecord/show/'+userId+'/contractdetails/next?keyDate='+startDate;
	
	clearContractDetails();
	
	$.getJSON(url,function(cd,statusText,jqxhr){
		if(jqxhr.status==200){
			//do something here... 
			//note: can't call outside this function. User "done" function if you want call
		}
		else if(jqxhr.status==204){
			//no results
		}
		
	}).done(function(cd,statusText,jqxhr){
		if(jqxhr.status==200){
			populateContractDetails(cd);
		}
		else if(jqxhr.status==204){
			//no results
			$('#usercontract_record').hide();
			$('#usercontract_noRecordFound').show();
		}
	});
}

function previousContractRecord(){
	var startDate=$('#contractStartDate').val();
	var userId=$('#id').val();
	var url='/userrecord/show/'+userId+'/contractdetails/prev?keyDate='+startDate;
	
	clearContractDetails();
	
	$.getJSON(url,function(cd,statusText,jqxhr){
		if(jqxhr.status==200){
			//do something here... 
			//note: can't call outside this function. User "done" function if you want call
		}
		else if(jqxhr.status==204){
			//no results
		}
		
	}).done(function(cd,statusText,jqxhr){
		if(jqxhr.status==200){
			populateContractDetails(cd);
		}
		else if(jqxhr.status==204){
			//no results
			$('#usercontract_record').hide();
			$('#usercontract_noRecordFound').show();
		}
	});
	
}

function saveContractRecord(){
	
	var cd={
			key : {
				userId : $('#id').val(),
				startDate : $('#contractStartDate').val()
			},
			endDate : $('#contractEndDate').val(),
			contractType : {
				id : $('#contractType').val(),
			},
			minHours : $('#minHours').val(),
			maxHours : $('#maxHours').val()
	}
	
	console.log(cd);
	
	var url='/userrecord/show/'+cd.key.userId+'/contractdetails/save';
	
	data=JSON.stringify(cd);
	
	$.ajax({
		url : url,
		method : "POST",
		data : data,
		dataType : "json"
	}).success(function(cd){
		//console.log('success: '+data.firstName);
	}).done(function(cd){
		//console.log('done: '+data.changedBy);
		clearContractDetails();
		populateContractDetails(cd);
	}).fail(function(){
		alert("ERROR: Couldn't save contract details.");
	}).always(function(){
		
	});
	
}

function clearContractDetails(){
	$('#contractStartDate').val(null);
	$('#contractEndDate').val(null);
	$('#contractType').val(null);
	$('#minHours').val(null);
	$('#maxHours').val(null);
	$('#contractChangedTs').empty();
	$('#contractDetailRecord').empty();
}

function populateContractDetails(cd){
	
	$('#usercontract_record').show();
	$('#usercontract_noRecordFound').hide();
	
	$('#contractStartDate').val(cd.key.startDate);
	$('#contractEndDate').val(cd.endDate);
	$('#contractType').val(cd.contractType.id);
	$('#minHours').val(cd.minHours);
	$('#maxHours').val(cd.maxHours);
	var ts=$.format.date(new Date(cd.changeTs),'dd.MM.yyyy hh:mm');
	$('#contractChangedTs').append(ts);
	$('#contractDetailRecord').append(cd.currentRecord+'/'+cd.totalRecords);
	
	addUsernameToElement(cd.key.userId,'#contractChangedBy');
	
	$('#nextContractDetail').prop('disabled',false);
	$('#prevContractDetail').prop('disabled',false);

	if(cd.currentRecord==cd.totalRecords && cd.totalRecords==1){
		$('#nextContractDetail').prop('disabled',true);
		$('#prevContractDetail').prop('disabled',true);
	}
	else if(cd.currentRecord==cd.totalRecords){
		$('#nextContractDetail').prop('disabled',true);
	}
	else if(cd.currentRecord==1){
		$('#prevContractDetail').prop('disabled',true);
	}
	
}

function showAssignmentDetails(userId,keyDate){
	
	clearAssignmentDetails();
	
	var url='/userrecord/show/'+userId+'/assignmentdetails/?keyDate='+keyDate;
	$.getJSON(url,function(ad,statusText,jqxhr){
		if(jqxhr.status==200){
			//do something here... 
			//note: can't call outside this function. User "done" function if you want call
		}
		else if(jqxhr.status==204){
			//no results
		}
		
	}).done(function(ad,statusText,jqxhr){
		if(jqxhr.status==200){
			populateAssignmentDetails(ad);
		}
		else if(jqxhr.status==204){
			//no results
			$('#userassignment_record').hide();
			$('#userassignment_noRecordFound').show();
		}
	});
}

function nextAssignmentRecord(){
	var startDate=$('#assignmentStartDate').val();
	var userId=$('#id').val();
	var url='/userrecord/show/'+userId+'/assignmentdetails/next?keyDate='+startDate;
	
	clearAssignmentDetails();
	
	$.getJSON(url,function(ad,statusText,jqxhr){
		if(jqxhr.status==200){
			//do something here... 
			//note: can't call outside this function. User "done" function if you want call
		}
		else if(jqxhr.status==204){
			//no results
		}
		
	}).done(function(ad,statusText,jqxhr){
		if(jqxhr.status==200){
			populateAssignmentDetails(ad);
		}
		else if(jqxhr.status==204){
			//no results
			$('#userassignment_record').hide();
			$('#userassignment_noRecordFound').show();
		}
	});
}

function previousAssignmentRecord(){
	var startDate=$('#assignmentStartDate').val();
	var userId=$('#id').val();
	var url='/userrecord/show/'+userId+'/assignmentdetails/prev?keyDate='+startDate;
	
	clearAssignmentDetails();
	
	$.getJSON(url,function(ad,statusText,jqxhr){
		//console.log(ad);
		if(jqxhr.status==200){
			//do something here... 
			//note: can't call outside this function. User "done" function if you want call
		}
		else if(jqxhr.status==204){
			//no results
		}
		
	}).done(function(ad,statusText,jqxhr){
		if(jqxhr.status==200){
			populateAssignmentDetails(ad);
		}
		else if(jqxhr.status==204){
			//no results
			$('#userassignment_record').hide();
			$('#userassignment_noRecordFound').show();
		}
	});
	
}

function saveAssignmentRecord(){
	var ad={
			key : {
				userId : $('#id').val(),
				startDate : $('#assignmentStartDate').val()
			},
			endDate : $('#assignmentEndDate').val(),
			orgUnit : {
				id : $('#orgUnitId').val(),
			}
	}
	
	console.log(ad);
	
	var url='/userrecord/show/'+ad.key.userId+'/assignmentdetails/save';
	
	data=JSON.stringify(ad);
	
	$.ajax({
		url : url,
		method : "POST",
		data : data,
		dataType : "json"
	}).success(function(ad){
		//console.log('success: '+data.firstName);
	}).done(function(ad){
		//console.log('done: '+JSON.stringify(ad));
		clearAssignmentDetails();
		populateAssignmentDetails(ad);
		addOrgUnitDetails(ad.orgUnit.id);
	}).fail(function(){
		alert("ERROR: Couldn't save assignment details.");
	}).always(function(){
		
	});
}

function addOrgUnitDetails(orgUnitId){
	
	var url='/organisation/?id='+orgUnitId;
	
	$.getJSON(url,function(ou){
		console.log(ou);
		$('#orgUnitId').val(ou.id);
		$('#orgUnitName').val(ou.name);
		if(ou.costCenter!=null){
			$('#costCenterId').val(ou.costCenter.id);
			$('#costCenterName').val(ou.costCenter.name);
		}
		else{
			$('#costCenterId').val('N/A');
			$('#costCenterName').val('N/A');
		}
	}).done(function(ou){
		
	}).fail(function(ou){
		
	});
}

function clearAssignmentDetails(){
	$('#assignmentStartDate').val(null);
	$('#assignmentEndDate').val(null);
	$('#orgUnitId').val(null);
	$('#orgUnitName').val(null);
	$('#costCenterId').val(null);
	$('#costCenterName').val(null);
	$('#assignmentChangedTs').empty();
	$('#assignmentDetailRecord').empty();
} 

function populateAssignmentDetails(ad){
	
	$('#userassignment_record').show();
	$('#userassignment_noRecordFound').hide();
	
	$('#assignmentStartDate').val(ad.key.startDate);
	$('#assignmentEndDate').val(ad.endDate);
	
	var ts=$.format.date(new Date(ad.changeTs),'dd.MM.yyyy hh:mm');
	$('#assignmentChangedTs').append(ts);
	$('#assignmentDetailRecord').append(ad.currentRecord+'/'+ad.totalRecords);
	
	addUsernameToElement(ad.key.userId,'#assignmentChangedBy');
	addOrgUnitDetails(ad.orgUnit.id);
	
	$('#nextAssignmentDetail').prop('disabled',false);
	$('#prevAssignmentDetail').prop('disabled',false);
	
	if(ad.currentRecord==ad.totalRecords && ad.totalRecords==1){
		$('#nextAssignmentDetail').prop('disabled',true);
		$('#prevAssignmentDetail').prop('disabled',true);
	}
	else if(ad.currentRecord==ad.totalRecords){
		$('#nextAssignmentDetail').prop('disabled',true);
	}
	else if(ad.currentRecord==1){
		$('#prevAssignmentDetail').prop('disabled',true);
	}
	
}

function showCredentialsDetails(userId){
	
	clearCredentialsDetails();
	
	var url='/userrecord/show/'+userId+'/credentialsdetails';
	$.getJSON(url,function(user,statusText,jqxhr){
		
	}).done(function(user,statusText,jqxhr){
		if(jqxhr.status==200){
			populateCredentialsDetails(user);
		}
		else if(jqxhr.status==204){
			//no records found
		}
	}).fail(function(){
		alert('Something went wrong...');
	});
}

function getCredentials(){
	var cred={
			id : $('#id').val(),
			secondaryId : $('#secondaryId').val(),
			username : $('#uname').val(),
			password : $('#pword').val(),
			enabled : $('#enabled').prop('checked')
	}
	return cred;
}

function getRoles(userId){
	
	var roles=[];
	var roleId;
	
	$('#userrecord-roles input:checked').each(function(){
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

function clearCredentialsDetails(){
	$('#id').val(null);
	$('#secondaryId').val(null);
	$('#uname').val(null);
	$('#pword').val(null);
	$('#enabled').prop("checked",false);
	$('#credentialsChangedTs').empty();
	$('#credentialsChangedBy').empty();
}

function clearRolesDetails(){
	$('#userrecord-roles').find('input[type="checkbox"]').each(function(){
		var cb=$(this);
		cb.prop('checked',false);
	});
}

function populateCredentialsDetails(user){
	$('#id').val(user.id);
	$('#secondaryId').val(user.secondaryId);
	$('#uname').val(user.username);
	$('#pword').val(user.password);
	$('#enabled').prop("checked",user.enabled);
	var ts=$.format.date(new Date(user.changeTs),'dd.MM.yyyy hh:mm');
	$('#credentialsChangedTs').append(ts);
	addUsernameToElement(user.changedBy,'#credentialsChangedBy');
}

function populateRolesDetails(roles){
	
	var r;
	var cb;
	
	console.log('checking roles...');
	
	for(var i=0;i<roles.length;i++){
		r=roles[i];
		$('#userrecord-roles').find('input[type="checkbox"]').each(function(){
			cb=$(this);
			if(cb.data('role_id')==r.userRoleKey.roleId){
				cb.prop('checked',true);
			}
		});
	}
}

function showRolesDetails(userId){
	
	clearRolesDetails();
	
	var url='/userrecord/show/'+userId+'/roledetails';
	$.getJSON(url,function(roles){
		//console.log(roles);
	}).done(function(roles,statusText,jqxhr){
		console.log(roles);
		if(jqxhr.status==200){
			populateRolesDetails(roles);
		}
		else if(jqxhr.status==204){
			//no roles found
		}
	});
}

function saveCredentialsRecord(){
	
	var u=getCredentials();
	console.log(u);
	
	var url='/userrecord/show/'+u.id+'/credentialsdetails/save';
	
	data=JSON.stringify(u);
	
	$.ajax({
		url : url,
		method : "POST",
		data : data,
		dataType : "json"
	}).success(function(u){
		
	}).done(function(u){
		console.log(u);
		saveRoles();
		clearCredentialsDetails();
		populateCredentialsDetails(u);
		clearRolesDetails();
		populateRolesDetails()
	}).fail(function(){
		alert("ERROR: Couldn't save credentials details.");
	}).always(function(){
		
	});
}

function saveRoles(){
	
	var userId=parseInt($('#id').val());
	var roles=getRoles(userId);
	console.log(roles);
	
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
		
	}).fail(function(){
		alert("ERROR: Couldn't save role details.");
	}).always(function(){
		
	});
}

function addUsernameToElement(userId,elementId){
	
	var url='/userrecord/show/'+userId+'/credentialsdetails';
	$(elementId).empty();
	$.getJSON(url,function(u){
		$(elementId).append(u.username);
	});
	
}

function loadOrgTree(){

	var tree=null;
	var url='/organisation/tree'

	$.getJSON(url,function(tree,statusText,jqxhr){

	}).done(function(tree,statusText,jqxhr){
		if(jqxhr.status==200){
			console.log(tree);
			populateOrgTree(tree)
		}
	});
}

function populateOrgTree(data){
	
	$('#assignmentOrgTree').jstree({ 
		'core' : {
			'data' : data
		} 
	});
	
}

function showAssignmentOrgTreeClick(){
	
	console.log('showOrgTree click...');
	console.log('tree visible: '+$('#showOrgTree').data('treevisible'));
	if($('#showOrgTree').data('treevisible')==true){
		$('#orgTreeDiv').hide();
		$('#showOrgTree').data('treevisible',false);
		$('#showOrgTree').val('Show Org. Tree');
	}
	else{
		loadOrgTree();
		$('#orgTreeDiv').show();
		$('#showOrgTree').data('treevisible',true);
		$('#showOrgTree').val('Hide Org. Tree');
	}
}

function assignmentOrgTreeChanged(e, data){
	console.log(data.selected);
	
	var orgUnitId=data.selected;
	addOrgUnitDetails(orgUnitId);
}*/


