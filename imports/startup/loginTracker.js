import { Tracker } from 'meteor/tracker';

Deps.autorun(function(computation){
  var currentUser=Meteor.user();
  if(currentUser){
    ;
  }
  else if(!computation.firstRun){
    FlowRouter.go("/");
  }


});
