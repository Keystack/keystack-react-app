import ReactFlux from 'keystack-react-flux';
import SignUpStateConstants from '../constants/SignUpStateConstants';
import Api from '../utils/Api';

import UserActions from '../actions/UserActions';


let SignUpStateStore = ReactFlux.createStore({

	getInitialState: function(){
				
		if( localStorage.user ){
			// console.log("SignUpStateStore.getInitialState()","Loading prevState");
			let prevState = JSON.parse(localStorage.user);
			return prevState;
		}

		return {
			setup_step: null,
			isUpdating : false,
			error: null
		}
	},

	storeDidMount: function(){
	},

	getStep: function(){
		return this.get('setup_step')
	},

	persist : function(){
		let state = JSON.stringify(this.getState());
		localStorage.user = state;
	}
}, [

	[SignUpStateConstants.GET_SUCCESS, function handleGetSuccess(payload){

		console.log("NumbersStore.handleGetSuccess", payload);
		
		if( payload ){			
			this.setState({
				isUpdating: false,
				setup_step: payload.setup_step
			});
		}			
	}],

	[SignUpStateConstants.GET_FAIL, function handleGetSuccess(payload){

		console.log("NumbersStore.handleGetSuccess", payload);
		
		this.setState({
			isUpdating: false,
			error: true
		});		
	}],


	[SignUpStateConstants.UPDATE_SUCCESS, function handleUpdateSuccess(payload){

		console.log("NumbersStore.handleUpdateSuccess", payload);
		
		if( payload ){			
			this.setState({
				isUpdating: false,
				setup_step: payload.setup_step
			});

			UserActions.get();
		}			
	}],

	[SignUpStateConstants.UPDATE_FAIL, function handleUpdateFailure(payload){

		console.log("NumbersStore.handleUpdateFailure", payload);
		
		this.setState({
			isUpdating: false,
			error: true
		});		
	}],
]);



module.exports = SignUpStateStore;