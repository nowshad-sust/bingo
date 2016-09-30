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

gameId = FlowRouter.getParam('gameId');
game = Games.findOne({_id:gameId});

Template.game.helpers({
	thisGame: function(){
		var gameId = FlowRouter.getParam('gameId');
		var game = Games.findOne({_id:gameId});
		return game;
	},
	gameWinner: function(){
		var gameId = FlowRouter.getParam('gameId');
		var game = Games.findOne({_id:gameId});
		//check the is finished or not
		if(game.mainGame.result){
			return game.mainGame.result;
		}else{
			return false;
		}
	},
	turn: function(turn){
		if(turn == Meteor.user()._id){
			return true;
		}else{
			return false;
		}
	},
	checkUser: function(userId){
		if(userId == Meteor.user()._id){
			return true;
		}else{
			return false;
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

Template.game.events({
	'click .select-box': function(event){
		var turn = event.target.attributes.data;
		if(turn){
			if(!checkFinished()){
				if(turn == Meteor.user()._id){
					var status = event.target.attributes.status.value;
					if(status == "true"){
						sAlert.warning('Already selected this box!',{timeout:2000});
					}else{
						var index = event.target.attributes.index.value;
						console.log(index);
						var gameId = FlowRouter.getParam('gameId');
						Meteor.call('indexSelected', index, gameId, (error, result)=>{
							if(error){
								sAlert.error('Error update the index',{timeout:2000});
							}else{
								sAlert.success('index selected',{timeout:2000});
							}
						});
					}
				}else{
					sAlert.warning('Please wait for opponents response first!',{timeout:2000});
				}
			}else{
				sAlert.success('Game Already Finished!',{timeout:2000});
			}
		}else{
			sAlert.success('Game Already Finished!',{timeout:2000});
		}

	}
});

function checkFinished(){
	/*
	points array based on indexes
	Horizontal
		[0 1 2 3 4]
		[5 6 7 8 9]
		[10 11 12 13 14]
		[15 16 17 18 19]
		[20 21 22 23 24]
	vertical
		[0 5 10 15 20]
		[1 6 11 16 21]
		[2 7 12 17 22]
		[3 8 13 18 23]
		[4 9 14 19 24]
	angle
		[0 6 12 18 24]
		[4 8 12 16 20]
	*/
	var gameId = FlowRouter.getParam('gameId');
	localGame = Games.findOne({_id:gameId});
	var bingo = 0;
	var compareArray =[
		[0, 1, 2, 3, 4],
		[5, 6, 7, 8, 9],
		[10,11, 12, 13, 14],
		[15, 16, 17, 18, 19],
		[20, 21, 22, 23, 24],
		[0, 5, 10, 15, 20],
		[1, 6, 11, 16, 21],
		[2, 7, 12, 17, 22],
		[3, 8, 13, 18, 23],
		[4, 9, 14, 19, 24],
		[0, 6, 12, 18, 24],
		[4, 8, 12, 16, 20]
	];
	//check the current user is game.user or game.opponent
	if(localGame.userId == Meteor.user()._id){
		// this user is User
		var board = localGame.mainGame.userBoard;
		//finding selected indexs
		selectedArray = [];
		for (var i = 0; i < board.length; i++) {
			if(board[i].selected){
				selectedArray.push(i);
			}
		}
		for (var i = 0; i < compareArray.length; i++) {
			if(arrayExists(compareArray[i], selectedArray)){
				bingo++;
			}
		}
		if(bingo >= 5){
				Meteor.call('finishGame', localGame._id, function(error, result){
						if(error){
							sAlert.success('Game Finished!',{timeout:2000});
							return true;
						}else{
							return false;
						}
					});
					return true;
		}else{
			return false;
		}

	}else{
		//this user is opponent
		var board = localGame.mainGame.opponentBoard;
		//finding selected indexs
		selectedArray = [];
		for (var i = 0; i < board.length; i++) {
			if(board[i].selected){
				selectedArray.push(i);
			}
		}

		for (var i = 0; i < compareArray.length; i++) {
			if(arrayExists(compareArray[i], selectedArray)){
				bingo++;
			}
		}

		if(bingo >= 5){
				Meteor.call('finishGame', localGame._id, function(error, result){
						if(error){
							sAlert.success('Game Finished!',{timeout:2000});
							return true;
						}else{
							return false;
						}
					});
					return true;
		}else{
			return false;
		}

	}
}
function arrayExists(subArray, superArray){
	var master = superArray,
    sub = subArray,
    index = 0,
    found = sub.every(function (a) {
        var i = master.indexOf(a, index);
        if (~i) {
            index = i;
            return true;
        }
    });
		return found;
}
