import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const Games = new Mongo.Collection('games');

if (Meteor.isServer) {

  Meteor.publish('users', function UsersPublication() {
    return Meteor.users.find({},{username: 1, profile: 1});
  });

  Meteor.publish("activeUsers", function() {
    return Meteor.users.find({ "status.online": true });
  });

  Meteor.publish("myGames", function() {
    var userId = this.userId;

    var games =  Games.find({ $or:[{userId: userId},{opponentId: userId}]});

    if(games){
      return games;
    }else{
      console.log("no games published");
      return null;
    }

  });

}

Meteor.methods({

});
