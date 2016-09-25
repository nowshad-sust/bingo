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
			return Meteor.users.find({ "status.online": true, _id: { $ne: Meteor.user()._id} },{username: 1,'profile.name':1});
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
		console.log('changing:' + value);
		var users;
		if(!value){
			 users = Meteor.users.find({ "status.online": true, _id: { $ne: Meteor.user()._id} },{username: 1,'profile.name':1});
		}else{
			console.log('not empty search');
			users = Meteor.users.find({ "status.online": true,
			 														_id: { $ne: Meteor.user()._id},
																	$or: [{username: {'$regex': value}},
																	{'profile.name': {'$regex': value}}]},
																	{username: 1,'profile.name':1});
		}
		return {usersList: users};
	}
});
