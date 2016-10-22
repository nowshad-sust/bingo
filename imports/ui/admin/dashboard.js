import { Meteor } from 'meteor/meteor';
import { sAlert } from 'meteor/juliancwirko:s-alert';
import { Template } from 'meteor/templating';
import { Contacts } from '../../api/tasks.js';
import { Games } from '../../api/tasks.js';

//import { d3 } from '../../../public/js/d3.v4.min.js';
import '../../../public/js/chartjs.min.js';

import './dashboard.html';
import './adminNav.html';

Template.adminDashboard.onCreated(function usersOnCreated() {
	this.state = new ReactiveDict();
	Meteor.subscribe('allUsers');
	Meteor.subscribe('contacts');
  Meteor.subscribe('allGames');
});

Template.pieChart.onRendered(function(){

	Meteor.subscribe('allGames', function(){

	var finished = Games.find({response: 'Finished'}).count();
	var running = Games.find({'mainGame.result': null}).count();
	var draw = Games.find({'mainGame.result': 'draw'}).count();

	var data = {
    labels: [
        "Drawn",
        "Win/Loss",
        "Running"
    ],
    datasets: [
        {
            data: [draw, finished, running],
            backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56"
            ],
            hoverBackgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56"
            ]
        }]
			};
		var ctx = $("#pieChart");
		// For a pie chart
		var myPieChart = new Chart(ctx,{
		    type: 'pie',
		    data: data,
				options: {
        responsive: true
			}
		});
		});
});

Template.barChart.onRendered(function(){

	Meteor.call('latestGames', function(error, result){
		if(error){
			console.log(error);
		}else{
			label = [];
			data = [];
			result.forEach(function(day){
				label.unshift(day._id.day);
				data.unshift(day.count);
			});
			var data = {
		    labels: label,
		    datasets: [
		        {
		            label: "Day's gameplays",
								backgroundColor: 'rgba(54, 162, 235, 0.2)',
		            borderWidth: 1,
		            data: data
		        }
		    	]
				};
					var ctx = $("#barChart");
					var myBarChart = new Chart(ctx, {
					    type: 'bar',
					    data: data,
							options: {
			        	responsive: true
							}
					});
			}
		});

});

Template.adminDashboard.helpers({
  countUsers: function(){
    return Meteor.users.find({}).count();
  },
	finishedGames: function(){
    return Games.find({response: 'Finished'}).count();
  },
	runningGames: function(){
    return Games.find({'mainGame.result': null}).count();
  },
	contactMessages: function(){
		return Contacts.find({}).count();
	}
});
