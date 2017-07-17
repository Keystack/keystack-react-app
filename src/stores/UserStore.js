import ReactFlux from 'keystack-react-flux';
import UserConstants from '../constants/UserConstants';
import Api from '../utils/Api';


let UserStore = ReactFlux.createStore({

	getInitialState: function(){
				
		if( localStorage.user ){
			console.log("UserStore.getInitialState()","Loading prevState");
			let prevState = JSON.parse(localStorage.user);
			return prevState;
		}

		return {
			data: null,
			isAuth: localStorage.token ? true : false,
			error: null
		}
	},

	storeDidMount: function(){
		// console.log("UserStore.storeDidMount");
	},

	getStateString(){
		return JSON.stringify(this.getState());
	},

	getData(){
		return this.get('data');
	},

	getEmail: function(){
		return this.get('isAuth') ? this.get('data').email : null;
	},

	isVerified: function(){
		return this.get('isAuth') ? this.get('data').phone_verified : false;
	},

	persist : function(){
		let state = JSON.stringify(this.getState());
		localStorage.user = state;
	}

}, [

	[UserConstants.GET, function onGet(payload){
		
	}],

	[UserConstants.GET_SUCCESS, function handleGetSuccess(payload){
		
		if( payload ){			
			
			this.setState({
				isUpdating: false,
				data: payload,
				isAuth : true,
				error: null
			});

			this.persist();
		}
		
	}],

	[UserConstants.GET_FAIL, function handleGetFailure(error){
		
		console.log("UserStore.handleGetFailure", error);
		
		this.setState({
			isUpdating: false,
			data: null,
			error: error.message
		});
	}],

	[UserConstants.UPDATE, function onUpdate(payload){
		
		console.log("UserStore.onUpdate", payload);
		
		this.setState({
			isUpdating: true
		});
	}],

	[UserConstants.UPDATE_SUCCESS, function handleUpdateSuccess(payload){
		
		console.log("UserStore.handleUpdateSuccess", payload);

		if( payload.id ){
			this.setState({
				isUpdating: false,
				data: payload,
				isAuth : true,
				error: null
			});
			this.persist();
		}
		
	}],

	[UserConstants.UPDATE_FAIL, function handleUpdateFailure(error){
		
		console.log("UserStore.handleUpdateFailure", error);
		
		this.setState({
			isUpdating: false,
			data: null,
			error: error.message
		});
	}],


	[UserConstants.CREATE, function onCreate(payload){
		
		console.log("UserStore.onCreate", payload);
		
		this.setState({
			isLoggingIn: true,
			error:null,
			errorMsg:null
		});
	}],


	[UserConstants.CREATE_SUCCESS, function handleCreateSuccess(payload){
		
		console.log("UserStore.handleCreateSuccess", payload);
		
		this.setState({
			isLoggingIn: false,
			error: null,
			data: payload,
			isAuth: true
		});

		this.persist();
	}],
	

	[UserConstants.CREATE_FAIL, function handleCreateFailure(error){
		
		console.log("UserStore.handleCreateFailure", error);
		
		this.setState({
			isLoggingIn: false,
			error: error.message
		});
	}],


	/**
	* Dispatcher calls this directly when it receives a USER_LOGIN message,
	* just before it tries to execute the corresponding action
	*/
	[UserConstants.LOGIN, function onLogin(payload){
		
		console.log("UserStore.onLogin", JSON.stringify(payload));
		
	}],

	[UserConstants.LOGIN_SUCCESS, function handleLoginSuccess(payload){
		
		console.log("UserStore.handleLoginSuccess",payload);
	
		this.setState({
			isLoggingIn: false,
			error: null,
			data: payload,
			isAuth: true
		});

		this.persist();
	}],


	[UserConstants.LOGIN_FAIL, function handleLoginFailure(payload){
		
		console.log("UserStore.handleLoginFailure()",payload);
		
		this.setState({
			isLoggingIn: false,
			error:true,
			errorMsg: payload.error
		});
	}]
]);

UserStore.addActionHandler(UserConstants.LOGOUT, {
	
	success: function(payload){
		
		console.log("UserStore.handleLogout",payload);

		// TODO : Find better place for this
		localStorage.clear();
		window.location.href = '/';		
		
	}
});


module.exports = UserStore;