import ReactFlux from 'keystack-react-flux';
import VcardConstants from '../constants/VcardConstants.js'
import Api from '../utils/Api';
import auth from '../utils/auth';


let VcardActions = ReactFlux.createActions({

    get : [VcardConstants.GET, function getVcard(calucroID){
		if( auth.loggedIn() )
            return Api.getVcards(calucroID);
    }],

    create: [VcardConstants.CREATE, function createVcard(calucroID){
        // Make API CALL
        if( auth.loggedIn() )
            return Api.createVcard(calucroID);
    }],

    update: [VcardConstants.UPDATE, function udpateVcard(vcard){
        // Make API CALL
        if( auth.loggedIn() )
            return Api.updateVcard(vcard);
    }],

    delete: [VcardConstants.DELETE, function deleteVcard(vcard){
        // Make API CALL
        if( auth.loggedIn() )
            return Api.deleteVcard(vcard);
    }]

});

module.exports = VcardActions;