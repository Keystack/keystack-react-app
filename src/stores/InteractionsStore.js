import ReactFlux from 'keystack-react-flux';
import InteractionsConstants from '../constants/InteractionsConstants';
import UserActions from '../actions/UserActions';
import _ from 'lodash';

let InteractionsStore = ReactFlux.createStore({

	getInitialState: function(){
		return {
			interactions: [],
			error: null
		}
	},

	storeDidMount: function(){
		// console.log("InteractionsStore.storeDidMount");
	},

	getInteractions(){
		return this.get('interactions');
	},

	getRecordings(){
		return this.getActionState(InteractionsConstants.GET_RECORDINGS,"recordings") || []
	},

	getInteractionIndexById( id ){
		return (id)?_.findIndex(this.get('interactions'),{id:parseInt(id)}):null;
	},

	getTextIndexById( id ){
		return (id)?_.findIndex(this.getActionState(InteractionsConstants.TEXT_MESSAGE_OVERVIEW,"overview"),{id:parseInt(id)}):null;
	},

	getTextIndexByLeadId( id ){
		return (id)?_.findIndex(this.getActionState(InteractionsConstants.TEXT_MESSAGE_OVERVIEW,"overview"),{lead_id:parseInt(id)}):null;
	},

	getRecordingIndexById( id ){
		return (id)?_.findIndex(this.getActionState(InteractionsConstants.GET_RECORDINGS,"recordings"),{id:parseInt(id)}):null;
	},

	getRecordingById( id ){
		return (id)?_.find(this.getActionState(InteractionsConstants.GET_RECORDINGS,"recordings"),{id:parseInt(id)}):null;
	},

	getInteractionById( id ){
		return (id)?_.find(this.get('interactions'),{id:parseInt(id)}):null;
	},

	getTextById( id ){
		return (id)?_.find(this.getActionState(InteractionsConstants.TEXT_MESSAGE_OVERVIEW,"overview"),{id:parseInt(id)}):null;
	},

	getTextByLeadId( id ){
		return (id)?_.find(this.getActionState(InteractionsConstants.TEXT_MESSAGE_OVERVIEW,"overview"),{lead_id:parseInt(id)}):null;
	},

	getStateString(){
		return JSON.stringify(this.getState());
	}
}, 
	[
		[InteractionsConstants.GET, function onGet(payload){
			// console.log("InteractionsStore.onGet", payload);
		}],

		[InteractionsConstants.GET_SUCCESS, function handleGetSuccess(payload){
			
			if( Array.isArray(payload) ){			
				this.setState({
					isUpdating: false,
					interactions: payload,
					error: null
				});
			}			
		}],

		[InteractionsConstants.CREATE, function handleCreate(payload){
			
			console.log(InteractionsConstants.CREATE,payload);

			// if interaction has a lead id store a draft under that lead drafts action state queue
			// if new interaction, store message under phone number in drafts action state queue

		}],

		[InteractionsConstants.CREATE_SUCCESS, function handleCreateSuccess(payload){

			console.log(InteractionsConstants.CREATE_SUCCESS,payload)
			
		}],

		[InteractionsConstants.CREATE_FAIL, function handleCreate(payload){
			
			console.log(payload);
			// if interaction has failed store messages under failed interactions queue using lead_id
		}],


		[InteractionsConstants.GET_FAIL, function handleGetFail(payload){

			console.log("InteractionsStore.handleGetFail", payload);
					
		}]
	]
);


InteractionsStore.addActionHandler(InteractionsConstants.GET_LATEST, {

	//returns initial state specific only to this handler
	getInitialState: function(){
		 return {
			 loading: false,
			 error: null,
			 latestInteractions: [],
			 success: false
		};
	},
		
	//this gets called before the action associated with GET_LATEST is executed
	before: function(){
		//this inside handler callbacks refers to the action handler itself and not to the store
		this.setState({
		 loading: true,
		 error: null
		});
	},
	
	//this gets called after the action associated with GET_LATEST succeeds or fails
	after: function(){
		this.setState({
			loading: false
		});
	},
	
	//this gets called if the action associated with GET_LATEST succeeds
	success: function(payload){
		
		if( payload.length > 0 ){			
			this.setState({
				loading: false,
				latestInteractions: payload.slice(0,15),
				error: null,
				success: true
			},InteractionsConstants.GET_LATEST_SUCCESS);
		}		
	},
	
	//this gets called if the action associated with GET_LATEST fails
	fail: function(error){
		console.warn(error);
		
		this.setState({
			error: error
		});
	}
});


