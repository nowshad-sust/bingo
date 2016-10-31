import '../imports/startup/accounts-config.js';
import '../imports/startup/loginTracker.js';
import { sAlert } from 'meteor/juliancwirko:s-alert';

Meteor.startup(function () {

    sAlert.config({
        effect: 'genie',
        position: 'bottom-right',
        timeout: 5000,
        html: true,
        onRouteClose: true,
        stack: true,
        // or you can pass an object:
        // stack: {
        //     spacing: 10 // in px
        //     limit: 3 // when fourth alert appears all previous ones are cleared
        // }
        offset: 30, // in px - will be added to first alert (bottom or top - depends of the position in config)
        beep: false,
        // examples:
        // beep: '/beep.mp3'  // or you can pass an object:
        // beep: {
        //     info: '/beep-info.mp3',
        //     error: '/beep-error.mp3',
        //     success: '/beep-success.mp3',
        //     warning: '/beep-warning.mp3'
        // }
        onClose: _.noop //
        // examples:
        // onClose: function() {
        //     /* Code here will be executed once the alert closes. */
        // }
    });

});

$(document).on('click',function(){
    $('.nav-menu').collapse('hide');
})