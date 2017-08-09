import ReactFlux from 'keystack-react-flux';
import ProAnswerConstants from '../constants/ProAnswerConstants';
import Api from '../utils/Api';

import UserActions from '../actions/UserActions';


let ProAnswerStore = ReactFlux.createStore({

	getInitialState: function(){

		return {
			data: [],
			isUpdating : false,
			error: false
		}
	},

	storeDidMount: function(){
	},

	getProAnswers: function(){
		return this.get('data');
	},

	persist : function(){
		let state = JSON.stringify(this.getState());
		localStorage.user = state;
	}
},[

	[ProAnswerConstants.GET_SUCCESS, function handleGetSuccess(payload){

		console.log("ProAnswerStore.handleGetSuccess", payload);
		
		if( payload ){			
			this.setState({
				isUpdating: false,
				error: false,
				data : payload
			});
		}			
	}],

	[ProAnswerConstants.GET_FAIL, function handleGetFail(payload){

		console.log("ProAnswerStore.handleGetFail", payload);
		
		this.setState({
			isUpdating: false,
			error: true
		});		
	}],

	[ProAnswerConstants.CREATE_SUCCESS, function handleCreateSuccess(payload){

		console.log("ProAnswerStore.handleGetSuccess", payload);

		let proAnswers = this.get('data');
		
		if( !payload.error ){
			proAnswers.push(payload);			
		}else{
			this.setState({
				isUpdating: false,
				error: payload.error,
			});
		}		
	}],

	[ProAnswerConstants.CREATE_FAIL, function handleCreateFail(payload){

		console.log("ProAnswerStore.handleCreateFail", payload);
		
		this.setState({
			isUpdating: false,
			error: true
		});		
	}],



	[ProAnswerConstants.UPDATE_SUCCESS, function handleUpdateSuccess(payload){

		console.log("ProAnswerStore.handleUpdateSuccess", payload);
		
		if( payload ){			
			this.setState({
				isUpdating: false,
				error: false,
				data : payload
			});

			UserActions.get();
		}			
	}],

	[ProAnswerConstants.UPDATE_FAIL, function handleUpdateFailure(payload){

		console.log("ProAnswerStore.handleUpdateFailure", payload);
		
		this.setState({
			isUpdating: false,
			error: true
		});		
	}],
]);



module.exports = ProAnswerStore;