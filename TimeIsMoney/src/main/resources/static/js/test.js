/**
 * 
 */

$(document).ready(function(){
	$('#test-forecast').on('click',loadForecast);
	$('#test-js-button').on('click',testApproach);
});

function testApproach(){
	var timeStr='09:20';
	var timeArr=timeStr.split(':');
	var hours=parseInt(timeArr[0]);
	var minutes=parseInt(timeArr[1]);
	var date=new Date();
	var year=date.getFullYear();
	var month=date.getMonth();
	var day=date.getDate();
	
	var dateTime=new Date(year,month,day,hours,minutes);
	console.log(dateTime);
	console.log(dateTime.getTime());
}

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
