import { Meteor } from 'meteor/meteor';
import { sAlert } from 'meteor/juliancwirko:s-alert';
import { Template } from 'meteor/templating';
import { Contacts } from '../../api/tasks.js';

import './contact.html';

Template.contact.onCreated(function usersOnCreated() {
	this.state = new ReactiveDict();
	//Meteor.subscribe('activeUsers');
	Meteor.subscribe('contacts');
});

Template.contact.helpers({

});

Template.contact.events({
 'click .submit-button': function(event){
   var name = $('#input-name').val();
   var email = $('#input-email').val();
   var message = $('#input-text').val();

   if(message != null && message != ""){
     Meteor.call('createContact',name,email,message, function(error, result){
 			if(error){
 				sAlert.error('Boom! Something went wrong!');
 			}else{
        //empty all the fields
				$('#input-name').val("");
		    $('#input-email').val("");
		    $('#input-text').val("");
 				sAlert.success('contact message sent!');
 			}
 		});
  }else{
    sAlert.error('Message field is required!');
  }
 },
});
