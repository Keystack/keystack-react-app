import ReactFlux from 'keystack-react-flux';
import NumbersConstants from '../constants/NumbersConstants.js'
import Api from '../utils/Api';
import auth from '../utils/auth';


let NumbersActions = ReactFlux.createActions({

    // Dispatch Login Action
    create: [NumbersConstants.CREATE, function purchaseNumber(number){
        // Make API CALL
        return Api.createCalucroNumber(number);

    }],

    saveActiveLine:[NumbersConstants.SAVE_ACTIVE_LINE, function saveActiveLine(number){
            return (number.national_number && number.name)? number : null;
    }],

    // Dispatch Login Action
    update: [NumbersConstants.UPDATE, function update(number){
        // Make API CALL
        return Api.updateCalucroNumber(number);
    }],

    search: [NumbersConstants.SEARCH, function searchAction(phone, quantity, areacode){
        // Make API CALL
        return Api.searchCalucroNumber(phone,quantity,areacode);

    }],

    get: [NumbersConstants.GET, function getNumbers(){
        // Make API CALL
        return Api.getCalucroNumbers();

    }],
   

});

module.exports = NumbersActions;