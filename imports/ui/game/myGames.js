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
	myGames: ()=>{
		var userId = Meteor.user()._id;
		return Games.find({ $or:[{userId:userId},{opponentId:userId}] },{sort: {'mainGame.timestamp': -1}});
	}
});

Template.myGames.events({

});
