import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Games = new Mongo.Collection('games');
export const Contacts = new Mongo.Collection('contacts');

if (Meteor.isServer) {

  Meteor.users.deny({
    update: function() {
      return true;
    }
  });

  Meteor.publish('users', function UsersPublication() {
    return Meteor.users.find({},{username: 1, profile: 1});
  });

  Meteor.publish('thisGame', function ThisGamePublication(gameId) {
    var game = Games.find({ _id: gameId });
    return game;
  });

  Meteor.publish('specThisGame', function(gameId) {
    //Meteor._sleepForMs(5000);
    return Games.find({ _id: gameId });
  });

  Meteor.publish('delayed', function (gameId,delay) {
  let isStopped = false;

  const handle = Games.find({  _id: gameId }).observeChanges({
    
    added: (id, fields) => {
      Meteor.setTimeout(() => {
        if (!isStopped) {
          this.added(Games._name, id, fields);
        }
      }, delay);
    },
    changed: (id, fields) => {
      Meteor.setTimeout(() => {
        if (!isStopped) {
          this.changed(Games._name, id, fields);
        }
      }, delay);
    },
    removed: (id) => {
      Meteor.setTimeout(() => {
        if (!isStopped) {
          this.removed(Games._name, id);
        }
      }, delay);
    }
  });

  this.onStop(() => {
    isStopped = true;
    handle.stop();
  });

  this.ready();
});

  Meteor.publish("activeUsers", function() {
    return Meteor.users.find({ "status.online": true },{username:1,'profile.name':1, status:1});
  });

  Meteor.publish("allUsers", function() {
    return Meteor.users.find({},{sort: {'status.online': -1}},{username:1,'profile.name':1, status:1});
  });

  Meteor.publish("contacts", function() {
    return Contacts.find({});
  });

  Meteor.publish("allGames", function() {
    return Games.find({});
  });


  Meteor.publish("spectateGames", function() {

    var userId = this.userId;

    var t = new Date();
    t.setSeconds(t.getSeconds() - 60);
    //get the games those are updated inbetween last 60 seconds
    return Games.find({ 'mainGame.result': null,
                        $or:[
                          {'mainGame.timestamp': { $gte : t }},
                          {'mainGame.lastSelection.timestamp': { $gte : t }}
                        ],
                        userId: { $ne: userId },
                        opponentId: { $ne: userId }
                      });
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

  Meteor.publish("userGames", function() {
    var userId = this.userId;

    var games =  Games.find({ $or:[{userId: userId},{opponentId: userId}]},
                              { _id : 1,
                                userId : 1,
                                opponentId : 1,
                                needsConfirmation : 1,
                                response : 1
                            });

    if(games){
      return games;
    }else{
      console.log("no games published");
      return null;
    }

  });

}
