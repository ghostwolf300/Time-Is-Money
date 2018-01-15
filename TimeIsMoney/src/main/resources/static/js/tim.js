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
	$.each(users, function(i,user){
		records=user.personalRecords;
		rec=records[Object.keys(records)[0]];
		trHtml+='<tr>\
		<td>'+user.id+'</td>\
		<td>'+user.username+'</td>\
		<td>'+rec.lastName+', '+rec.firstName+'</td>\
		<td><input type="button" value="Show..." onclick="showUser('+user.id+')"/></td>\
		</tr>'
	});
	$('#searchResults-tbody').append(trHtml);
}

function showUser(userId){
	showPersonalDetails(userId);
}

function showPersonalDetails(userId){
	var url='/userrecord/show/'+userId+'/personaldetails';
	$.getJSON(url,function(userDetails){
		console.log(userDetails);
		$('#personalStartDate').val(userDetails.startDate);
		$('#personalEndDate').val(userDetails.endDate);
		$('#firstName').val(userDetails.firstName);
		$('#middleName').val(userDetails.middleName);
		$('#lastName').val(userDetails.lastName);
		$('#birthDate').val(userDetails.birthDate);
		$('#phone').val(userDetails.phone);
		$('#email').val(userDetails.email);
		$('#userName').val(userDetails.user.username);
		$('#password').val(userDetails.user.password);
		$('#enabled').attr("checked").val(userDetails.user.enabled);
		
	});
}

function showContractDetails(userId){
	var url='/userrecord/show/'+userId+'/contractdetails';
	$.getJSON(url,function(contractDetails){
		console.log(contractDetails);
	});
}

function showCredentialsDetails(userId){
	var url='/userrecord/show/'+userId+'/credentialsdetails';
	$.getJSON(url,function(credentialsDetails){
		console.log(credentialsDetails);
	});
}

function showRolesDetails(userId){
	var url='/userrecord/show/'+userId+'/rolessdetails';
	$.getJSON(url,function(rolesDetails){
		console.log(rolesDetails);
	});
}