import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const Games = new Mongo.Collection('games');

// var Schemas = {};
//
// Schemas.Conversations = new SimpleSchema({
//     senderID: {
//         type: Number,
//         label: "Id"
//     },
//     message: {
//         type: String,
//         label: "Message"
//     }
// });
//
// Schemas.Games = new SimpleSchema({
//     users: {
//         type: Number,
//         label: "Id",
//
//     },
//     author: {
//         type: String,
//         label: "Author"
//     },
//
//     conversations: {
//         type: Schemas.Conversations,
//         optional: true
//     }
// });
//
// Games.attachSchema(Schemas.Games);

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('games', function GamesPublication() {
    return Games.find({userId: Meteor.user._id});
  });

  Meteor.publish('users', function UsersPublication() {
    return Meteor.users.find({},{username: 1, profile: 1});
  });

  Meteor.publish("activeUsers", function() {
    return Meteor.users.find({ "status.online": true });
  });

  Meteor.publish("myGames", function() {
    var userId = this._id;
    var games =  Games.find({});
    return games;
  });

}

Meteor.methods({

});
