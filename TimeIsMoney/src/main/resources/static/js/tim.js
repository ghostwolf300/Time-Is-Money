/**
 * 
 */

function searchUsers(){
	//var username=$('#freesearch').val();
	//findUserByUsername(username);
	findAll();
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
		<td>'+up.userPersonalKey.userId+'</td>\
		<td>'+up.user.username+'</td>\
		<td>'+up.lastName+', '+up.firstName+'</td>\
		<td><input type="button" value="Show..." onclick="showUser('+up.userPersonalKey.userId+')"/></td>\
		</tr>'
	});
	$('#searchResults-tbody').append(trHtml);
}

function showUser(userId){
	showPersonalDetails(userId);
	showContractDetails(userId);
	showAssignmentDetails(userId);
	showCredentialsDetails(userId);
	showRolesDetails(userId);
}

function showPersonalDetails(userId){
	
	$('#personalStartDate').val(null);
	$('#personalEndDate').val(null);
	$('#firstName').val(null);
	$('#middleName').val(null);
	$('#lastName').val(null);
	$('#birthDate').val(null);
	$('#phone').val(null);
	$('#email').val(null);
	$('#personalChangedTs').empty();
	
	var url='/userrecord/show/'+userId+'/personaldetails';
	
	$.getJSON(url,function(ud){
		console.log(ud);
		$('#personalStartDate').val(ud.userPersonalKey.startDate);
		$('#personalEndDate').val(ud.endDate);
		$('#firstName').val(ud.firstName);
		$('#middleName').val(ud.middleName);
		$('#lastName').val(ud.lastName);
		$('#birthDate').val(ud.birthDate);
		$('#phone').val(ud.phone);
		$('#email').val(ud.email);
		var ts=$.format.date(new Date(ud.changeTs),'dd.MM.yyyy hh:mm');
		$('#personalChangedTs').append(ts);
		
	}).done(function(ud){
		addUsernameToElement(ud.changedBy,'#personalChangedBy');
	});

}

function showContractDetails(userId){
	
	$('#contractStartDate').val(null);
	$('#contractEndDate').val(null);
	$('#contractType').val(null);
	$('#minHours').val(null);
	$('#maxHours').val(null);
	$('#contractChangedTs').empty();
	
	var url='/userrecord/show/'+userId+'/contractdetails';
	$.getJSON(url,function(cd){
		console.log(cd);
		$('#contractStartDate').val(cd.userContractKey.startDate);
		$('#contractEndDate').val(cd.endDate);
		$('#contractType').val(cd.contractType.id);
		$('#minHours').val(cd.minHours);
		$('#maxHours').val(cd.maxHours);
		var ts=$.format.date(new Date(cd.changeTs),'dd.MM.yyyy hh:mm');
		$('#contractChangedTs').append(ts);
	}).done(function(cd){
		addUsernameToElement(cd.changedBy,'#contractChangedBy');
	});
}

function showAssignmentDetails(userId){
	var url='/userrecord/show/'+userId+'/assignmentdetails';
	$.getJSON(url,function(ad){
		console.log(ad);
	});
}

function showCredentialsDetails(userId){
	
	$('#id').val(null);
	$('#secondaryId').val(null);
	$('#uname').val(null);
	$('#pword').val(null);
	$('#enabled').prop("checked",false);
	$('#credentialsChangedTs').empty();
	
	var url='/userrecord/show/'+userId+'/credentialsdetails';
	$.getJSON(url,function(cd){
		console.log(cd);
		$('#id').val(cd.id);
		$('#secondaryId').val(cd.secondaryId);
		$('#uname').val(cd.username);
		$('#pword').val(cd.password);
		$('#enabled').prop("checked",cd.enabled);
		var ts=$.format.date(new Date(cd.changeTs),'dd.MM.yyyy hh:mm');
		$('#credentialsChangedTs').append(ts);
	}).done(function(cd){
		addUsernameToElement(cd.changedBy,'#credentialsChangedBy');
	});
}

function showRolesDetails(userId){
	var url='/userrecord/show/'+userId+'/roledetails';
	$.getJSON(url,function(roles){
		console.log(roles);
		$('#roles').find('input[type="checkbox"]').each(function(){
			var cb=$(this);
			cb.prop('checked',false);
		});
		
		$.each(roles, function(i,r){
			switch(r.role.id){
				case 1:
					$('#roleAdmin').prop('checked',true);
					break;
				case 2:
					$('#roleManager').prop('checked',true);
					break;
				case 3:
					$('#roleCoWorker').prop('checked',true);
					break;
				case 4:
					$('#roleShiftPlanner').prop('checked',true);
					break;
			}
		});
	});
}

function addUsernameToElement(userId,elementId){
	
	var url='/userrecord/show/'+userId+'/credentialsdetails';
	$(elementId).empty();
	$.getJSON(url,function(u){
		$(elementId).append(u.username);
	});
	
}