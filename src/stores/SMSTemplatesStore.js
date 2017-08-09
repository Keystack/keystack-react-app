import ReactFlux from 'keystack-react-flux';
import SMSTemplatesConstants from '../constants/SMSTemplatesConstants';
import Api from '../utils/Api';

import UserActions from '../actions/UserActions';


let SMSTemplatesStore = ReactFlux.createStore({

	getInitialState: function(){

		return {
			data: [],
			isUpdating : false,
			error: null
		}
	},

	storeDidMount: function(){
	},

	getTemplates: function(){
		return this.get('data');
	},

	getTemplateIndexById( tempID ){
		return (tempID)?_.findIndex(this.get('data'),{id:parseInt(tempID)}):null;
	},

	getTemplateById(id){
		return (id)?_.find(this.get('data'),{id:parseInt(id)}):null;
	},

	persist : function(){
		let state = JSON.stringify(this.getState());
		localStorage.user = state;
	}
},[

	[SMSTemplatesConstants.GET_SUCCESS, function handleGetSuccess(payload){

		console.log("SMSTemplatesStore.handleGetSuccess", payload);
		
		if( payload ){			
			this.setState({
				isUpdating: false,
				error: false,
				data : payload
			});
		}			
	}],

	[SMSTemplatesConstants.GET_FAIL, function handleGetFail(payload){

		console.log("SMSTemplatesStore.handleGetFail", payload);
		
		this.setState({
			isUpdating: false,
			error: true
		});		
	}],

	[SMSTemplatesConstants.CREATE_SUCCESS, function handleCreateSuccess(payload){

		console.log("SMSTemplatesStore.handleGetSuccess", payload);
		let templates = this.get('data');
		
		if( payload ){

			templates.push(payload);

			this.setState({
				isUpdating: false,
				error: false,
				data : templates
			});

			UserActions.get();
		}			
	}],

	[SMSTemplatesConstants.CREATE_FAIL, function handleCreateFail(payload){

		console.log("SMSTemplatesStore.handleCreateFail", payload);
		
		this.setState({
			isUpdating: false,
			error: true
		});		
	}],

	[SMSTemplatesConstants.DELETE_SUCCESS, function handleDeleteSuccess(payload){

		console.log("SMSTemplatesConstants.handleDeleteSuccess", payload);

		let templates = this.get('data');
		
		if( !payload.error ){
			
			let templateIdx = this.getTemplateIndexById(payload.id);
			let templates = this.getTemplates();

			templates = _.without(templates,templates[templateIdx]);

			this.setState({
				isUpdating: false,
				data: templates,
				error: null
			});
		}else{
			this.setState({
				isUpdating: false,
				error: payload.error,
			});
		}			
	}],

	[SMSTemplatesConstants.DELETE_FAIL, function handleDeleteFail(payload){

		console.log("SMSTemplatesConstants.handleDeleteFail", payload);
		
		this.setState({
			isUpdating: false,
			error: true
		});		
	}],



	[SMSTemplatesConstants.UPDATE_SUCCESS, function handleUpdateSuccess(payload){

		console.log("SMSTemplatesStore.handleUpdateSuccess", payload);

		if( payload && payload.id ){

			console.log(payload);
			 
			let templateIdx = this.getTemplateIndexById(payload.id);
			let templates = this.getTemplates();

			templates[templateIdx] = payload;

			this.setState({
				isUpdating: false,
				data: templates,
				error: null
			});

			UserActions.get();
		}					
	}],

	[SMSTemplatesConstants.UPDATE_FAIL, function handleUpdateFailure(payload){

		console.log("SMSTemplatesStore.handleUpdateFailure", payload);
		
		this.setState({
			isUpdating: false,
			error: true
		});		
	}],
]);



module.exports = SMSTemplatesStore;