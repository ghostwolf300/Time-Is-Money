/**
 * 
 */

$(document).ready(function(){
	/*ScheduleEditDialog.init();
	$('#schedule1').on('click',ScheduleEditDialog.edit);
	$('#schedule2').on('click',ScheduleEditDialog.edit);*/
});

function testApproach(){
	console.log('Testing module approach...');
	//console.log(Module);
	//console.log(Module.testLocal());
	//console.log(Module.testConnection());
	//Module.testConnection();
}

/*function initDialog(){
	$( "#schedule-edit-dialog" ).dialog({
		dialogClass :'no-close',
		autoOpen: false,
		buttons: [
			{
				text: 'OK',
				click: saveSchedule
			},
			{
				text: 'Cancel',
				click: cancelEdit
			}
		]
	});
}

function scheduleEdit(event){
	console.log('showing dialog...'+event.target);
	td=event.target;
	$('#schedule-edit-dialog').find('#start').val($(td).data('start'));
	$('#schedule-edit-dialog').find('#end').val($(td).data('end'));
	$('#schedule-edit-dialog').dialog('open');
}

function cancelEdit(){
	$('#schedule-edit-dialog').find('#start').val(null);
	$('#schedule-edit-dialog').find('#end').val(null);
	$('#schedule-edit-dialog').dialog( "close" );
}

function saveSchedule(event){
	console.log('saving schedule...');
	var start=$('#schedule-edit-dialog').find('#start').val();
	var end=$('#schedule-edit-dialog').find('#end').val();
	$(td).text(start+'-'+end);
	$(td).data('start',start);
	$(td).data('end',end);
	$('#schedule-edit-dialog').dialog( "close" );
}*/

/*var ScheduleEditDialog=(function(){
	
	const dialog='#schedule-edit-dialog';
	const fields={
			start : '#start',
			end : '#end'
	}
	
	var td;
	
	function init(){
		$(dialog).dialog({
			dialogClass :'no-close',
			autoOpen: false,
			buttons: [
				{
					text: 'OK',
					click: ScheduleEditDialog.save
				},
				{
					text: 'Cancel',
					click: ScheduleEditDialog.cancel
				}
			]
		});
	}
	
	function edit(event){
		console.log('showing dialog...'+event.target);
		td=event.target;
		$(dialog).find(fields.start).val($(td).attr('data-start'));
		$(dialog).find(fields.end).val($(td).attr('data-end'));
		$(dialog).dialog('open');
	}

	function cancel(){
		$(dialog).find(fields.start).val(null);
		$(dialog).find(fields.end).val(null);
		td=null;
		$(dialog).dialog( "close" );
	}

	function save(event){
		console.log('saving schedule...');
		var start=$(dialog).find(fields.start).val();
		var end=$(dialog).find(fields.end).val();
		$(td).text(start+'-'+end);
		$(td).attr('data-start',start);
		$(td).attr('data-end',end);
		$(dialog).dialog( "close" );
	}
	
	return{
		init : init,
		edit : edit,
		save : save,
		cancel : cancel
	}
	
})();*/



