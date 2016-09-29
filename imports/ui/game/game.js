import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Games } from '../../api/tasks.js';

import './game.html';
import './game.css';

Template.game.onCreated(function gameOnCreated() {
	this.state = new ReactiveDict();
	var gameId = FlowRouter.getParam('gameId');
	Meteor.subscribe('users');
	Meteor.subscribe('thisGame', gameId);
});


Template.game.helpers({
	thisGame: ()=>{
		var gameId = FlowRouter.getParam('gameId');
		var game = Games.findOne({_id:gameId});
		console.log(game);
		return game;
	},
	checkUser: (userId)=>{
		if(userId == Meteor.user()._id){
			return true;
		}else{
			return false;
		}
	},
	ifCheck: (index)=> {
		if(index==5 || index==10 || index==15 || index==20){
        return '</tr><tr>';
    }else if(index==0){
      return '<tr>';
    }else if(index==24){
      return '</tr>';
    }else {
      return null;
    }
	},
});

Template.game.events({

});
