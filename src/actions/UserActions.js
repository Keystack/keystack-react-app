import ReactFlux from 'keystack-react-flux';
import UserConstants from '../constants/UserConstants.js'
import Api from '../utils/Api';
import auth from '../utils/auth';
import _ from 'lodash'

import UserStore from '../stores/UserStore';


let UserActions = ReactFlux.createActions({

	// Dispatch Login Action
    login: [UserConstants.LOGIN, function loginAction(username, password){
        // Make API CALL
        return Api.login(username,password);

    }],

    // Dispatch Login Action
    logout: [UserConstants.LOGOUT, function logoutAction(){
        // Make API CALL
        return auth.logout();

    }],

    // Dispatch Login Action
    create: [UserConstants.CREATE, function signUpAction(data){
        // Make API CALL
        return Api.signUp(data);

    }],

    get : [UserConstants.GET, function getAction(){
		if( auth.loggedIn() )
            return Api.getUser();
    }],

    getUserByNumber : [UserConstants.GET, function getUserByNumber( number ){
            return Api.getUserByNumber( number);
    }],

    update: [UserConstants.UPDATE, function update(data){
        // Make API CALL
        if( auth.loggedIn() )
            return Api.updateUser(data);

    }],

    uploadUserAvatar: [UserConstants.UPDATE_AVATAR, function upload(user,formData){
        // Make API CALL
        if( auth.loggedIn() && formData )
            return Api.uploadUserAvatar(user,formData);

    }]

});


const sampleData = {
    id : null,
    email : 'devery@keystacksolutions.com',
    first_name : 'devery',
    last_name : 'channell',
    college : 'UTD',
    receive_app_notifications : false,
    channel_ids : [],
    allow_phone_access : false,
    phone_verified: false
};


module.exports = UserActions;