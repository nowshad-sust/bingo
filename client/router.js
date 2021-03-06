//importing all libs and layouts
import { Meteor } from 'meteor/meteor';

import '../imports/ui/layout/layout.js';
import '../imports/ui/home/home.js';
import '../imports/ui/about/about.js';
import '../imports/ui/game/myGames.js';
import '../imports/ui/game/game.js';
import '../imports/ui/spectate/spectateList.js';
import '../imports/ui/spectate/spectate.js';
import '../imports/ui/stats/stats.js';
import '../imports/ui/users/users.js';
import '../imports/ui/contact/contact.js';
import '../imports/ui/admin/contact.js';
import '../imports/ui/admin/dashboard.js';
//end of import


//tracker to get some loading effect
Tracker.autorun(function() {
    
    if(!FlowRouter.subsReady()){
      $('body').hide();
    }else{
      $('body').fadeIn( "slow");
    }

});
//end of tracker



//declaring routes
FlowRouter.route('/',{
  name: 'home',
  action(){
    BlazeLayout.render('layout', {child:'home'});
  }
});

FlowRouter.route('/about',{
  name: 'about',
  action(){
    BlazeLayout.render('layout', {child:'about'});
  }
});

FlowRouter.route('/users',{
  name: 'users',
  triggersEnter: [isLoggedIn],
  action(){
    BlazeLayout.render('layout', {child:'users'});
  }
});

FlowRouter.route('/mygames',{
  name: 'mygames',
  triggersEnter: [isLoggedIn],
  action(){
    BlazeLayout.render('layout', {child:'myGames'});
  }
});

FlowRouter.route('/games/:gameId',{
  name: 'games',
  triggersEnter: [isLoggedIn],
  action: function(params, queryParams) {
        BlazeLayout.render('layout', {child:'game'});
    }
});

FlowRouter.route('/spectategames',{
  name: 'spectategames',
  triggersEnter: [isLoggedIn],
  action(){
    BlazeLayout.render('layout', {child:'spectateList'});
  }
});

FlowRouter.route('/spectate/:gameId',{
  name: 'spectate',
  triggersEnter: [isLoggedIn],
  action: function(params, queryParams) {
        BlazeLayout.render('layout', {child:'spectate'});
    }
});

FlowRouter.route('/contact',{
  name: 'contact',
  action(){
    BlazeLayout.render('layout', {child:'contact'});
  }
});

FlowRouter.route('/stats',{
  name: 'stats',
  triggersEnter: [isLoggedIn],
  action(){
    BlazeLayout.render('layout', {child:'stats'});
  }
});


//*********ADMIN ROUTES**********

var adminRoutes = FlowRouter.group({
  prefix: '/admin',
  name: 'admin',
  triggersEnter: [function(context, redirect) {
      Meteor.call('isAdmin', function(error, result){
        if(error || !result){
          sAlert.error('You are not an admin',{timeout:2000,position: 'bottom-right'});
          FlowRouter.go('/');
        }
      });
  }]
});

// handling /admin route
adminRoutes.route('/', {
  action: function() {
    BlazeLayout.render('layout', {child: 'adminDashboard'});
  }
});

// handling /admin/contact
adminRoutes.route('/contact', {
  action(){
    BlazeLayout.render('layout', {child:'adminContact'});
  }
});

function isLoggedIn(){
  if(!Meteor.userId()){
    sAlert.error('Please log in',{timeout:5000,position: 'bottom-right'});
    FlowRouter.go('/');
  }
}
