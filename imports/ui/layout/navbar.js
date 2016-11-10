import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './navbar.html';

Template.nav.helpers({

	//used for menu active or deactive selection
  checkCurrentRoute: (routeName)=>{
    
    var currentRoute = FlowRouter.getRouteName();
    
    if(currentRoute == routeName){
      return 'active';
    }else{
      return null;
    }
  }

});
