/**
 * 
 */

$(document).ready(function(){
	$('#test-js-button').on('click',testApproach);
});

function testApproach(){
	console.log('Testing module approach...');
	var cred={};
	var userId=7;
	DAO.loadCredentials(userId,cred,function(status){
		console.log(status);
		console.log(cred);
		var roles;
		DAO.loadRoles(userId,roles,function(status){
			console.log(roles);
		});
	});
}

var UserRecord = (function(DAO){
	
	function bindEventHandlers(){
		
		$('#searchUsers').on('click',searchUsers);
		$('#searchResults-tbody').on('click',showUser);
		$('#showOrgTree').on('click',showOrgTree);
		$('#assignmentOrgTree').on('changed.jstree', function(e,data){
			orgTreeChanged(e, data);
		});
		
		$('#userrecord-save-credentials-button').on('click',saveCredentials);
		$('#userrecord-save-personal-button').on('click',savePersonal);
		$('#userrecord-save-contract-button').on('click',saveContract);
		$('#userrecord-save-assignment-button').on('click',saveAssignment);
		
		$('#userrecord-inactivate-button').on('click',inactivateUser);
		$('#userrecord-copy-button').on('click',copyUser);
		$('#userrecord-new-button').on('click',newUser);
		$('#userrecord-delete-button').on('click',deleteUser);
	}
	
	function searchUsers(){
		var users;
		DAO.findAllUsers(users,function(status){
			if(status=='done'){
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
	
	function showUser(){
		
	}
	
	function showOrgTree(){
		
	}
	
	function orgTreeChanged(){
		
	}
	
	function saveCredentials(){
		
	}
	
	function savePersonal(){
		
	}
	
	function saveContract(){
		
	}
	
	function saveAssignment(){
		
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
		bindEventHandlers : bindEventHandlers
	}
	
})(DAO);

var DAO = (function () {
	
	function loadCredentials(userId,cred,_callback){
		
		var url='/userrecord/show/'+userId+'/credentialsdetails';
		
		$.getJSON(url,function(user,statusText,jqxhr){

		}).done(function(user,statusText,jqxhr){
			console.log('done');
			if(jqxhr.status==200){
				console.log('record found. setting values '+user.id);
				this.cred=user;
				/*cred.id=user.id;
				cred.secondaryId=user.secondaryId;
				cred.username=user.username;
				cred.password=user.password;
				cred.enabled=user.enabled;
				cred.changedBy=user.changedBy;
				cred.changeTs=user.changeTs;*/
				console.log('values set... '+cred.id);
			}
			else if(jqxhr.status==204){
				console.log('no record found');
			}
			_callback('done');
		}).fail(function(){
			alert('Something went wrong...');
			_callback('fail')
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
			_callback('done');

		}).fail(function(){
			alert("ERROR: Couldn't save credentials details.");
			_callback('fail');
		}).always(function(){
			
		});
	}
	
	function loadRoles(userId,roles,_callback){
		
		var url='/userrecord/show/'+userId+'/roledetails';
		
		$.getJSON(url,function(roles){
			//console.log(roles);
		}).done(function(roles,statusText,jqxhr){
			console.log(roles);
			if(jqxhr.status==200){
				this.roles=roles;
			}
			else if(jqxhr.status==204){
				
			}
			_callback('done');
		}).fail(function(){
			_callback('fail');
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
			_callback('done');
		}).fail(function(){
			alert("ERROR: Couldn't save role details.");
			_callback('fail');
		}).always(function(){
			
		});
	}
	
	function loadPersonal(userId,keyDate,personal,_callback){
		
		var url='/userrecord/show/'+userId+'/personaldetails/?keyDate='+keyDate;
		
		$.getJSON(url,function(ud,statusText,jqxhr){
			
		}).done(function(ud,statusText,jqxhr){
			if(jqxhr.status==200){
				this.personal=ud;
			}
			else if(jqxhr.status==204){
				
			}
			_callback('done');
		}).fail(function(jqxhr, textStatus, error){
			_callback('fail');
		}).always(function(){
			
		});
	}
	
	function loadNextPersonal(userId,keyDate,personal,_callback){
		
		var url='/userrecord/show/'+userId+'/personaldetails/next?keyDate='+keyDate;
		
		$.getJSON(url,function(ud,statusText,jqxhr){
			
		}).done(function(ud,statusText,jqxhr){
			if(jqxhr.status==200){
				this.personal=ud;
			}
			else if(jqxhr.status==204){
				
			}
			_callback('done');
		}).fail(function(){
			_callback('fail');
		}).always(function(){
			
		});
	}
	
	function loadPrevPersonal(userId,keyDate,personal,_callback){
		
		var url='/userrecord/show/'+userId+'/personaldetails/prev?keyDate='+keyDate;
		
		$.getJSON(url,function(ud,statusText,jqxhr){
			
		}).done(function(ud,statusText,jqxhr){
			if(jqxhr.status==200){
				this.personal=ud;
			}
			else if(jqxhr.status==204){
				
			}
			_callback('done');
		}).fail(function(){
			_callback('fail');
		}).always(function(){
			
		});
	}
	
	function savePersonal(userId,personal,_callback){
		
		var url='/userrecord/show/'+userId+'/personaldetails/save';
		
		data=JSON.stringify(personal);
		
		$.ajax({
			url : url,
			method : "POST",
			data : data,
			dataType : "json"
		}).done(function(pers){
			_callback('done');
		}).fail(function(){
			alert("ERROR: Couldn't save personal details.");
			_callback('fail');
		}).always(function(){
			
		});
	} 
	
	function loadContract(userId,keyDate,contract,_callback){
		
		var url='/userrecord/show/'+userId+'/contractdetails/?keyDate='+keyDate;
		
		$.getJSON(url,function(ctrc,statusText,jqxhr){
			
		}).done(function(ctrc,statusText,jqxhr){
			if(jqxhr.status==200){
				this.contract=ctrc;
			}
			else if(jqxhr.status==204){
				
			}
			_callback('done');
		}).fail(function(jqxhr, textStatus, error){
			_callback('fail');
		}).always(function(){
			
		});
	}
	
	function loadNextContract(userId,keyDate,contract,_callback){
		
		var url='/userrecord/show/'+userId+'/contractdetails/next?keyDate='+keyDate;
		
		$.getJSON(url,function(ctrc,statusText,jqxhr){
			
		}).done(function(ctrc,statusText,jqxhr){
			if(jqxhr.status==200){
				this.contract=ctrc;
			}
			else if(jqxhr.status==204){
				
			}
			_callback('done');
		}).fail(function(){
			_callback('fail');
		}).always(function(){
			
		});
	}
	
	function loadPrevContract(userId,keyDate,contract,_callback){
		
		var url='/userrecord/show/'+userId+'/contractdetails/prev?keyDate='+keyDate;
		
		$.getJSON(url,function(ctrc,statusText,jqxhr){
			
		}).done(function(ctrc,statusText,jqxhr){
			if(jqxhr.status==200){
				this.contract=ctrc;
			}
			else if(jqxhr.status==204){
				
			}
			_callback('done');
		}).fail(function(){
			_callback('fail');
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
			_callback('done');
		}).fail(function(){
			alert("ERROR: Couldn't save contract details.");
			_callback('fail');
		}).always(function(){
			
		});
	}
	
	function loadAssignment(userId,keyDate,assignment,_callback){
		
		var url='/userrecord/show/'+userId+'/assignmentdetails/?keyDate='+keyDate;
		
		$.getJSON(url,function(asgn,statusText,jqxhr){
			
		}).done(function(asgn,statusText,jqxhr){
			if(jqxhr.status==200){
				this.assignment=asgn;
			}
			else if(jqxhr.status==204){
				
			}
			_callback('done');
		}).fail(function(jqxhr, textStatus, error){
			_callback('fail');
		}).always(function(){
			
		});
	}
	
	function loadNextAssignment(userId,keyDate,assignment,_callback){
		
		var url='/userrecord/show/'+userId+'/assignmentdetails/next?keyDate='+keyDate;
		
		$.getJSON(url,function(asgn,statusText,jqxhr){
			
		}).done(function(asgn,statusText,jqxhr){
			if(jqxhr.status==200){
				this.assignment=asgn;
			}
			else if(jqxhr.status==204){
				
			}
			_callback('done');
		}).fail(function(){
			_callback('fail');
		}).always(function(){
			
		});
	}
	
	function loadPrevAssignment(userId,keyDate,assignment,_callback){
		
		var url='/userrecord/show/'+userId+'/assignmentdetails/prev?keyDate='+keyDate;
		
		$.getJSON(url,function(asgn,statusText,jqxhr){
			
		}).done(function(asgn,statusText,jqxhr){
			if(jqxhr.status==200){
				this.assignment=asgn;
			}
			else if(jqxhr.status==204){
				
			}
			_callback('done');
		}).fail(function(){
			_callback('fail');
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
			_callback('done');
		}).fail(function(){
			alert("ERROR: Couldn't save assignment details.");
			_callback('fail');
		}).always(function(){
			
		});
	}
	
	function findAllUsers(users,_callback){
		
		var url='/userrecord/search/';
		
		$.getJSON(url,function(users,statusText,jqxhr){
			
		}).done(function(users,statusText,jqxhr){
			if(jqxhr.status==200){
				this.users=users;
			}
			else if(jqxhr.status==204){
				
			}
			_callback('done');
		}).fail(function(){
			_callback('fail');
		}).always(function(){
			
		});
	}
	
	return{
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

