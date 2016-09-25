import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Games } from '../../api/tasks.js';

import './game.html';
import './game.css';


Template.game.onCreated(function gameOnCreated() {
	this.state = new ReactiveDict();
	Meteor.subscribe('users');
	Meteor.subscribe('myGames');
});


Template.game.helpers({
	myGames: ()=>{
		var userId = Meteor.user()._id;
		return Games.find({ $or: [{firstUserId:userId},{secondUserId:userId}]});
	},
	ifCheck: (index)=> {
		if(index==5 || index==10 || index==15 || index==20){
        return '</tr><tr>';
    }else if(index==0){
      return '<tr>';
    }else if(index==24){
      return '</tr>';
    }else {
      return null;
    }
	},
  numbers: ()=>{
    var numbers = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25];

    return shuffle(numbers);

  },
});

Template.game.events({
	'change #search-field': function(event){
		var value = $('#search-field').val();
		console.log('changing:' + value);
		var users;
		if(!value){
			 users = Meteor.users.find({ "status.online": true, _id: { $ne: Meteor.user()._id} });
		}else{
			console.log('not empty search');
			users = Meteor.users.find({ "status.online": true,
			 														_id: { $ne: Meteor.user()._id},
																	$or: [{username: {'$regex': value}},
																	{'profile.name': {'$regex': value}}]});
		}

	return users;
	}
});

function shuffle (array) {
  var i = 0
    , j = 0
    , temp = null

  for (i = array.length - 1; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1))
    temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
  return array;
}
