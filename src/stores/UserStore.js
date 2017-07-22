import ReactFlux from 'keystack-react-flux';
import UserConstants from '../constants/UserConstants';
import KeystackUtils from '../utils/keystack-utils';

const defaults = {
	data : {
		first_name : "",
		last_name : "",
		phone : "",
		channel_id: (localStorage)?localStorage.channelID : '',
		interests : [],
	},
	status : {
		isAuth: false,
		error: null
	}
};

let UserStore = ReactFlux.createStore({

	getInitialState: function(){
				
		if( localStorage.user ){

			KeystackUtils.log("UserStore.getInitialState()","Loading prevState");
			
			let prevState = JSON.parse(localStorage.user);

			return {
				data : _.assign({},defaults,prevState),
				status : {
					isAuth :  localStorage.token ? true : false,
					loading : false,
					error : null
				}
			};
		}

		return _.assign({},defaults)
	},

	getStateString(){
		return JSON.stringify(this.getState());
	},

	isAuth(){
		return this.getStatus('isAuth');
	},

	getData(){
		return this.get('data') || {};
	},

	getAttribute( attr ){
		return this.get('data')[attr];
	},

	getStatus(attr){
		return (attr) ? this.get('status')[attr] : this.get('status')
	},

	getName(){
		let name = "";

		if( this.getAttribute('first_name') )
			name = name.concat(this.getAttribute('first_name'));

		if( this.getAttribute('last_name') )
			name = name.concat(" ",this.getAttribute('last_name'))

		return name;
	},

	persist : function(){
		let state = JSON.stringify(this.get('data'));
		localStorage.user = state;
	}

}, 
[
	[UserConstants.LOGIN, function onLogin(payload){
		
		KeystackUtils.log("UserStore.onLogin", JSON.stringify(payload));
		
	}],

	[UserConstants.LOGIN_SUCCESS, function handleLoginSuccess(payload){
		
		KeystackUtils.log("UserStore.handleLoginSuccess",payload);
		
		if( payload.id ){
			this.setState({
				status:{
					loading : false,
					error : null,			
					isAuth : true
				},
				data : payload
			},UserConstants.LOGIN_SUCCESS);	
		}		

		this.persist();
	}],


	[UserConstants.LOGIN_FAIL, function handleLoginFailure(error){
		
		KeystackUtils.log("UserStore.handleLoginFailure()", payload);

		let { err } = error.details.body
		
		this.setState({
			status: {
				loading : false,
				error : err,
			},
		},UserConstants.LOGIN_FAIL);
	}],

	[UserConstants.GET, function onGet(payload){
		KeystackUtils.log("UserStore.onGet()",payload);

		this.setState({
			status : {
				loading : true,
				error : null,
				errorMsg : null
			}
		},UserConstants.GET);

	}],

	[UserConstants.GET_SUCCESS, function handleGetSuccess(payload){

		KeystackUtils.log("UserStore.handleGetSuccess()",payload);
		
		if( payload.id ){			
			
			this.setState({
				status:{
					loading : false,
					error : null,			
					isAuth : true
				},
				data : payload
			},UserConstants.GET_SUCCESS);

			this.persist();
		}else if(payload.error){
			this.setState({
				status: {
					loading : false,
					error : payload.error,
				},
			},UserConstants.GET_FAIL);
			
		}
		
	}],

	[UserConstants.GET_FAIL, function handleGetFailure(error){
		
		KeystackUtils.log("UserStore.handleGetFailure", error);
		
		let { err } = error.details.body
		
		this.setState({
			status: {
				loading : false,
				error : err,
			},
		},UserConstants.GET_FAIL);
	}],


	[UserConstants.UPDATE, function onUpdate(payload){
		
		KeystackUtils.log("UserStore.onUpdate", payload);
		
		this.setState({
			status : {
				loading : true,
				error : null,
				errorMsg : null
			}
		},UserConstants.UPDATE);
	}],

	[UserConstants.UPDATE_SUCCESS, function handleUpdateSuccess(payload){
		
		KeystackUtils.log("UserStore.handleUpdateSuccess", payload);

		if( payload.id ){
			this.setState({
				status:{
					loading : false,
					error : null,			
					isAuth : true
				},
				data : payload
			},UserConstants.UPDATE_SUCCESS);
			this.persist();
		}
		
	}],

	[UserConstants.UPDATE_AVATAR, function onUpdateAvatar(payload){
		
		KeystackUtils.log("UserStore.onUpdateAvatar", payload);
		
		this.setState({
			status : {
				loading : true,
				error : null,
				errorMsg : null
			}
		},UserConstants.UPDATE_AVATAR);
	}],

	[UserConstants.UPDATE_AVATAR_SUCCESS, function handleUpdateAvatarSuccess(payload){
		
		KeystackUtils.log("UserStore.handleUpdateAvatarSuccess", payload);

		if( payload.id ){

			this.setState({
				status:{
					loading : false,
					error : null,			
					isAuth : true
				},
				data : payload
			},UserConstants.UPDATE_AVATAR_SUCCESS);

			this.persist();
		}
		
	}],

	[UserConstants.UPDATE_AVATAR_FAIL, function handleUpdateAvatarFailure(error){
		
		KeystackUtils.log("UserStore.handleUpdateAvatarFailure", error);
		
		let { err } = error.details.body
		
		this.setState({
			status: {
				loading : false,
				error : err,
			}
		},UserConstants.UPDATE_AVATAR_FAIL);
	}],


	[UserConstants.CREATE, function onCreate(payload){
		
		KeystackUtils.log("UserStore.onCreate", payload);
		
		this.setState({
			status : {
				loading : true,
				error : null,
				errorMsg : null
			}
		},UserConstants.CREATE);
	}],


	[UserConstants.CREATE_SUCCESS, function handleCreateSuccess(payload){
		KeystackUtils.log("UserStore.handleCreateSuccess", payload);
		
		this.setState({
			status:{
				loading : false,
				error : null,			
				isAuth : true
			},
			data: payload,
		},UserConstants.CREATE_SUCCESS);

		this.persist();
	}],
	

	[UserConstants.CREATE_FAIL, function handleCreateFailure(err){
		
		KeystackUtils.log("UserStore.handleCreateFailure", err);

		let { error } = err.details.body;
		
		this.setState({
			status: {
				loading : false,
				error : error || "Error creating user, check your information!",
			},
		},UserConstants.CREATE_FAIL);
	}]

	
]);

UserStore.addActionHandler(UserConstants.LOGOUT, {
	
	success: function(payload){
		
		KeystackUtils.log("UserStore.handleLogout",payload);

		localStorage.clear();		
	}
});


module.exports = UserStore;