import auth from  '../utils/auth';

const validate = {
	requireAuth : function (nextState, replace) {

		if ( !auth.loggedIn() ) {
			console.log('[RouteValidationUtil:requireAuth]','User not logged in. Forwarding to login page.'); 	
		    replace({
		      pathname: '/login',
		      state: { 
		        nextPathname: nextState.location.pathname 
		      }
		    });
	  	}
	}
};

module.exports = validate;