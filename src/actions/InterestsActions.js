import ReactFlux from 'keystack-react-flux';
import InterestsConstants from '../constants/InterestsConstants';
import Api from '../utils/Api';


let InterestsActions = ReactFlux.createActions({

    get : [InterestsConstants.GET, function getAction(){
            return Api.getInterests();
    }],

});


module.exports = InterestsActions;