import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './users.html';
// import '../../../lib/helpers.js';
// import '../../../lib/methods.js';

Template.users.onCreated(function usersOnCreated() {
	this.state = new ReactiveDict();
	Meteor.subscribe('activeUsers');
});

Template.users.helpers({
	usersList: ()=>{
			var users = Meteor.users.find({ "status.online": true, _id: { $ne: Meteor.user()._id} },{username: 1,'profile.name':1});
			//console.log(users);
			return users;
	},

	/*
  users: ()=>{
    if(Meteor.user()){
        return Meteor.users.find({ _id: { $ne: Meteor.user()._id } },{username: 1,'profile.name':1});
    }else{
        return Meteor.users.find({},{username: 1,'profile.name':1});
    }
  },
  alreadyFriends: alreadyFriends
	*/
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
												' <button type="button" class="btn btn-xs btn-info" name="button">Invite for game</button>' +
												'</li>');
					}else if(user.profile.name){
						// in the loop then
						items.push('<li class="list-group-item">' +
												user.profile.name +
												' <button type="button" class="btn btn-xs btn-info" name="button">Invite for game</button>' +
												'</li>');
					}
				});

				$("ul#userList").empty().html(items.join(""));
	}
});
