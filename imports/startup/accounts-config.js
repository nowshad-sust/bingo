import { Accounts } from 'meteor/accounts-base';
//setting login requirements
Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_EMAIL',
});
