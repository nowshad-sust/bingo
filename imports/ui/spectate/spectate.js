import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Games } from '../../api/tasks.js';
import { sAlert } from 'meteor/juliancwirko:s-alert';

import './spectate.html';
import './spectate.css';
masterGame  = null;
Template.spectate.onCreated(function() {
	this.state = new ReactiveDict();
	var gameId = FlowRouter.getParam('gameId');
	masterGame = Meteor.subscribe('specThisGame', gameId);

});

Template.spectate.onRendered(function() {
});

Template.spectate.helpers({
	and: function(value1, value2){
		return (value1 && value2);
	},
	thisGame: function(){
		//must render this with a delay for avoiding cheating
		if(masterGame.ready()){
			var gameId = FlowRouter.getParam('gameId');
			var game = Games.findOne({_id:gameId});
			//players cannot spectate their own game
			if(game.userId == Meteor.user()._id || game.opponentId == Meteor.user()._id){
				FlowRouter.go(FlowRouter.current().oldRoute.name);
				sAlert.warning('You can not watch your own game!');
			}else{
				return game;
			}
		}
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
