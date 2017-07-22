import ReactFlux from 'keystack-react-flux';
import InterestsConstants from '../constants/InterestsConstants';
import KeystackUtils from '../utils/keystack-utils';


const DEV_MODE = (KeystackUtils.DEV_ENV && KeystackUtils.LOG_SETTINGS.STORE);

let InterestsStore = ReactFlux.createStore({

	getInitialState: function(){
				
		if( localStorage.interests ){
			
			KeystackUtils.log("InterestsStore.getInitialState()","Loading prevState");
			
			let prevState = JSON.parse(localStorage.interests);

			return {
				data : prevState,
				status : {
					isAuth :  localStorage.token ? true : false,
					error : null
				}
			};

			return prevState;
		}

		return {
			data: null,
			status : {
				isAuth :  localStorage.token ? true : false,
				error : null
			}
		};
	},

	getStateString(){
		return JSON.stringify(this.getState());
	},

	getData(){
		return this.get('data') || [];
	},

	persist : function(){
		let state = JSON.stringify(this.getState().data);
		localStorage.interests = state;
	}

}, 
[	

	[InterestsConstants.GET, function onGet(payload){
		
		KeystackUtils.log("InterestsStore.onGet()",payload);

		this.setState({
			status : {
				loading : true,
				error : null,
				errorMsg : null
			}
		},InterestsConstants.GET);

	}],

	[InterestsConstants.GET_SUCCESS, function handleGetSuccess(payload){

		KeystackUtils.log("InterestsStore.handleGetSuccess()",payload);
		
		if( payload ){		
			
			this.setState({
				data : payload,
				status : {
					loading : false,
					isAuth : true,
					error: null
				}
			},InterestsConstants.GET_SUCCESS);

			this.persist();
		}
		
	}],

	[InterestsConstants.GET_FAIL, function handleGetFailure(error){
		
		KeystackUtils.log("InterestsStore.handleGetFailure", error);
		
		let { err } = error.details.body
		
		this.setState({
			status: {
				loading : false,
				error : err,
			}
		},InterestsConstants.GET_FAIL);
	}],
	
]);


module.exports = InterestsStore;