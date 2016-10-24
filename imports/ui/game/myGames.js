import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Games } from '../../api/tasks.js';

import './myGames.html';


Template.myGames.onCreated(function gameOnCreated() {
	this.state = new ReactiveDict();
	Meteor.subscribe('myGames');
});

Template.myGames.onRendered(function gameOnCreated() {

});


Template.myGames.helpers({

	requestSettings: function () {
		var userId = Meteor.user()._id;
		var games = Games.find({ needsConfirmation:true, $or:[{userId:userId},{opponentId:userId}] },{sort: {_id: -1}});

		var gamesArray = [];

		games.forEach(function(game){

			var opponent = null;
			var button = null;
			var status = null;

			if(game.userId == userId){
				game.button = function () {
					return new Spacebars.SafeString("<button type='button' id="+game._id+" class='btn-cancel btn btn-xs btn-danger'>Cancel request</button>");
				 };
				game.opponent = game.opponentName;
			}else{
				game.button = function () { return new Spacebars.SafeString("<button type='button' id="+game._id+" class='btn-accept btn btn-xs btn-success'>Accept request</button>"+
				"<button type='button' id="+game._id+" class='btn-decline btn btn-xs btn-danger'>Decline request</button>"); };
			 	game.opponent = game.userName;
			}

			gamesArray.push(game);
		});

		//console.log(gamesArray);

        return {
            collection: gamesArray,
            rowsPerPage: 10,
            showFilter: true,
						sortable: false,
            fields: [
							//used for sorting only
							{key: '_id', label: 'Id', sortOrder: 1, sortDirection: 'descending', hidden: true},

							{key: 'opponent', label: 'Opponent'},
							{key: 'response', label: 'Status'},
							{key: 'button', label: 'Link'}
							]
        };
    },
	settings: function () {
		var userId = Meteor.user()._id;
		var games = Games.find({ needsConfirmation:false,
			$or:[{userId:userId},{opponentId:userId}] },{sort: {'mainGame.timestamp': -1, 'response': -1}});

		var gamesArray = [];

		games.forEach(function(game){
			var opponent = null;
			var result = null;
			var button = null;

			if(game.userId == userId){
				opponent = game.opponentName;
			}else{
			 	opponent = game.userName;
			}

			if(game.mainGame && game.mainGame.result){
				if(game.mainGame.result == userId){
					result = 'Winner';
				}else if(game.mainGame.result == 'draw'){
					result = 'Drawn';
				}else{
					result = 'Lost';
				}
				button = "<a class='btn btn-default' href='/games/"+game._id+"'>Watch</a>";
			}else{
				result = 'Running';
				button = "<a class='btn btn-success' href='/games/"+game._id+"'>Play</a>";
			}

			var now = moment(new Date()); //todays date
			var end = moment(game.mainGame.timestamp); // another date
			var duration = moment.duration(now.diff(end));
			var days = duration.asSeconds();

			gamesArray.push({
				opponent: opponent,
				status: game.response,
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

							{key: 'opponent', label: 'Opponent'},
							{key: 'result', label: 'Result'},
							{key: 'time', label: 'Time'},
							{key: 'button', label: 'Link'}
							]
        };
    },
	myGames: function(){
		var userId = Meteor.user()._id;
		return Games.find({ needsConfirmation:false, $or:[{userId:userId},{opponentId:userId}] },{sort: {'mainGame.timestamp': -1}});
	},
	pendingGames: function(){
		var userId = Meteor.user()._id;
		return Games.find({ needsConfirmation:true, $or:[{userId:userId},{opponentId:userId}] },{sort: {_id: -1}});
	},
	userStatus: function(){
		if(this.userId == Meteor.user()._id){
			return {status:true, userName: this.opponentName};
		}else{
			return {status:false, userName: this.userName};
		}
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
