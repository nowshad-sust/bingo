import { Meteor } from 'meteor/meteor';
import { sAlert } from 'meteor/juliancwirko:s-alert';
import { Template } from 'meteor/templating';
import { Games } from '../../api/tasks.js';

import './users.html';

Template.users.onCreated(function usersOnCreated() {
	this.state = new ReactiveDict();
	//Meteor.subscribe('activeUsers');
	Meteor.subscribe('userGames');
	Meteor.subscribe('allUsers');

});



Template.users.onRendered(function() {
});

Template.users.helpers({
	requestSettings: function () {
		var userId = Meteor.user()._id;
			var users = Meteor.users.find({ _id: { $ne: Meteor.user()._id} }, {sort: {'status.online': -1}},{username: 1,'profile.name':1, status:1} );

			if(users.length <= 0) {
				return null;
			}

			userList = [];
			users.forEach(function(user){
				var tempGame = Games.findOne({ $or: 
											[
											{ $and: [{userId:userId},{opponentId:user._id}]},
											{ $and: [{userId:user._id},{opponentId:userId}]}
											],needsConfirmation: true});

			 	var runningGame = Games.findOne({ $or: [
												{ $and: [{userId:userId},{opponentId:user._id}]},
												{ $and: [{userId:user._id},{opponentId:userId}]}
												],
												needsConfirmation: false, response: 'running'});
				
				var username = (user.username != null && user.username != "") ? user.username : user.profile.name;
				
				var isUserOnline = function () {
					if(user.status.online){
						return new Spacebars.SafeString('<i class="fa fa-circle" title="User is online" aria-hidden="true" style="color:lime;"></i> Online');
					} else {
						return new Spacebars.SafeString('<i class="fa fa-circle" title="User is offline" aria-hidden="true" style="color:orange;"></i> Offline');	
					}					 
				};

				var link = function(){
					if(runningGame){
						return new Spacebars.SafeString('<a class="btn btn-xs btn-default" href="games/'+ runningGame._id +'">Continue</a>');
					}else if(tempGame){
                    	if(tempGame.userId == userId){
                    		return new Spacebars.SafeString('<button type="button" game_id="'+ tempGame._id +'" class="btn-cancel btn btn-xs btn-danger">Cancel</button>');		
                    	}else{
                    		return new Spacebars.SafeString('<button type="button" game_id="'+ tempGame._id +'" class="btn-accept btn btn-xs btn-success">Accept</button>' +
                    										'<button type="button" game_id="'+ tempGame._id +'" class="btn-decline btn btn-xs btn-danger">Decline</button>');
                    	}                          
                          
                    }else{
                    	return new Spacebars.SafeString('<button type="button" user_id="'+ user._id +'" class="btn-create btn btn-xs btn-info">Invite</button>');
                        
                    }
				};

				userDetails = {
					username: username,
					status: isUserOnline,
					link: link
				};
				userList.push(userDetails);
		});

        return {
            collection: userList,
            rowsPerPage: 10,
            showFilter: true,
			sortable: false,
            fields: [
					{key: 'user.status.online', label: 'Status', sortOrder: 1, sortDirection: 'descending', hidden: true},
					{key: 'username', label: 'User'},
					{key: 'status', label: 'Status'},
					{key: 'link', label: 'Action'}

				]
        };
    },
});

Template.users.events({

	'click .btn-create': function(event){
		var opponentId = event.target.getAttribute("user_id");
		var userId = Meteor.user()._id;
		//create a new game between these two users
		$response = Meteor.call('createGame',userId,opponentId, function(error, result){
			if(error){
				sAlert.error('Boom! Something went wrong!');
			}else{
				FlowRouter.go('mygames');
				sAlert.success('Game request sent!');
			}
		});

	},
	'click .btn-cancel': function(event){
		var gameId = event.target.getAttribute("game_id");
		//cancel the request
		Meteor.call('cancelGame', gameId, function(error, result){
			if(error){
				sAlert.error('Boom! Something went wrong!');
			}else{
					sAlert.warning('Game request cancelled!');
			}
		});
	},

	'click .btn-decline': function(event){
			var gameId = event.target.getAttribute("game_id");
			//cancel the request
			Meteor.call('cancelGame', gameId, (error, result)=>{
				if(error){
					sAlert.error('Boom! Something went wrong!');
				}else{
						sAlert.warning('Game request Declined!');
				}

			});
		},

	'click .btn-accept': function(event){
		var gameId = event.target.getAttribute("game_id");
		//initiate a game here;
		Meteor.call('acceptGame', gameId, (error, result)=>{
			if(error){
				sAlert.error('Boom! Something went wrong!');
			}else{
				console.log("game accepted: " + result);
				sAlert.success('Game request is accepted!');
			}
			FlowRouter.go('games',{gameId: gameId});
		});
	},


});
