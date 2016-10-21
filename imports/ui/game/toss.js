import './toss.html';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Games } from '../../api/tasks.js';
import { sAlert } from 'meteor/juliancwirko:s-alert';


Template.toss.onCreated(function gameOnCreated() {
	this.state = new ReactiveDict();
	Meteor.subscribe('users');
});


Template.toss.onRendered(function gameOnCreated() {

  setTimeout(function(){
    $('#toss-coin').html("<img src='http://orig06.deviantart.net/712c/f/2010/236/2/e/spinning_coin___animation_by_mantastic001.gif'>");
  },2000);

  setTimeout(function(){
    $('#toss-coin').html("<h1>You Won The Toss!</h1>");
  },5000);

});
