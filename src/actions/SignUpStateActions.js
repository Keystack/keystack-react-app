import ReactFlux from 'keystack-react-flux';
import SignUpStateConstants from '../constants/SignUpStateConstants.js'
import Api from '../utils/Api';
import auth from '../utils/auth';


let SignUpStateActions = ReactFlux.createActions({

    get : [SignUpStateConstants.GET, function getAction(){
		if( auth.loggedIn() )
            return Api.getUser();
    }],

    update: [SignUpStateConstants.UPDATE, function update(payload){
        // Make API CALL
        if( auth.loggedIn() )
            return Api.updateUser(payload);

    }]

});

module.exports = SignUpStateActions;