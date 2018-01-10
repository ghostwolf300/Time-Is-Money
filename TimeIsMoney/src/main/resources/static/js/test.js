/**
 * 
 */

function getUser(userName){
	var url='/users/'+userName;
	$.getJSON(url,function(json){
		console.log(json);
		displayUser(json);
	});
}

function getAllUsers(){
	var url='/users';
	$.getJSON(url,function(json){
		console.log(json);
		displayUser(json);
	});
}

function displayUser(user){
	var trHtml='';
	$('#users-tbody').empty();
	trHtml+='<tr><td>'+user.userName+'</td><td>'+user.firstName+'</td><td>'+user.lastName+'</td><td>'+user.userRole+'</td><td>'+user.enabled+'</td></tr>'
	$('#users-tbody').append(trHtml);
}