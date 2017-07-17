npimport ReactFlux from 'keystack-react-flux';
import AppConstants from '../constants/AppConstants';
import UserActions from '../actions/UserActions';
import _ from 'lodash';

var ApplicationStateStore = ReactFlux.createStore({

	getInitialState: function(){

		if( localStorage.applicationState ){
			console.log("ApplicationStateStore.getInitialState()","Loading prevState");
			let prevState = JSON.parse(localStorage.applicationState);
			return prevState;
		}

		return {
			state: {},
			error: null
		}
	},

	storeDidMount: function(){
	},

	getStateString(){
		return JSON.stringify(this.getState());
	},

	persist : function(){
		let state = JSON.stringify(this.getState());
		localStorage.applicationState = state;
	}

}, 
	[]
);

module.exports = LeadsStore;