import request from 'superagent-bluebird-promise';
import nocache from 'superagent-no-cache';
import ReactFlux from 'keystack-react-flux';
import apiConstants from '../constants/ApiConstants';
import KeystackUtils from '../utils/keystack-utils';


const DEV_MODE = (KeystackUtils.DEV_ENV && KeystackUtils.LOG_SETTINGS.API);

let Api = (function(){


    let DEV_BASEURL = 
        ( window.location.origin === "http://localhost:3010") 
            ? 'http://localhost' : 'http://192.168.1.6';

    let BASEURL = "https://keystack.herokuapp.com"
    let API_URL = '/api/';
    let API_PORT = "3000";
    let TIMEOUT = 10000;
    let DEV_ENV = false;

    let _pendingRequests = {};


    /*
     * Custom Api Error to trigger when calls fail
     *
     * @message to send
     */

    function ApiUtilXHRError(err) {
      this.name = 'ApiUtilXHRError';
      this.details = err;
      let error = new Error(this.details.message);
      error.name = this.name;
      this.stack = error.stack;

      console.warn(error.stack);
    }

    ApiUtilXHRError.prototype = Object.create(Error.prototype);

    /*
     *
     *
     *
     */

    function abortPendingRequests(key) {
        if (_pendingRequests[key]) {
            // console.log(_pendingRequests[key]);
            _pendingRequests[key]._callback = function(){};
            _pendingRequests[key].cancel();
            _pendingRequests[key] = null;
        }
    }

    /*
     *
     *
     *
     */

    function make_base_auth(user, pass) {
      let tok = user + ':' + pass;
      let hash = btoa(tok);
      return "Basic " + hash;
    }

    /*
     *
     *
     *
     */

    function token() {
        return localStorage.token;
    }

    /*
     *
     *
     *
     */

    function makeDevUrl(suffix) {
        // console.log(DEV_BASEURL + API_URL + suffix);
        return DEV_BASEURL + ":" + API_PORT + API_URL + suffix;
    }

    /*
     *
     *
     *
     */

    function makeUrl(suffix) {
        // console.log(BASEURL + API_URL + suffix);
        return BASEURL + API_URL + suffix;
    }

    /*
     *
     *
     *
     */

    function _storeUserCredentials( data ){
        if( data === null) return;

        let { email, authentication_token } = data;

        if( email && authentication_token ){
            localStorage.token = authentication_token;
            localStorage.email = email;
        }
    }

    /*
     *
     *
     *
     */
    
    function _handleSuccess( res ){
        res = res || "{}";
        let data = JSON.parse(res.text);

        if( DEV_MODE )
            KeystackUtils.log(data);

        _storeUserCredentials(data);
        
        return data;
    };

    /*
     *
     *
     *
     */

    function _handleFail( err ){
        
        if( err.status === 403 ){
            // TODO : Forward user to login page
            localStorage.clear();
        }

        if( DEV_MODE )
            KeystackUtils.log(err);

        throw new ApiUtilXHRError(err);
    };    


    let api = {

        signUp : function( user ){
            
            // build url
            let url = DEV_ENV ? makeDevUrl('users/') : makeUrl('users/');
            let key = apiConstants.NEW_USER;

            // abort any other similar requests
            abortPendingRequests(key);

            // create a pending request and make call to api
            _pendingRequests[key] = 
                request
                    .post(url)
                    .send({password:user.password})
                    .timeout(TIMEOUT)
                    .query({ 
                      first_name: user.first_name,  
                      phone: user.phone, 
                      last_name:user.last_name, 
                      email : user.email,
                      channel_id : localStorage.channelID
                    })
                    .then(_handleSuccess,_handleFail);

            return _pendingRequests[key];
        },

        login : function(user, password){
        
            // build url
            let url = DEV_ENV ? makeDevUrl('users/me/') : makeUrl('users/me/');

            let req = {
                key : apiConstants.LOGIN
            };

            // abort any other similar requests
            abortPendingRequests(req.key);

            // create a pending request and make call to api
             _pendingRequests[req.key] = 
                request
                    .get(url)
                    .query({channel_id:localStorage.channelID})
                    .timeout(TIMEOUT)
                    .auth(user,password)
                    .then(_handleSuccess,_handleFail);

            return _pendingRequests[req.key];
        },


        getUser : function(){
          
            // build url
            let url = DEV_ENV ? makeDevUrl('users/me/') : makeUrl('users/me/');

            let req = {
                url : url,
                auth_token : localStorage.token,
                email : localStorage.email,
                key : apiConstants.GET_USER
            };

            // abort any other similar requests
            abortPendingRequests(req.key);
        
            // create a pending request and make call to api
             _pendingRequests[req.key] = 
                request
                    .get(req.url)
                    .timeout(TIMEOUT)
                    .set("X-USER-TOKEN",req.auth_token)
                    .set("X-USER-EMAIL",req.email)
                    .then(_handleSuccess,_handleFail);

            return _pendingRequests[req.key];
        },

        getUserByNumber : function(number){
          
            // build url
            let url = DEV_ENV ? makeDevUrl('users_search/') : makeUrl('users_search/');

            let req = {
                url : url,
                auth_token : localStorage.token,
                email : localStorage.email,
                key : apiConstants.GET_USER
            };

            // abort any other similar requests
            abortPendingRequests(req.key);
        
            // create a pending request and make call to api
             _pendingRequests[req.key] = 
                request
                    .get(req.url)
                    .query({search:number,channel_id : localStorage.channelID})
                    .timeout(TIMEOUT)
                    //.set("X-USER-TOKEN",req.auth_token)
                    //.set("X-USER-EMAIL",req.email)
                    .then(_handleSuccess,_handleFail);

            return _pendingRequests[req.key];
        },

        updateUser : function( user ){

            // build url
            let url = DEV_ENV ? makeDevUrl('users/' + user.id) : makeUrl('users/' + user.id);
           
            let req = {
                url : url,
                auth_token : localStorage.token,
                email : localStorage.email,
                key : apiConstants.UPDATE_USER
            };

            // abort any other similar requests
            abortPendingRequests(req.key);

            // create a pending request and make call to api
             _pendingRequests[req.key] = 
                request
                    .put(req.url)
                    .send(user)
                    .timeout(TIMEOUT)
                    .set("X-USER-TOKEN",req.auth_token)
                    .set("X-USER-EMAIL",req.email)
                    .then(_handleSuccess,_handleFail);

            return _pendingRequests[req.key];
        },

        uploadUserAvatar : function( user, formData ){

            // build url
            let url = DEV_ENV ? makeDevUrl('users/' + user.id) : makeUrl('users/' + user.id);
           
            let req = {
                url : url,
                auth_token : localStorage.token,
                email : localStorage.email,
                key : apiConstants.UPDATE_USER_AVATAR
            };

            // abort any other similar requests
            abortPendingRequests(req.key);

            // create a pending request and make call to api
             _pendingRequests[req.key] = 
                request
                    .put(req.url)
                    .send(formData)
                    .timeout(TIMEOUT)
                    .set("X-USER-TOKEN",req.auth_token)
                    .set("X-USER-EMAIL",req.email)
                    .then(_handleSuccess,_handleFail);

            return _pendingRequests[req.key];

        },

        getInterests : function(){
            
            // build url
            let url = DEV_ENV ? makeDevUrl('interests/') : makeUrl('interests/');

            let req = {
                url : url,
                auth_token : localStorage.token,
                email : localStorage.email,
                key : apiConstants.GET_INTERESTS
            };

            // abort any other similar requests
            abortPendingRequests(req.key);
        
            // create a pending request and make call to api
             _pendingRequests[req.key] = 
                request
                    .get(req.url)
                    .timeout(TIMEOUT)
                    .set("X-USER-TOKEN",req.auth_token)
                    .set("X-USER-EMAIL",req.email)
                    .then(_handleSuccess,_handleFail);

            return _pendingRequests[req.key];
        },



        
    }

    return api;

}());



module.exports = Api;


