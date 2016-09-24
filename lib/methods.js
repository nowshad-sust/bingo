import { Meteor } from 'meteor/meteor';

Meteor.methods({
  setFriend: function(userId){
    var query = {};

    query[alreadyFriends(userId) ? '$pull' : '$push'] = {
      'profile.friends': userId
    };

    Meteor.users.update(this.userId, query);
  }
});
