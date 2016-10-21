import { Meteor } from 'meteor/meteor';
import { sAlert } from 'meteor/juliancwirko:s-alert';
import { Template } from 'meteor/templating';
import { Games } from '../../api/tasks.js';

import './users.html';

// import '../../../public/css/datatables.min.css';
// import '../../../public/js/datatables.min.js';


Template.users.onCreated(function usersOnCreated() {
	this.state = new ReactiveDict();
	//Meteor.subscribe('activeUsers');
	Meteor.subscribe('myGames');
	Meteor.subscribe('allUsers');

});



Template.users.onRendered(function() {
		$('#myTable').dataTable( {
					saveState: true,
					aaSorting: []
			});
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
			var users = Meteor.users.find({ _id: { $ne: Meteor.user()._id} }, {sort: {'status.online': -1}},{username: 1,'profile.name':1, status:1} );

			if(users.length <= 0) {
				return null;
			}

			userList = [];
			users.forEach(function(user){
				tempGame = Games.findOne({ $or: [
																				{ $and: [{userId:userId},{opponentId:user._id}]},
																				{ $and: [{userId:user._id},{opponentId:userId}]}
																			],
																			needsConfirmation: true});

			 runningGame = Games.findOne({ $or: [
																					{ $and: [{userId:userId},{opponentId:user._id}]},
																					{ $and: [{userId:user._id},{opponentId:userId}]}
																					],
																		needsConfirmation: false, response: 'running'});

				userStatus = false;
				if(tempGame){
					if(tempGame.userId == userId){
						 userStatus = true;
					}else if(tempGame.opponentId == userId){
						userStatus = false;
					}else{
						userStatus = null;
					}
				}else{
					userStatus = null;
				}
				 userDetails = {
					user: user,
					game: tempGame,
					runningGame: runningGame,
					userStatus: userStatus
				};
				userList.push(userDetails);
		});

		//console.log(userList);
			return userList;
	},

});

Template.users.events({

	'click .btn-create': function(event){
		var opponentId = this.user._id;
		var userId = Meteor.user()._id;
		//create a new game between these two users
		$response = Meteor.call('createGame',userId,opponentId, function(error, result){
			if(error){
				sAlert.error('Boom! Something went wrong!');
			}else{
				FlowRouter.go('mygames');
				sAlert.success('Game request sent!');
			}
		});

	},
	'click .btn-cancel': function(event){
		var gameId = this.game._id;
		//cancel the request
		Meteor.call('cancelGame', gameId, function(error, result){
			if(error){
				sAlert.error('Boom! Something went wrong!');
			}else{
					sAlert.warning('Game request cancelled!');
			}
		});
	},

	'click .btn-decline': function(event){
			var gameId = this.game._id;
			//cancel the request
			Meteor.call('cancelGame', gameId, (error, result)=>{
				if(error){
					sAlert.error('Boom! Something went wrong!');
				}else{
						sAlert.warning('Game request Declined!');
				}

			});
		},

	'click .btn-accept': function(event){
		var gameId = this.game._id;
		//initiate a game here;
		Meteor.call('acceptGame', gameId, (error, result)=>{
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
