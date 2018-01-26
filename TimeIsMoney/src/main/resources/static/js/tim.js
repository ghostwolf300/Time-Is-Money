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
		bindEventHandlers();
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
		
		//showPersonalOnKeyDate(userId,keyDate);
		Personal.showOnKeyDate(userId,keyDate);
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
		var userId=$('#id').val();
		
		DAO.saveCredentials(userId,u,function(status){
			if(status==DAO.STATUS.DONE){
				//saved
			}
			else if(status==DAO.STATUS.FAIL){
				//save failed
			}
		})
		
		var roles=_getRoles(userId);
		
		DAO.saveRoles(userId,roles,function(status){
			if(status==DAO.STATUS.DONE){
				
			}
			else if(status==DAO.STATUS.FAIL){
				
			}
		});
		
	}
	
	function saveContract(){
		var contract=_getContract();
		var userId=$('#id').val();
		
		DAO.saveContract(userId,contract,function(status){
			if(status==DAO.STATUS.DONE){
				
			}
			else if(status==DAO.STATUS.FAIL){
				
			}
		});
	}
	
	function newContract(){
		$('#usercontract_record').show();
		$('#usercontract_noRecordFound').hide();
		
		_clearAssignment();
		var today=$.now();
		$('#contractStartDate').val($.format.date(today, 'yyyy-MM-dd'));
		$('#userrecord-contract-counter').append("New");
	}
	
	function copyContract(){
		
	}
	
	function deleteContract(){
		
	}
	
	function saveAssignment(){
		var assignment=_getAssignment();
		var userId=$('#id').val();
		
		DAO.saveAssignment(userId,assignment,function(status){
			if(status==DAO.STATUS.DONE){
				
			}
			else if(status==DAO.STATUS.FAIL){
				
			}
		});
		
	}
	
	function newAssignment(){
		$('#userassignment_record').show();
		$('#userassignment_noRecordFound').hide();
		
		_clearAssignment();
		var today=$.now();
		$('#assignmentStartDate').val($.format.date(today, 'yyyy-MM-dd'));
		$('#userrecord-assignment-counter').append("New");
	}
	
	function copyAssignment(){
		
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
	}
	
	function _fill(p){
		
		$('#userpersonal_record').show();
		$('#userpersonal_noRecordFound').hide();
		
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
		_clear();
		
		DAO.loadPersonal(userId,keyDate,function(status,personal){
			
			console.log('Module Personal, DAO returned : '+status);
			if(status==DAO.STATUS.DONE){
				_fill(personal);
			}
			else if(status==DAO.STATUS.NA){
				$('#userpersonal_record').hide();
				$('#userpersonal_noRecordFound').show();
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
			}
			else if(status==DAO.STATUS.FAIL){
				//save failed
			}
		});
	}
	
	function next(){
		
		var startDate=$(fields.startDate).val();
		var p;
		
		_clear();
		
		DAO.loadNextPersonal(Personal.userId,startDate,function(status,p){
			if(status==DAO.STATUS.DONE){
				_fill(p);
			}
			else if(status==DAO.STATUS.NA){
				$('#userpersonal_record').hide();
				$('#userpersonal_noRecordFound').show();
			}
			else if(status==DAO.STATUS.FAIL){
				
			}
		});
	}
	
	function prev(){
		var startDate=$(fields.startDate).val();
		var p;
		
		_clear();
		
		DAO.loadPrevPersonal(Personal.userId,startDate,function(status,p){
			if(status==DAO.STATUS.DONE){
				_fill(p);
			}
			else if(status==DAO.STATUS.NA){
				$('#userpersonal_record').hide();
				$('#userpersonal_noRecordFound').show();
			}
			else if(status==DAO.STATUS.FAIL){
				
			}
		});
	}
	
	function copy(){
		$('#userpersonal_record').show();
		$('#userpersonal_noRecordFound').hide();
		
		var today=$.now();
		$(fields.startDate).val($.format.date(today, 'yyyy-MM-dd'));
		$(fields.endDate).val(null);
		$(fields.counter).text("New");
	}
	
	function newRec(){
		$('#userpersonal_record').show();
		$('#userpersonal_noRecordFound').hide();
		
		_clear();
		var today=$.now();
		$(fields.startDate).val($.format.date(today, 'yyyy-MM-dd'));
		$(fields.counter).text("New");
	}
	
	function del(){
		
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

