import { Meteor } from 'meteor/meteor';
import { Games } from '../imports/api/tasks.js';
Meteor.methods({

  setFriend: function(userId){
    var query = {};

    query[alreadyFriends(userId) ? '$pull' : '$push'] = {
      'profile.friends': userId
    };

    Meteor.users.update(this.userId, query);
  },

  createGame: function(userId, opponentId){

    var user = Meteor.users.findOne({_id: userId},{username:1});
    var opponent = Meteor.users.findOne({_id: opponentId},{username:1});

    var game = {
      userId: userId,
      opponentId: opponentId,
      userName: user.username ? user.username: user.profile.name,
      opponentName: opponent.username ? opponent.username: opponent.profile.name,
      needsConfirmation: true,
      response: 'pending'
    };

    return Games.insert(game, function(error, id){
      if(error){
        return false;
      }else{
        console.log("game Created with id: "+ id );
        return true;
      }
    });
  },

  cancelGame: function(gameId){
      return Games.remove({_id: gameId}, 1, function(error){
        if(error){
          return error;
        }else{
          return ture;
        }

      });
  },

  indexSelected: function(index, gameId){
    var oldGame = Games.findOne({_id: gameId});
    var currentUserId = this.userId;
    //recheck the turn from server end
    if(currentUserId == oldGame.mainGame.turn){
      //determine user is user or opponent
      if(currentUserId == oldGame.userId){
        opponentBoard = oldGame.mainGame.opponentBoard;
        for (var i = 0; i < opponentBoard.length; i++) {
          if(opponentBoard[i].number == oldGame.mainGame.userBoard[index].number){
            opponentIndex = i;
            break;
          }else{
            opponentIndex = -1;
          }
        }
        //update both user board and opponent board
        settings = {
          ['mainGame.userBoard.'+index+'.selected']: true,
          ['mainGame.opponentBoard.'+opponentIndex+'.selected']: true,
          'mainGame.turn': oldGame.opponentId
        };
        return Games.update(gameId, {
          $set: settings
        });
      }else{
        userBoard = oldGame.mainGame.userBoard;
        for (var i = 0; i < userBoard.length; i++) {
          if(userBoard[i].number == oldGame.mainGame.opponentBoard[index].number){
            userIndex = i;
            break;
          }else{
            userIndex = -1;
          }
        }

        settings = {
           ['mainGame.opponentBoard.'+index+'.selected']: true,
           ['mainGame.userBoard.'+userIndex+'.selected']: true,
           'mainGame.turn': oldGame.userId
        };
        return Games.update(gameId, {
          $set: settings
        });
      }
    }else{
      return Error();
    }

  },

  finishGame: function(gameId, winnerId){
    console.log('Game Finished');
    return Games.update(gameId, {
      $set: { 'mainGame.result': winnerId, 'mainGame.turn':null }
    });
  },

  acceptGame: function(gameId){

    var oldGame = Games.findOne({_id: gameId});
    var numbers = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25];

    var user = Meteor.users.findOne({_id: oldGame.userId},{username:1,'profile.name':1});
    var opponent = Meteor.users.findOne({_id: oldGame.opponentId},{username:1,'profile.name':1});

    var userBoard = generateBoard(shuffle(numbers));
    var opponentBoard = generateBoard(shuffle(numbers));
    var turn = Math.round(Math.random()) > 0 ? user._id: opponent._id;
    var mainGame = {

      userBoard:userBoard,
      opponentBoard:opponentBoard,
      conversation: [],
      turn: turn,
      result: null,
      timestamp: new Date()

    };

    //problem: removing old attributes
    return Games.update({_id: gameId},
                        {
                          userId: oldGame.userId,
                          opponentId: oldGame.opponentId,
                          userName: user.username ? user.username: user.profile.name,
                          opponentName: opponent.username ? opponent.username: opponent.profile.name,
                          needsConfirmation: false,
                          response: 'running',
                          mainGame: mainGame
                        });
  }
});

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
