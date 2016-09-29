import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Games } from '../../api/tasks.js';
import { sAlert } from 'meteor/juliancwirko:s-alert';

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
		return game;
	},
	turn: (turn)=>{
		if(turn == Meteor.user()._id){
			return true;
		}else{
			return false;
		}
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
	'click .select-box': (event)=>{
		var turn = event.target.attributes.data.value;

		if(turn == Meteor.user()._id){
			var status = event.target.attributes.status.value;
			if(status == true){
				sAlert.warning('Already selected this box!',{timeout:200});
			}else{
				var index = event.target.attributes.index.value;
				console.log(index);
			}
		}else{
			sAlert.warning('Please wait for opponents response first!',{timeout:2000});
		}

	}
});
