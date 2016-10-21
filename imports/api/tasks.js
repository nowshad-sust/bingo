import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Games = new Mongo.Collection('games');
export const Contacts = new Mongo.Collection('contacts');

if (Meteor.isServer) {

  Meteor.publish('users', function UsersPublication() {
    return Meteor.users.find({},{username: 1, profile: 1});
  });

  Meteor.publish('thisGame', function ThisGamePublication(gameId) {
    var game = Games.find({ _id: gameId });
    return game;
  });

  Meteor.publish("activeUsers", function() {
    return Meteor.users.find({ "status.online": true });
  });

  Meteor.publish("allUsers", function() {
    return Meteor.users.find({},{username:1,'profile.name':1, status:1});
  });

  Meteor.publish("contacts", function() {
    return Contacts.find({});
  });

  Meteor.publish("allGames", function() {
    return Games.find({});
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