InteractionsStore.addActionHandler(InteractionsConstants.GET_BY_ID, {

	//returns initial state specific only to this handler
	getInitialState: function(){
		 return {
			 isSaving: true,
			 error: null,
			 interactions: [],
			 success: false
		};
	},
		
	//this gets called before the action associated with GET_LATEST is executed
	before: function(){
		//this inside handler callbacks refers to the action handler itself and not to the store
		this.setState({
		 isSaving: true,
		 error: null
		});
	},
	
	//this gets called after the action associated with GET_LATEST succeeds or fails
	after: function(){
		this.setState({
			isSaving: false
		});
	},
	
	//this gets called if the action associated with GET_LATEST succeeds
	success: function(payload){

		// console.log("InteractionsStore.GET_BY_ID",payload);
		
		if( payload.length > 0 ){			
			
			this.setState({
				isUpdating: false,
				interactions: payload,
				error: null
			});
		}		
	},
	
	//this gets called if the action associated with GET_LATEST fails
	fail: function(error){
		console.warn(error);
		
		this.setState({
			error: error
		});
	}
});


InteractionsStore.addActionHandler(InteractionsConstants.TEXT_MESSAGES, {

	//returns initial state specific only to this handler
	getInitialState: function(){
		 return {
			 isSaving: true,
			 error: null,
			 interactions: [],
			 success: false
		};
	},
		
	//this gets called before the action associated with TEXT_MESSAGES is executed
	before: function(){
		//this inside handler callbacks refers to the action handler itself and not to the store
		this.setState({
		 interactions:[],
		 isSaving: true,
		 error: null
		});
	},
	
	//this gets called after the action associated with TEXT_MESSAGES succeeds or fails
	after: function(){
		this.setState({
			isSaving: false
		});
	},
	
	//this gets called if the action associated with TEXT_MESSAGES succeeds
	success: function(payload){

		console.log("InteractionsStore.TEXT_MESSAGES",payload);
		if(Array.isArray(payload)){
			this.setState({
				isUpdating: false,
				interactions: payload,
				error: null
			});
		}
		
	},
	
	//this gets called if the action associated with GET_LATEST fails
	fail: function(error){
		console.warn(error);
		
		this.setState({
			error: error
		});
	}
});



InteractionsStore.addActionHandler(InteractionsConstants.TEXT_MESSAGE_OVERVIEW, {

	//returns initial state specific only to this handler
	getInitialState: function(){
		 return {
			 isSaving: true,
			 error: null,
			 overview: [],
			 success: false
		};
	},
		
	//this gets called before the action associated with TEXT_MESSAGES is executed
	before: function(){
		//this inside handler callbacks refers to the action handler itself and not to the store
		this.setState({
		 isSaving: true,
		 error: null,
		 overview: []
		});
	},
	
	//this gets called after the action associated with TEXT_MESSAGES succeeds or fails
	after: function(){
		this.setState({
			isSaving: false
		});
	},
	
	//this gets called if the action associated with TEXT_MESSAGES succeeds
	success: function(payload){

		console.log("InteractionsStore.TEXT_MESSAGE_OVERVIEW_SUCCESS",payload);

		if(Array.isArray(payload)){

			this.setState({
				isUpdating: false,
				overview: payload,
				success:true,
				error: null
			});
		}		
	},
	
	//this gets called if the action associated with GET_LATEST fails
	fail: function(error){
		console.warn(error);
		this.setState({
			error: error
		});
	}
});

InteractionsStore.addActionHandler(InteractionsConstants.GET_RECORDINGS, {

	//returns initial state specific only to this handler
	getInitialState: function(){
		 return {
			 isSaving: true,
			 error: null,
			 recordings: [],
			 success: false
		};
	},
		
	//this gets called before the action associated with TEXT_MESSAGES is executed
	before: function(){
		//this inside handler callbacks refers to the action handler itself and not to the store
		this.setState({
		 isSaving: true,
		 error: null,
		 overview: []
		});
	},
	
	//this gets called after the action associated with TEXT_MESSAGES succeeds or fails
	after: function(){
		this.setState({
			isSaving: false
		});
	},
	
	//this gets called if the action associated with TEXT_MESSAGES succeeds
	success: function(payload){

		console.log("InteractionsStore.GET_RECORDINGS",payload);
		if(Array.isArray(payload)){
			this.setState({
				isUpdating: false,
				recordings: payload,
				error: null
			});
		}		
	},
	
	//this gets called if the action associated with GET_LATEST fails
	fail: function(error){
		console.warn(error);
		this.setState({
			error: error
		});
	}
});

module.exports = InteractionsStore;