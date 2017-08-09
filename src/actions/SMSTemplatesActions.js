import ReactFlux from 'keystack-react-flux';
import SMSTemplatesConstants from '../constants/SMSTemplatesConstants.js'
import Api from '../utils/Api';
import auth from '../utils/auth';


let SMSTemplatesActions = ReactFlux.createActions({

    get : [SMSTemplatesConstants.GET, function getAction(){
		if( auth.loggedIn() )
            return Api.getSMSTemplates();
    }],

    update: [SMSTemplatesConstants.UPDATE, function updateSMSTemplate(template){
        // Make API CALL
        if( auth.loggedIn() )
            return Api.updateSMSTemplate(template);
    }],

    delete: [SMSTemplatesConstants.DELETE, function deleteSMSTemplate(template){
        // Make API CALL
        if( auth.loggedIn() )
            return Api.deleteSMSTemplate(template);
    }],

    create: [SMSTemplatesConstants.CREATE, function createSMSTemplate(template){
        // Make API CALL
        if( auth.loggedIn() )
            return Api.createSMSTemplate(template);
    }]

});

module.exports = SMSTemplatesActions;