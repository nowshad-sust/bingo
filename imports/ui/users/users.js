import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './users.html';
// import '../../../lib/helpers.js';
// import '../../../lib/methods.js';

Template.users.onCreated(function usersOnCreated() {
	this.state = new ReactiveDict();
  Meteor.subscribe('users');
	Meteor.subscribe('activeUsers');
});

Template.users.helpers({
	usersList: ()=>{
			return Meteor.users.find({ "status.online": true, _id: { $ne: Meteor.user()._id} });
	},
  users: ()=>{
    if(Meteor.user()){
        return Meteor.users.find({ _id: { $ne: Meteor.user()._id } });
    }else{
        return Meteor.users.find({});
    }
  },
  alreadyFriends: alreadyFriends
});

Template.users.events({
  'click .btn-friend': function(event){
    Meteor.call('setFriend', this._id);
  }
});
