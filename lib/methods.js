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

    var game = {
      userId: userId,
      opponentId: opponentId,
      needsConfirmation: true,
      response: 'pending'
    }

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

  acceptGame: (gameId)=>{

    var numbers = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25];

    var userBoard = generateBoard(shuffle(numbers));
    var opponentBoard = generateBoard(shuffle(numbers));

    var mainGame = {

      userBoard:userBoard,
      opponentBoard:opponentBoard,
      result: null

    };

    return Games.update({_id: gameId},
                        {
                          needsConfirmation:false,
                          status: 'running',
                          mainGame: mainGame
                        },
                        function(error, result){
                          if(error){
                            return error;
                          }else{
                            return result;
                          }
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
