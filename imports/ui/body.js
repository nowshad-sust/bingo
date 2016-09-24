import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './body.html';
import './game.js';


Template.game.onCreated(function gameOnCreated() {
	this.state = new ReactiveDict();
  Meteor.subscribe('users');
});

Template.body.helpers({
  users: ()=>{
    if(Meteor.user()){
        return Meteor.users.find({ _id: { $ne: Meteor.user()._id } });
    }else{
        return Meteor.users.find({});
    }
  }
});

Template.body.events({

});
