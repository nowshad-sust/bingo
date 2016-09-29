import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './layout.html';

Template.layout.helpers({
  checkCurrentRoute: (routeName)=>{
    var currentRoute = FlowRouter.getRouteName();
    if(currentRoute == routeName){
      return 'active';
    }else{
      return null;
    }
  }
});
