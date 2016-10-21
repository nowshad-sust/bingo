import { Meteor } from 'meteor/meteor';
import { sAlert } from 'meteor/juliancwirko:s-alert';
import { Template } from 'meteor/templating';
import { Contacts } from '../../api/tasks.js';
import { Games } from '../../api/tasks.js';

import './dashboard.html';
import './adminNav.html';

Template.adminDashboard.onCreated(function usersOnCreated() {
	this.state = new ReactiveDict();
	Meteor.subscribe('allUsers');
	Meteor.subscribe('contacts');
  Meteor.subscribe('allGames');
});

Template.adminDashboard.helpers({
  countUsers: function(){
    return Meteor.users.find({}).count();
  },
  countGames: function(){
    return Games.find({}).count();
  },
});
