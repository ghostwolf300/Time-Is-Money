/**
 * 
 */

function searchUsers(){
	var username=$('#freesearch').val();
	findUserByUsername(username);
}

function findUserByUsername(username){
	var url='/userrecord/search/'+username;
	$.getJSON(url,function(json){
		console.log(json);
	});
}

function findAllActive(){
	var url='/userrecord/search';
	$.getJSON(url,function(json){
		console.log(json);
	});
}

function displayUser(user){
	var trHtml='';
	$('#users-tbody').empty();
	trHtml+='<tr><td>'+user.userName+'</td><td>'+user.firstName+'</td><td>'+user.lastName+'</td><td>'+user.userRole+'</td><td>'+user.enabled+'</td></tr>'
	$('#users-tbody').append(trHtml);
}