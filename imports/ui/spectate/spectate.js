import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Games } from '../../api/tasks.js';
import { sAlert } from 'meteor/juliancwirko:s-alert';

import './spectate.html';
import './spectate.css';

Template.spectate.onCreated(function gameOnCreated() {
	this.state = new ReactiveDict();
	var gameId = FlowRouter.getParam('gameId');
	Meteor.subscribe('users');
	Meteor.subscribe('thisGame', gameId);
});


gameId = FlowRouter.getParam('gameId');
game = Games.findOne({_id:gameId});

Template.spectate.helpers({
	and: function(value1, value2){
		return (value1 && value2);
	},
	thisGame: function(){
		var gameId = FlowRouter.getParam('gameId');
		var game = Games.findOne({_id:gameId});
		return game;
	},
	formatTime: function(timestamp){
		return moment(timestamp).fromNow();
	},
	gameWinner: function(winner){

		var gameId = FlowRouter.getParam('gameId');
		var game = Games.findOne({_id:gameId});
		//check the is finished or not
    if(game.mainGame.result == 'draw'){
			return "Game Drawn!";
		}else if(game.userId == winner){
			return (game.userName + " Won!");
		}else{
			return (game.opponentName + " Won!");
		}
	},
	turn: function(turn, game){
		if(turn == game.userId){
			return game.userName;
		}else if(turn == game.opponentId){
			return game.opponentName;
		}
	},
	ifCheck: function(index){
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

Template.spectate.events({

});
