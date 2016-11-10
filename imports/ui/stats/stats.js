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

Template.myBarChart.onRendered(function(){

	Meteor.subscribe('myGames', function(){

		myLatestGames = Games.find({response: "Finished","mainGame.timestamp":{$gt: new Date((new Date()).getTime() - 1000*60*60*24*10)}},{sort:{"mainGame.timestamp":1}});

		wins = [];
		loses = [];
		draws = [];
		labels = [];

		finalArray = [];

		var win = 0;
		var loss = 0;
		var draw = 0;

		myLatestGames.forEach(function(game, index){

				var currentDate = game.mainGame.timestamp.getDate();

				if(game.mainGame){
					if(finalArray[currentDate]){
						if(game.mainGame.result == 'draw'){
								draw = finalArray[currentDate].draw + 1;
						}else if(game.mainGame.result == Meteor.user()._id){
								win = finalArray[currentDate].win + 1;
						}else{
								loss = finalArray[currentDate].loss + 1;
						}
					}else{
						if(game.mainGame.result == 'draw'){
								draw++;
						}else if(game.mainGame.result == Meteor.user()._id){
								win++;
						}else{
								loss++;
						}
					}
					var object = {
						win: win,
						loss: loss,
						draw: draw
					};

					finalArray[currentDate] = object;
				}

			});

			labels = [];
			win = [];
			loss = [];
			draw = [];

			finalArray.forEach(function(stat, key){
				labels.push(key);
				wins.push(stat.win);
				loses.push(stat.loss);
				draws.push(stat.draw);
			});
			
			var data = {
		    labels: labels,
		    datasets: [
		        {
		            label: "Day's Wins",
								backgroundColor: 'rgba(54, 162, 235, 0.2)',
		            borderWidth: 1,
		            data: wins
		        },
						{
		            label: "Day's Loss",
								backgroundColor:	"#FF6384",
		            borderWidth: 1,
		            data: loses
		        },
						{
		            label: "Day's Draws",
								backgroundColor:	"#FFCE56",
		            borderWidth: 1,
		            data: draws
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
		});
});



Template.stats.helpers({

});
