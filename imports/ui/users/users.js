import { Meteor } from 'meteor/meteor';
import { sAlert } from 'meteor/juliancwirko:s-alert';
import { Template } from 'meteor/templating';
import { Games } from '../../api/tasks.js';

import './users.html';

import 'list.js';

Template.users.onCreated(function usersOnCreated() {
	this.state = new ReactiveDict();
	Meteor.subscribe('activeUsers');
	Meteor.subscribe('myGames');

});

Template.users.helpers({

	serial: (index)=>{
			return (index+1);
	},

	isNull: (string)=>{
		if(string == null){
			return true;
		}else{
			return false;
		}
	},

	usersList: ()=>{
			var userId = Meteor.user()._id;
			var users = Meteor.users.find({ "status.online": true, _id: { $ne: Meteor.user()._id} },{username: 1,'profile.name':1});

			this.userList = [];
			users.forEach(function(user){
				this.tempGame = Games.findOne({ $or: [
																				{ $and: [{userId:userId},{opponentId:user._id}]},
																				{ $and: [{userId:user._id},{opponentId:userId}]}
																			],
																			needsConfirmation: true});
				this.userStatus = false;
				if(this.tempGame){
					if(this.tempGame.userId == userId){
						 this.userStatus = true;
					}else if(this.tempGame.opponentId == userId){
						this.userStatus = false;
					}else{
						this.userStatus = null;
					}
				}else{
					this.userStatus = null;
				}
				 this.userDetails = {
					user: user,
					game: this.tempGame,
					userStatus: this.userStatus
				};
				this.userList.push(this.userDetails);
		});

		if(this.userList.length > 0) {
			return this.userList;
		}
		return null;
	},

});

Template.users.events({

	'click #btn-create': function(event){
		var opponentId = this.user._id;
		var userId = Meteor.user()._id;
		//create a new game between these two users
		$response = Meteor.call('createGame',userId,opponentId);

	},
	'click #btn-cancel': function(event){
		var gameId = this.game._id;
		//cancel the request
		Meteor.call('cancelGame',gameId,'cancelled', function(err,result){
			if(err){
				sAlert.error('Boom! Something went wrong!');
			}
			sAlert.warning('Game request cancelled!');
		});
	},

	'click #btn-decline': function(event){
			var gameId = this.game._id;
			//cancel the request
			Meteor.call('cancelGame',gameId,'declined', function(err,result){
				if(err){
					sAlert.error('Boom! Something went wrong!');
				}
				sAlert.warning('Game request Declined!');
			});
		},
	'click #btn-accept': function(event){
		var gameId = this.game._id;;
		console.log(gameId);
		//initiate a game here;
	},


});
