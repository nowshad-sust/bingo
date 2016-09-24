import '../imports/ui/layout/layout.js';
import '../imports/ui/home/home.js';
import '../imports/ui/about/about.js';
import '../imports/ui/game/game.js';


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
