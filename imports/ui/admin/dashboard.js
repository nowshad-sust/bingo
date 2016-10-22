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
			alert(error);
		}else{
			Session.set("data", result);
			console.log(result);
		}

	var data = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
        {
            label: "Last 30 days gameplays",
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [65, 59, 80, 81, 56, 55, 40],
            spanGaps: false,
        }
    	]
		};
			var ctx = $("#barChart");
			var myLineChart = new Chart(ctx, {
		    type: 'line',
		    data: data,
				options: {
				responsive: true
				}
			});
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
