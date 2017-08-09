import ReactFlux from 'keystack-react-flux';
import ProAnswerConstants from '../constants/ProAnswerConstants.js'
import Api from '../utils/Api';
import auth from '../utils/auth';


let ProAnswerActions = ReactFlux.createActions({

    get : [ProAnswerConstants.GET, function getProAnswers(calucroID){
		if( auth.loggedIn() )
            return Api.getProAnswers(calucroID);
    }],

    create: [ProAnswerConstants.CREATE, function createProAnswer(calucroID){
        // Make API CALL
        if( auth.loggedIn() )
            return Api.createProAnswer(calucroID);
    }],

    delete: [ProAnswerConstants.DELETE, function deleteProAnswer(proAnswerID){
        // Make API CALL
        if( auth.loggedIn() )
            return Api.deleteProAnswer(proAnswerID);
    }]

});

module.exports = ProAnswerActions;