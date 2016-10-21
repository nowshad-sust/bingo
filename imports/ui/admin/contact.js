import { Meteor } from 'meteor/meteor';
import { sAlert } from 'meteor/juliancwirko:s-alert';
import { Template } from 'meteor/templating';
import { Contacts } from '../../api/tasks.js';

import './contact.html';
import './adminNav.html';

Template.adminContact.onCreated(function usersOnCreated() {
	this.state = new ReactiveDict();
	//Meteor.subscribe('activeUsers');
	Meteor.subscribe('contacts');
});

Template.adminContact.helpers({
  getContacts: function(){
    return Contacts.find({}, {sort: {timestamp: -1}});
  }
});
