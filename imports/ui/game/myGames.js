import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Games } from '../../api/tasks.js';

import './myGames.html';


Template.myGames.onCreated(function gameOnCreated() {
	this.state = new ReactiveDict();
	Meteor.subscribe('myGames');
});


Template.myGames.helpers({
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
	'click #btn-cancel': function(event){
		var gameId = this._id;
		//cancel the request
		return Meteor.call('cancelGame', gameId, function(error, result){
			if(error){
				sAlert.error('Boom! Something went wrong!');
			}else{
					sAlert.warning('Game request cancelled!');
			}
		});
	},

	'click #btn-decline': function(event){
			var gameId = this._id;
			//cancel the request
			return Meteor.call('cancelGame', gameId, (error, result)=>{
				if(error){
					sAlert.error('Boom! Something went wrong!');
				}else{
						sAlert.warning('Game request Declined!');
				}

			});
		},

	'click #btn-accept': function(event){
		var gameId = this._id;
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
