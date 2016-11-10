import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Games } from '../../api/tasks.js';

import './spectateList.html';

gamesList = null;
Template.spectateList.onCreated(function gameOnCreated() {
	this.state = new ReactiveDict();
	gamesList = Meteor.subscribe('spectateGames');
});

Template.spectateList.onRendered(function gameOnCreated() {

});

Template.spectateList.helpers({

	spectate: function () {

		var t = new Date();
	    t.setSeconds(t.getSeconds() - 60);

		var userId = Meteor.user()._id;
		var games = Games.find({  	'mainGame.result': null,
									$or:[
										{'mainGame.timestamp': { $gte : t }},
										{'mainGame.lastSelection.timestamp': { $gte : t }}
									],
				                    userId: { $ne: userId },
			                        opponentId: { $ne: userId }
									},

									{sort: {'mainGame.lastSelection.timestamp': -1}}
								);

			var gamesArray = [];

			games.forEach(function(game){
				var opponent = null;
				var result = null;
				var button = null;

				if(game.mainGame && game.mainGame.result){
					result = "Finished";
				}else{
					result = 'Running';
				}

	      button = "<a class='btn btn-default' href='/spectate/"+game._id+"'>Watch</a>";

				var now = moment(new Date()); //todays date
				var end = moment(game.mainGame.timestamp); // another date
				var duration = moment.duration(now.diff(end));
				var days = duration.asSeconds();

				gamesArray.push({
	        user: game.userName,
					opponent: game.opponentName,
					result: result,
					timestamp: days,
					time: moment(game.mainGame.timestamp).fromNow(),
					button: function () { return new Spacebars.SafeString(button); }
				});
			});

			//console.log(gamesArray);

	        return {
	            collection: gamesArray,
	            rowsPerPage: 10,
	            showFilter: true,
							order: [],
							sortable: false,
							aaSorting: [],
							throttleRefresh: 5000,
	            fields: [
								//used for sorting only
								{key: 'timestamp', label: 'Timestamp', sortOrder: 0, sortDirection: 'ascending', hidden: true},
	              {key: 'user', label: 'Player-1'},
								{key: 'opponent', label: 'Player-2'},
								{key: 'result', label: 'Result'},
								{key: 'time', label: 'Time'},
								{key: 'button', label: 'Link', sortable: false}
								]
	        };
	    }
});

Template.myGames.events({
	'click .btn-cancel': function(event){

		var gameId = event.target.getAttribute("id");
		console.log(gameId);
		//cancel the request
		try {
			Meteor.call('cancelGame', gameId, function(error, result){
				if(error){
					sAlert.error('Boom! Something went wrong!');
				}else{
						sAlert.warning('Game request cancelled!');
				}
			});
		} catch (e) {

		}
	},

	'click .btn-decline': function(event){
			var gameId = event.target.getAttribute("id");
			//cancel the request
			return Meteor.call('cancelGame', gameId, (error, result)=>{
				if(error){
					sAlert.error('Boom! Something went wrong!');
				}else{
						sAlert.warning('Game request Declined!');
				}

			});
		},

	'click .btn-accept': function(event){
		var gameId = event.target.getAttribute("id");
		console.log(gameId);
		//initiate a game here;
		return Meteor.call('acceptGame', gameId, (error, result)=>{
			if(error){
				sAlert.error('Boom! Something went wrong!');
			}else{
				console.log("game accepted: " + result);
				sAlert.success('Game request is accepted!');
			}
			FlowRouter.go('games',{gameId: gameId});
		});
	},
});
