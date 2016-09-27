import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Games } from '../../api/tasks.js';

import './users.html';

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
  /*'click .btn-friend': function(event){
    Meteor.call('setFriend', this._id);
  }*/

	'change #search-field': function(event){

		var value = $('#search-field').val();

		var users;

		if(!value){
			 	users = Meteor.users.find({ "status.online": true, _id: { $ne: Meteor.user()._id} },{username: 1,'profile.name':1});
		}else{
				users = Meteor.users.find({ "status.online": true,
			 														_id: { $ne: Meteor.user()._id},
																	$or: [{username: {'$regex': value}},
																	{'profile.name': {'$regex': value}}]},
																	{username: 1,'profile.name':1});
				}

				var items = [];

				// insert all at once...
				users.forEach(function (user) {
					if(user.username){
						// in the loop then
						items.push('<li class="list-group-item">' +
												user.username +
												' <button type="button" class="btn btn-xs btn-info" id="btn-" value="'+ user._id +'">Invite for game</button>' +
												'</li>');
					}else if(user.profile.name){
						// in the loop then
						items.push('<li class="list-group-item">' +
												user.profile.name +
												' <button type="button" class="btn btn-xs btn-info" name="request" value="'+ user._id +'">Invite for game</button>' +
												'</li>');
					}
				});

				$("ul#userList").empty().html(items.join(""));
	},

	'click #btn-create': function(event){
		var opponentId = this.user._id;
		var userId = Meteor.user()._id;
		//create a new game between these two users
		$response = Meteor.call('createGame',userId,opponentId);

	},
	'click #btn-cancel': function(event){
		var gameId = this.game._id;
		//cancel the request
		$response = Meteor.call('cancelGame',gameId);

	},
	'click #btn-accept': function(event){
		var gameId = this.game._id;;
		console.log(gameId);
		//initiate a game here;
	},
});
