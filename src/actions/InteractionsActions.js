import ReactFlux from 'keystack-react-flux';
import InteractionsConstants from '../constants/InteractionsConstants.js'
import Api from '../utils/Api';
import auth from '../utils/auth';

let InteractionsActions = ReactFlux.createActions({
    
    get : [InteractionsConstants.GET, function getInteractions(options){
        // Make API CALL
        return Api.getInteractions(options);
    }],

    create : [InteractionsConstants.CREATE, function getInteractions(options){
        // Make API CALL
        return Api.createInteraction(options);
    }],

    getTextMessages : [InteractionsConstants.TEXT_MESSAGES, function getTextMessages(options){
        // Make API CALL
        return Api.getInteractions(options);
    }],

    getTextOverview : [InteractionsConstants.TEXT_MESSAGE_OVERVIEW,function getTextOverview(options){
        // Make API CALL
        return Api.getTextOverview(options);
    }],

    getRecordings : [InteractionsConstants.GET_RECORDINGS,function getTextOverview(options){

        // Make API CALL
        return Api.getRecordings(options);
    }],


     getById : [InteractionsConstants.GET_BY_ID, function getInteractionsByID(options){
        // Make API CALL
        return Api.getInteractions(options);
    }],

    getLatest : [InteractionsConstants.GET_LATEST, function getLatestInteractions(){
        // Make API CALL
        return Api.getLatestInteractions();
    }]
});

module.exports = InteractionsActions;