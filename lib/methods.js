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

    Games.insert(game, function(err, id){
      if(err){
        return false;
      }else{
        console.log("game Created with id: "+ id );
        return true;
      }
    });
  },
  cancelGame: (gameId)=>{
    var game = Games.findOne({_id: gameId});
    if(game){
      Games.update({_id: gameId},
        {needsConfirmation: false, response: 'cancelled'}, function(error, result) {
        if(err){
          return false;
        }else{
          console.log('cancelled game');
          return true;
        }
      });
    }else{
      console.log('Game not found');
    }
  }
});
