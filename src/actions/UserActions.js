import ReactFlux from 'keystack-react-flux';
import UserConstants from '../constants/UserConstants.js'
import Api from '../utils/Api';
import auth from '../utils/auth';


let UserActions = ReactFlux.createActions({

	// Dispatch Login Action
    login: [UserConstants.LOGIN, function loginAction(username, password){
        // Make API CALL
        return Api.login(username,password);

    }],

    // Dispatch Login Action
    create: [UserConstants.CREATE, function signUpAction(first,last, email, password){
        // Make API CALL
        return Api.signUp('devery','channell','d1@keystack.com','password23e32');;

    }],

    get : [UserConstants.GET, function getAction(){
		if( auth.loggedIn() )
            return Api.getUser();
    }],

    update: [UserConstants.UPDATE, function update(payload){
        // Make API CALL
        if( auth.loggedIn() )
            return Api.updateUser(payload);

    }]

});

// UserActions.create()
UserActions.login('d1@keystack.com','password23e32')
// UserActions.get()

module.exports = UserActions;