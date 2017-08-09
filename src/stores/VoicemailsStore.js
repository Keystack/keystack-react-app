import ReactFlux from 'keystack-react-flux';
import VoicemailsConstants from '../constants/VoicemailsConstants';
import UserActions from '../actions/UserActions';
import _ from 'lodash';

let VoicemailsStore = ReactFlux.createStore({

	getInitialState: function(){
		return {
			voicemails: [],
			error: null
		}
	},

	storeDidMount: function(){
		// console.log("VoicemailsStore.storeDidMount");
	},

	getVoicemailIndexById( voicemailId ){
		return (voicemailId)?_.findIndex(this.get('voicemails'),{id:parseInt(voicemailId)}):null;
	},

	getVoicemailById( voicemailId ){
		return (voicemailId)?_.find(this.get('voicemails'),{id:parseInt(voicemailId)}):null;
	},

	getVoicemails(){
		return this.get('voicemails');
	},

	getStateString(){
		return JSON.stringify(this.getState());
	}

}, 
	[
		[VoicemailsConstants.GET, function onGet(payload){
			
		}],

		[VoicemailsConstants.GET_SUCCESS, function handleGetSuccess(payload){

			
			if( Array.isArray(payload) ){			
				this.setState({
					isUpdating: false,
					voicemails: payload,
					error: null
				});
			}			
		}],

		[VoicemailsConstants.GET_FAIL, function handleGetFail(payload){

			console.log("VoicemailsStore.handleGetFail", payload);
					
		}],

		[VoicemailsConstants.UPDATE_SUCCESS, function handleUpdateSuccess(payload){

			
			if( payload && payload.id ){

				console.log(payload);
				 
				let voicemailIdx = this.getVoicemailIndexById(payload.id);
				let voicemails = this.getVoicemails();

				voicemails[voicemailIdx] = payload;

				this.setState({
					isUpdating: false,
					voicemails: voicemails,
					error: null
				});
			}			
		}],
	]
);

module.exports = VoicemailsStore;