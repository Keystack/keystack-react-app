import ReactFlux from 'keystack-react-flux';
import LeadsConstants from '../constants/LeadsConstants';
import UserActions from '../actions/UserActions';
import _ from 'lodash';

let LeadsStore = ReactFlux.createStore({

	getInitialState: function(){
		return {
			leads: [],
			error: null
		}
	},

	storeDidMount: function(){
		// console.log("LeadsStore.storeDidMount");
	},

	getLeadIndexById( leadId ){
		return (leadId)?_.findIndex(this.get('leads'),{id:parseInt(leadId)}):null;
	},

	getLeadById( leadId ){
		return (leadId)?_.find(this.get('leads'),{id:parseInt(leadId)}):null;
	},

	getLeads(){
		return this.get('leads');
	},

	getStateString(){
		return JSON.stringify(this.getState());
	}

}, 
	[
		[LeadsConstants.GET, function onGet(payload){
			
		}],

		[LeadsConstants.GET_SUCCESS, function handleGetSuccess(payload){

			
			if( Array.isArray(payload) ){			
				this.setState({
					isUpdating: false,
					leads: payload,
					error: null
				});
			}			
		}],

		[LeadsConstants.GET_FAIL, function handleGetFail(payload){

			console.log("LeadsStore.handleGetFail", payload);
					
		}],

		[LeadsConstants.UPDATE_SUCCESS, function handleUpdateSuccess(payload){

			
			if( payload && payload.id ){

				console.log(payload);
				 
				let leadIdx = this.getLeadIndexById(payload.id);
				let leads = this.getLeads();

				leads[leadIdx] = payload;

				this.setState({
					isUpdating: false,
					leads: leads,
					error: null
				});
			}			
		}],
	]
);

module.exports = LeadsStore;