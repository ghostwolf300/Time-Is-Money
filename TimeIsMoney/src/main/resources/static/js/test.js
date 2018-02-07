/**
 * 
 */

$(document).ready(function(){
	$('#test-forecast').on('click',loadForecast);
	$('#test-js-button').on('click',testApproach);
	$('#get-tree-value-button').on('click',testTreeValue);
});

/*var test1;
var test2;

function testApproach(){
	console.log('Testing module approach...');
	var changeHandlerOne=function(){
		console.log('change one');
	}
	var changeHandlerTwo=function(){
		console.log('change two');
	}
	test1=new OrgTree('#mytree',changeHandlerOne);
	test2=new OrgTree('#myothertree',changeHandlerTwo);
}

function testTreeValue(){
	console.log(test1.selectedValue);
	console.log(test2.selectedValue);
}*/

function loadForecast(){
	var url='/forecast/test?planId='+1;
	var schedules;
	
	$.getJSON(url,function(stats,statusText,jqxhr){
		
	}).done(function(stats,statusText,jqxhr){
		console.log(stats);
		createChart(stats);
	}).fail(function(){
		console.log('failed');
	}).always(function(){
		
	});
}

function createChart(stats){
	
	var dates=Object.keys(stats);
	
	var ctx=$('#forecast-chart')[0].getContext('2d');
	var forecastChart=new Chart(ctx,{
		type : 'bar',
		data: {
	        labels: ['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23'],
	        datasets: [createDataSet(stats)]
	    },
	    options: {
	    	maintainAspectRatio:false,
	        scales: {
	            yAxes: [{
	                ticks: {
	                    beginAtZero:true
	                }
	            }]
	        }
	    }
	});
}

function createDataSet(stats){
	var hourStats=stats['2018-03-01'].hourStatistics;
	var forecastHours=[];
	for(var h=0;h<24;h++){
		forecastHours[h]=hourStats[h].hoursForecasted;
	}
	var forecastSet={
			label : 'Forecast hours',
			data : forecastHours
	}
	return forecastSet;
	
}

/*class OrgTree{
	
	constructor(tree,changeHandler){
		this.tree=tree;
		this._loadTree();
		this._bindTreeChangeHandler(changeHandler);
	}
	
	set tree(val){
		this._tree=val;
	}
	
	get tree(){
		return this._tree;
	}
	
	get selectedValue(){
		return $(this._tree).jstree('get_selected');
	}
	
	_bindTreeChangeHandler(changeHandler){
		$(this._tree).on('changed.jstree', changeHandler);
	}
	
	_loadTree(){
		var treeData;
		var me=this;
		DAO.loadOrgTree(function(status,treeData){
			if(status==DAO.STATUS.DONE){
				me._fillTree(treeData);
			}
		});
	}
	
	_fillTree(treeData){
		$(this._tree).jstree({ 
			'core' : {
				'data' : treeData
			} 
		});
	}
}*/



