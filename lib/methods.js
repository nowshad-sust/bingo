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
      Games.remove({_id: gameId}, 1, (error, numberOfRemovedDocs) => {
        if(error){
          return error;
        }else{
          return numberOfRemovedDocs;
        }
      });
  }
});
