import { Meteor } from 'meteor/meteor';

alreadyFriends = function(userId){
  var user = Meteor.user();

  return user &&
         user.profile &&
         user.profile.friends &&
         user.profile.friends.indexOf(userId)>-1;
}
