import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Games } from '../../api/tasks.js';

import './game.html';
import './game.css';


Template.game.onCreated(function gameOnCreated() {
	this.state = new ReactiveDict();
  Meteor.subscribe('games');
});


Template.game.helpers({
	games: ()=>{
		return Games.find({});
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
