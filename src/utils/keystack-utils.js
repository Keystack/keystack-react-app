 const env_settings = {
	DEV_ENV : true,
	IS_MOBILE : false,
	LOG_SETTINGS : {
		API : true,
		STORE : true,
		ACTIONS : true,
		VIEW : true
	}
};

const validateEmail  = function (email) {
  let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

const prettyNumber = function(value){
	if(value === undefined ) return value;

	if( value.length > 9 )value = value.substring(0,10);

	value = (value.replaceAll("[- \/\\^$*+?.\\(\\)\\[\\]\\{\\}a-z]",""))
 		.replace(/^(\d{3})(\d)/, '($1) $2')
 		.replace(/^(\(\d{3}\) \d{3})(\d)/, '$1-$2')

	 return value;
}

const unPrettyNumber = function(value){
	if(value === undefined) return '';
	return value.replaceAll("[- \/\\^$*+?.\\(\\)\\[\\]\\{\\}]","");
}

function throttle(callback, wait, context = this) {
  let timeout = null 
  let callbackArgs = null
  
  const later = () => {
    callback.apply(context, callbackArgs)
    timeout = null
  }
  
  return function() {
    if (!timeout) {
      callbackArgs = arguments
      timeout = setTimeout(later, wait)
    }
  }
}

const KeystackUtils = {

	log : function( contextStr, arg1 ) {

		if( !env_settings.DEV_ENV )
			return;

		if( env_settings.IS_MOBILE )
			this.logForMobile( [contextStr, arg1] )
		else console.log(...arguments);

	},

	unPrettyNumber : unPrettyNumber,

	prettyNumber : prettyNumber,

	logForMobile : function( outputArr ) {
		
		if( outputArr ){
			outputArr.map( function(key,index){
				if( typeof key === "string" )
					console.log(key);
				else
					console.log(JSON.stringify(key));
			})
		}
	},

	throttle : throttle,

	validateEmail : validateEmail
};

 module.exports = Object.assign({},KeystackUtils,env_settings);

