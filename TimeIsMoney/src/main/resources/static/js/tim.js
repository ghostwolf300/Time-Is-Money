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
		trHtml+='<tr>\
		<td>'+user.id+'</td>\
		<td>'+user.username+'</td>\
		<td>'+user.userPersonalSet[0].lastName+', '+user.userPersonalSet[0].firstName+'</td>\
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