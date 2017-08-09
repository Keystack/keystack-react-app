import ReactFlux from 'keystack-react-flux';
import LeadsConstants from '../constants/LeadsConstants.js'
import Api from '../utils/Api';
import auth from '../utils/auth';


let LeadsActions = ReactFlux.createActions({
    get: [LeadsConstants.GET, function getLeads(id){
        // Make API CALL
        return Api.getLeads(id);
    }],
    update: [LeadsConstants.UPDATE, function updateLead(lead){
        // Make API CALL
        return Api.updateLead(lead);
    }]
});

module.exports = LeadsActions;