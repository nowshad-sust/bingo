import './home.html';
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import  '../../api/tasks.js';

Template.quote.onCreated(function HomeOnCreated() {

	//quote api
  	var quote = $.getJSON("http://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1&_jsonp=?", function(data){
      if(data){
          $("#quote").append(data[0].content + "<br>" + data[0].title);
      }else{
      	  //writing something else if api fails
          $("#quote").append("Make your every heartbeat count.");
          }
    });
	
});
