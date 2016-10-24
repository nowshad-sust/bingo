import { Meteor } from 'meteor/meteor';
import { Games } from '../imports/api/tasks.js';
import { Contacts } from '../imports/api/tasks.js';

Meteor.methods({

  isAdmin: function(){
    var userId = this.userId;

    var user = Meteor.users.findOne(userId);

    if(user && user.isAdmin){
      return true;
    }else{
      return false;
    }
  },

  setFriend: function(userId){
    var query = {};

    query[alreadyFriends(userId) ? '$pull' : '$push'] = {
      'profile.friends': userId
    };

    Meteor.users.update(this.userId, query);
  },

  latestGames: function (){
    var result = Games.aggregate([
        // Get only records created in the last 30 days
        {$match:{
              "mainGame.timestamp":{$gt: new Date((new Date()).getTime() - 1000*60*60*24*30)}
        }},
        // Get the year, month and day from the createdTimeStamp
        {$project:{
              "year":{$year:"$mainGame.timestamp"},
              "month":{$month:"$mainGame.timestamp"},
              "day": {$dayOfMonth:"$mainGame.timestamp"}
        }},
        // Group by year, month and day and get the count
        {$group:{
              _id:{year:"$year", month:"$month", day:"$day"},
              "count":{$sum:1}
        }}
    ]);
    return result;
  },

  createContact: function(name, email, message){

    var contact = {
      name: name,
      email: email,
      message: message,
      timestamp: new Date()
    };

    return Contacts.insert(contact);
  },

  sendMessage: function(options){
    //update both user board and opponent board
    return Games.update(options.gameId,
      {
        $push: {'mainGame.conversation': {
          senderId: options.senderId,
          message: options.message,
          timestamp: new Date()
          }
        }
      });
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
      response: 'pending',
      timestamp: new Date()
    };

    return Games.insert(game);
  },

  cancelGame: function(gameId){
      return Games.remove({_id: gameId}, 1);
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
      $set: { 'mainGame.result': winnerId, 'mainGame.turn':null, response: 'Finished' }
    });
  },

  resetBoard: function(gameId, array, type){
    if(type == 'user'){
      return Games.update(gameId, {
        $set: { 'mainGame.userBoard': array}
      });
    }else if(type == 'opponent'){
      return Games.update(gameId, {
        $set: { 'mainGame.opponentBoard': array}
      });
    }
  },

  updateStatus: function(gameId, type){
    if(type == 'user'){
      return Games.update(gameId, {
        $set: { 'mainGame.status.user': true}
      });
    }else if(type == 'opponent'){
      return Games.update(gameId, {
        $set: { 'mainGame.status.opponent': true}
      });
    }
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
      //used status to start the game
      status: {
        user: false,
        opponent: false,
      },
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
                          response: 'Running',
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
