import ReactFlux from 'keystack-react-flux';
import VoicemailsConstants from '../constants/VoicemailsConstants.js'
import Api from '../utils/Api';
import auth from '../utils/auth';


let VoicemailsActions = ReactFlux.createActions({

    get : [VoicemailsConstants.GET, function getVoicemails(calucroID){
		if( auth.loggedIn() )
            return Api.getVoicemails(calucroID);
    }],

    update: [VoicemailsConstants.UPDATE, function udpateVoicemail(vcard){
        // Make API CALL
        if( auth.loggedIn() )
            return Api.updateVoicemail(vcard);
    }],

    delete: [VoicemailsConstants.DELETE, function deleteVoicemail(vcard){
        // Make API CALL
        if( auth.loggedIn() )
            return Api.deleteVoicemail(vcard);
    }]
});

module.exports = VoicemailsActions;