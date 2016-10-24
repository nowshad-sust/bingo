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
	and: function(value1, value2){
		return (value1 && value2);
	},
	not: function(condition){
		return !condition;
	},
	thisGame: function(){
		var gameId = FlowRouter.getParam('gameId');
		var game = Games.findOne({_id:gameId});
		return game;
	},
	formatTime: function(timestamp){
		return moment(timestamp).fromNow();
	},
	sortMessages: function(messages){
		return messages.sort(function(x, y){
	    return y.timestamp - x.timestamp;
		});

	},
	gameWinner: function(){
		var gameId = FlowRouter.getParam('gameId');
		var game = Games.findOne({_id:gameId});
		//check the is finished or not
		if(game.mainGame.result == Meteor.user()._id){
			return {status:true,winner:"You Won <br><hr> <img class='result-image' src='http://www.reactiongifs.com/r/drj1NmK.gif'>"};
		}else if(game.mainGame.result == 'draw'){
			return {status:false,winner:"Game Drawn! <br><hr> <img class='result-image' src='https://media.tenor.co/images/3a323dc32c9f5324ac65f5c8ec96bbaa/raw'>"};
		}else{
			return {status:false,winner:"Opponent Won! <br><hr> <img class='result-image' src='https://media2.giphy.com/media/mcH0upG1TeEak/100.gif'>"};
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

	'submit .message-form'(event) {
			//$('.message-scroll').scrollTop($('.message-scroll')[0].height());
			// Prevent default browser form submit
    	event.preventDefault();
			const target = event.target;
    	const text = target.message.value;
			if(text != null && text != ''){
				var gameId = FlowRouter.getParam('gameId');

				var options = {
					gameId: gameId,
					senderId: Meteor.user()._id,
					message: text
				};

				Meteor.call('sendMessage',options, function(error, result){
					if(error){
						sAlert.error('Error update the index',{timeout:2000,position: 'bottom-right'});
					}else{
						sAlert.success('Message Sent',{timeout:2000,position: 'bottom-right'});
					}
				});

				// Clear form
				target.message.value = '';
			}
	},

	'click .btn-start-game': function(event){

		var user = Meteor.user();
		var gameId = FlowRouter.getParam('gameId');
		var game = Games.findOne({_id:gameId});

		if(user._id == game.userId){
			//update user status
			Meteor.call('updateStatus', gameId, 'user', function(error, result){
					if(!error && result){
						sAlert.success("Please wait for opponent's response.",{timeout:2000,position: 'bottom-right'});
					}else{
						sAlert.error('Error',{timeout:2000,position: 'bottom-right'});
					}
			});
		}else if(user._id == game.opponentId){
			//update opponent status
			Meteor.call('updateStatus', gameId, 'opponent', function(error, result){
					if(!error && result){
						sAlert.success("Please wait for opponent's response.",{timeout:2000,position: 'bottom-right'});
					}else{
						sAlert.error('Error',{timeout:2000,position: 'bottom-right'});
					}
			});
		}

	},

	'click .btn-reshuffle': function(event){
		var user = Meteor.user();
		var gameId = FlowRouter.getParam('gameId');
		var game = Games.findOne({_id:gameId});
		var numbers = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25];

		if(user._id == game.userId){
			//update user board
			var newUserBoard = generateBoard(shuffle(numbers));

			Meteor.call('resetBoard', gameId, newUserBoard, 'user', function(error, result){
					if(!error && result){
						sAlert.success('Your board is regenerated',{timeout:2000,position: 'bottom-right'});
					}else{
						sAlert.error('Error reshuffle',{timeout:2000,position: 'bottom-right'});
					}
			});
		}else if(user._id == game.opponentId){
			//update opponent board
			var newOpponentBoard = generateBoard(shuffle(numbers));

			Meteor.call('resetBoard', gameId, newOpponentBoard, 'opponent', function(error, result){
				if(!error && result){
					sAlert.success('Your board is regenerated',{timeout:2000,position: 'bottom-right'});
				}else{
					sAlert.error('Error reshuffle',{timeout:2000,position: 'bottom-right'});
				}
			});
		}
	},

	'click .select-box': function(event){

		if(event.target.attributes.data){
			var gameId = FlowRouter.getParam('gameId');
			var game = Games.findOne({_id:gameId});

			if(game.mainGame.status){
				if(!(game.mainGame.status.user && game.mainGame.status.opponent)){
						sAlert.warning('Please wait till both of you start the game!',{timeout:2000,position: 'bottom-left'});
						return;
				}
			}

			if(game.mainGame.result == null){
				var turn = event.target.attributes.data.value;
				if(turn == Meteor.user()._id){
					var status = event.target.attributes.status.value;
					if(status == "true"){
						sAlert.warning('Already selected this box!',{timeout:2000,position: 'bottom-left'});
					}else{
						var index = event.target.attributes.index.value;
						//console.log(index);
						var gameId = FlowRouter.getParam('gameId');
						Meteor.call('indexSelected', index, gameId, (error, result)=>{
							if(error){
								sAlert.error('Error update the index',{timeout:2000,position: 'bottom-left'});
							}else{
								sAlert.success('selected',{timeout:2000,position: 'bottom-left'});
							}
						});
						var finished = checkFinished();
					}
				}else{
					sAlert.warning('Please wait for opponents response first!',{timeout:2000,position: 'bottom-left'});
				}
			}else{
				sAlert.success('Game Already Finished!',{timeout:2000,position: 'bottom-left'});
			}

		}else{
			sAlert.success('Game Already Finished!',{timeout:2000,position: 'bottom-left'});
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

	//check the current user is game.user or game.opponent
	if(localGame.userId == Meteor.user()._id){
		// this user is User
		var myBoard = localGame.mainGame.userBoard;
		var opBoard = localGame.mainGame.opponentBoard;
		var myBingo = countBingo(myBoard);
		var opBingo = countBingo(opBoard);
		//checking game finish rules
		if(myBingo >= 5 && opBingo <5){
				Meteor.call('finishGame', localGame._id, Meteor.user()._id,function(error, result){
						if(error){
							sAlert.success('Game Finished!',{timeout:2000});
							return true;
						}else{
							return false;
						}
					});
					return true;
		}else if(opBingo >= 5 && myBingo <5){
			Meteor.call('finishGame', localGame._id, localGame.opponentId,function(error, result){
					if(error){
						sAlert.success('Game Finished!',{timeout:2000});
						return true;
					}else{
						return false;
					}
				});
				return true;
		}else if(myBingo >= 5 && opBingo >= 5){
			if(myBingo > opBingo){
				Meteor.call('finishGame', localGame._id, Meteor.user()._id,function(error, result){
						if(error){
							sAlert.success('Game Finished!',{timeout:2000});
							return true;
						}else{
							return false;
						}
					});
					return true;
				}else if(opBingo > myBingo){
					Meteor.call('finishGame', localGame._id, localGame.opponentId,function(error, result){
							if(error){
								sAlert.success('Game Finished!',{timeout:2000});
								return true;
							}else{
								return false;
							}
						});
						return true;
				}else if(myBingo == opBingo){
					Meteor.call('finishGame', localGame._id, 'draw',function(error, result){
							if(error){
								sAlert.success('Game Drawn!!!',{timeout:2000});
								return true;
							}else{
								return false;
							}
						});
						return true;
				}
		}else{
			return false;
		}

	}else{
		//this user is opponent
		var myBoard = localGame.mainGame.opponentBoard;
		var opBoard = localGame.mainGame.userBoard;
		var myBingo = countBingo(myBoard);
		var opBingo = countBingo(opBoard);
		if(myBingo >= 5 && opBingo <5){
				Meteor.call('finishGame', localGame._id, Meteor.user()._id,function(error, result){
						if(error){
							sAlert.success('Game Finished!',{timeout:2000});
							return true;
						}else{
							return false;
						}
					});
					return true;
		}else if(opBingo >= 5 && myBingo <5){
			Meteor.call('finishGame', localGame._id, localGame.userId,function(error, result){
					if(error){
						sAlert.success('Game Finished!',{timeout:2000});
						return true;
					}else{
						return false;
					}
				});
				return true;
		}else if(myBingo >= 5 && opBingo >= 5){
			if(myBingo > opBingo){
				Meteor.call('finishGame', localGame._id, Meteor.user()._id,function(error, result){
						if(error){
							sAlert.success('Game Finished!',{timeout:2000});
							return true;
						}else{
							return false;
						}
					});
					return true;
				}else if(opBingo > myBingo){
					Meteor.call('finishGame', localGame._id, localGame.userId,function(error, result){
							if(error){
								sAlert.success('Game Finished!',{timeout:2000});
								return true;
							}else{
								return false;
							}
						});
						return true;
				}else if(myBingo == opBingo){
					Meteor.call('finishGame', localGame._id, 'draw',function(error, result){
							if(error){
								sAlert.success('Game Drawn!!!',{timeout:2000});
								return true;
							}else{
								return false;
							}
						});
						return true;
				}
		}else{
			return false;
		}

	}
}

function countBingo(board){
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
	var bingo = 0;
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

	return bingo;
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

function generateBoard (array) {

  var i = 0;
  var userBoard = [];

  for (i = 0; i < array.length; i++) {
    userBoard[i] =
      {
        number: array[i],
        selected: false
      }
  }
  return userBoard;
}

function shuffle (array) {
  var i = 0
    , j = 0
    , temp = null

  for (i = array.length - 1; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1))
    temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
  return array;
}
