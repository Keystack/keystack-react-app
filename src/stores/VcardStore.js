import ReactFlux from 'keystack-react-flux';
import VcardConstants from '../constants/VcardConstants';
import Api from '../utils/Api';

import UserActions from '../actions/UserActions';


let VcardStore = ReactFlux.createStore({

	getInitialState: function(){

		return {
			data: [],
			isUpdating : false,
			error: false
		}
	},

	storeDidMount: function(){
	},

	getVcards: function(){
		return this.get('data');
	},

	getVcardIndexById( vcardID ){
		return (vcardID)?_.findIndex(this.get('data'),{id:parseInt(vcardID)}):null;
	},

	getVCardById(id){
		return (id)?_.find(this.get('data'),{id:parseInt(id)}):null;
	},

	persist : function(){
		let state = JSON.stringify(this.getState());
		localStorage.user = state;
	}
},[

	[VcardConstants.GET_SUCCESS, function handleGetSuccess(payload){

		console.log("VcardStore.handleGetSuccess", payload);
		
		if( payload ){			
			this.setState({
				isUpdating: false,
				error: false,
				data : payload
			});
		}			
	}],

	[VcardConstants.GET_FAIL, function handleGetFail(payload){

		console.log("VcardStore.handleGetFail", payload);
		
		this.setState({
			isUpdating: false,
			error: true
		});		
	}],

	[VcardConstants.CREATE_SUCCESS, function handleCreateSuccess(payload){

		console.log("VcardStore.handleGetSuccess", payload);

		let vcards = this.get('data');
		
		if( !payload.error ){
			vcards.push(payload);
			this.setState({
				isUpdating: false,
				data: vcards
			});
		}else{
			this.setState({
				isUpdating: false,
				error: payload.error,
			});
		}			
	}],

	[VcardConstants.CREATE_FAIL, function handleCreateFail(payload){

		console.log("VcardStore.handleCreateFail", payload);
		
		this.setState({
			isUpdating: false,
			error: true
		});		
	}],


	[VcardConstants.DELETE_SUCCESS, function handleDeleteSuccess(payload){

		console.log("VcardStore.handleDeleteSuccess", payload);

		let vcards = this.get('data');
		
		if( !payload.error ){
			
			let vcardIdx = this.getVcardIndexById(payload.id);
			let vcards = this.getVcards();

			vcards = _.without(vcards,vcards[vcardIdx]);

			this.setState({
				isUpdating: false,
				data: vcards,
				error: null
			});
		}else{
			this.setState({
				isUpdating: false,
				error: payload.error,
			});
		}			
	}],

	[VcardConstants.DELETE_FAIL, function handleDeleteFail(payload){

		console.log("VcardStore.handleDeleteFail", payload);
		
		this.setState({
			isUpdating: false,
			error: true
		});		
	}],


	[VcardConstants.UPDATE_SUCCESS, function handleUpdateSuccess(payload){

		console.log("VcardStore.handleUpdateSuccess", payload);
		
		if( payload && payload.id ){

			console.log(payload);
			 
			let vcardIdx = this.getVcardIndexById(payload.id);
			let vcards = this.getVcards();

			vcards[vcardIdx] = payload;

			this.setState({
				isUpdating: false,
				data: vcards,
				error: null
			});
		}					
	}],

	[VcardConstants.UPDATE_FAIL, function handleUpdateFailure(payload){

		console.log("VcardStore.handleUpdateFailure", payload);
		
		this.setState({
			isUpdating: false,
			error: true
		});		
	}],
]);



module.exports = VcardStore;