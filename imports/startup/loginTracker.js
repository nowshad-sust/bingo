import { Tracker } from 'meteor/tracker';

//track if the user is logged in and logged out events
Deps.autorun(function(computation){
  var currentUser=Meteor.user();
  if(currentUser){
    ;
  }
  else if(!computation.firstRun){
    FlowRouter.go("/");
  }


});
