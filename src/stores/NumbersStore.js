import ReactFlux from 'keystack-react-flux';
import _ from 'lodash';

import NumbersConstants from '../constants/NumbersConstants';
import UserActions from '../actions/UserActions';

import KeystackUtils from '../utils/keystack-utils';

const defaults = {
	calucroNumbers: [],
	activeLine : null,
	status : {
		isAuth: false,
		error: null
	}
};


let NumbersStore = ReactFlux.createStore({

	getInitialState: function(){
			

		if( localStorage.calucroNumbers ){

			KeystackUtils.log("UserStore.getInitialState()","Loading prevState");
			
			let prevState = JSON.parse(localStorage.calucroNumbers);

			return _.assign({},{
				calucroNumbers : [],
				activeLine : null,
				status : {
					isAuth :  localStorage.token ? true : false,
					loading : false,
					error : null
				}
			},prevState);
		}

		return _.assign({},defaults)
	},

	storeDidMount: function(){
		// console.log("NumbersStore.storeDidMount");
	},

	getSearchNumbers(){
		return this.getActionState(NumbersConstants.SEARCH,'searchNumbers');
	},

	isSearchingForNumbers(){
		return this.getActionState(NumbersConstants.SEARCH,'isUpdating');
	},

	getNumberById(id){
		return (id)?_.find(this.get('calucroNumbers'),{id:parseInt(id)}):null;
	},

	getNumbers(){
		return this.getCalucroNumbers();
	},

	getCalucroNumbers(){
		return this.get('calucroNumbers') || [];
	},

	getActiveLine(){
		return this.get('activeLine') || null;
	},

	getNewNumber(){
		return this.get('newNumber');
	},

	getStateString(){
		return JSON.stringify(this.getState());
	},

	persist : function(){

		let {calucroNumbers,activeLine} = this.getState();
		
		let perserveState = {
			calucroNumbers : calucroNumbers,
			activeLine: activeLine
		};

		console.log("NumberStore.persist()",perserveState);

		localStorage.calucroNumbers = JSON.stringify(perserveState);
	}

}, 
	[

		[NumbersConstants.GET, function onGet(payload){
			// console.log("NumbersStore.onGet", payload);
		}],

		[NumbersConstants.GET_SUCCESS, function handleGetSuccess(payload){
			
			let mainLine = (payload.length) ? payload[0] : null;
			let activeLine = this.getActiveLine();

			this.setState({
				isUpdating: false,
				calucroNumbers : payload,
				activeLine: activeLine || mainLine,
				newNumber : null,
				error: null
			},NumbersConstants.GET_SUCCESS);

			this.persist();
		}],

		[NumbersConstants.GET_FAIL, function handleGetFail(payload){

			console.log("NumbersStore.handleGetFail", payload);
					
		}],

		[NumbersConstants.CREATE, function onCreate(payload){
			
			console.log("NumbersStore.onCreate", payload);
			
			this.setState({
				isUpdating: true
			});
		}],

		[NumbersConstants.CREATE_SUCCESS, function handleCreateSuccess(payload){
			
			let numbers = this.get('calucroNumbers');

			console.log("NumbersStore.handleCreateSuccess", payload);
			
			if( payload.id ){

				numbers.push(payload);

				this.setState({
					isUpdating: false,
					calucroNumbers: numbers,
					error: null
				},NumbersConstants.CREATE_SUCCESS);

				// Find better way to do this: could have unforseen consequences
				UserActions.get();
			}
		}],

		[NumbersConstants.UPDATE_SUCCESS, function handleUpdateSuccess(payload){

			console.log("NumbersConstants.handleUpdateSuccess", payload);
			
			if( payload && payload.id ){
				 
				let numberIdx = this.getNumberById(payload.id);
				let numbers = this.getCalucroNumbers();

				numbers[numberIdx] = payload;

				this.setState({
					isUpdating: false,
					calucroNumbers: numbers,
					error: null
				},NumbersConstants.UPDATE_SUCCESS);

				this.persist();
			}					
		}],

		[NumbersConstants.SAVE_ACTIVE_LINE, function saveActiveLine(number){

			if( number && number.length ){
				let active = [...number];
				this.setState({
					activeLine: active[0]
				},NumbersConstants.SAVE_ACTIVE_LINE);
			}
		}],

		[NumbersConstants.UPDATE_FAIL, function handleUpdateFailure(payload){

			console.log("NumbersConstants.handleUpdateFailure", payload);
			
			this.setState({
				isUpdating: false,
				error: true
			},NumbersConstants.UPDATE_FAIL);		
		}]
	]
);

NumbersStore.addActionHandler(NumbersConstants.SEARCH, {

	//returns initial state specific only to this handler
	getInitialState: function(){
		 return {
			 isUpdating: false,
			 error: null,
			 searchNumbers: [],
			 success: false
		};
	},
		
	//this gets called before the action associated with SEARCH is executed
	before: function(){
		//this inside handler callbacks refers to the action handler itself and not to the store
		this.setState({
		 isUpdating: true,
		 searchNumbers : [],
		 error: null
		});
	},
	
	//this gets called after the action associated with SEARCH succeeds or fails
	after: function(){
		this.setState({
			isUpdating: false
		});
	},
	
	//this gets called if the action associated with SEARCH succeeds
	success: function(payload){
		
		if( payload.length > 0 ){			
			this.setState({
				isUpdating: false,
				searchNumbers: payload,
				error: null
			},NumbersConstants.SEARCH_SUCCESS);
		}
		
	},
	
	//this gets called if the action associated with SEARCH fails
	fail: function(error){
		console.warn(error);
		
		this.setState({
			error: error
		},NumbersConstants.SEARCH_FAIL);
	}
});

module.exports = NumbersStore;