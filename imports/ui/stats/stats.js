import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Games } from '../../api/tasks.js';

import '../../../public/js/chartjs.min.js';

import './stats.html';


Template.stats.onCreated(function gameOnCreated() {
	this.state = new ReactiveDict();
	Meteor.subscribe('myGames');
});

Template.myPieChart.onRendered(function(){

	Meteor.subscribe('myGames', function(){

	var won = Games.find({response: 'Finished','mainGame.result': Meteor.user()._id}).count();
	var lost = Games.find({response: 'Finished', 'mainGame.result': {$ne: Meteor.user()._id} }).count();
	var draw = Games.find({response: 'Finished', 'mainGame.result': 'draw'}).count();
  var running = Games.find({response: 'Running', 'mainGame.result': null}).count();

	var data = {
    labels: [
        "Drawn",
        "Won",
        "Lost",
        "Running"
    ],
    datasets: [
        {
            data: [draw, won, lost, running],
            backgroundColor: [
                "#FFCE56",
                "#36A2EB",
                "#FF6384",
                "black"
            ],
            hoverBackgroundColor: [
                "#FFCE56",
                "#36A2EB",
                "#FF6384",
                "black"
            ]
        }]
			};
		var ctx = $("#myChart");
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


Template.stats.helpers({

});
