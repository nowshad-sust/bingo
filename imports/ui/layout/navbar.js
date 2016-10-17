import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './navbar.html';

Template.nav.helpers({
  checkCurrentRoute: (routeName)=>{
    var currentRoute = FlowRouter.getRouteName();
    if(currentRoute == routeName){
      return 'active';
    }else{
      return null;
    }
  }
});
