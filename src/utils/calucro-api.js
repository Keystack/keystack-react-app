import request from 'superagent-bluebird-promise';
import nocache from 'superagent-no-cache';
import ReactFlux from 'keystack-react-flux';
import apiConstants from '../constants/ApiConstants';

let DEV_BASEURL = ( window.location.origin === "http://localhost:3010") ? 'http://localhost' : 'http://192.168.1.6';
let BASEURL = "http://calucro-staging.herokuapp.com"
let API_URL = '/api/';
let API_PORT = "3000";
let TIMEOUT = 10000;
let DEV_ENV = false;

let _pendingRequests = {};

function abortPendingRequests(key) {
    if (_pendingRequests[key]) {
    	// console.log(_pendingRequests[key]);
        _pendingRequests[key]._callback = function(){};
        _pendingRequests[key].cancel();
        _pendingRequests[key] = null;
    }
}

function make_base_auth(user, pass) {
  let tok = user + ':' + pass;
  let hash = btoa(tok);
  return "Basic " + hash;
}


function token() {
    return localStorage.token;
}

function makeDevUrl(suffix) {
    // console.log(DEV_BASEURL + API_URL + suffix);
    return DEV_BASEURL + ":" + API_PORT + API_URL + suffix;
}

function makeUrl(suffix) {
    // console.log(BASEURL + API_URL + suffix);
    return BASEURL + API_URL + suffix;
}

let Api = {    

    requestPhoneVerification : function(phone){

        let auth_token = localStorage.token;
        let email = localStorage.email;
        let key = apiConstants.REQUEST_PHONE_VERIFICATION;
        
        //console.log("APIUTIL.requestPhoneVerification()",phone,email,auth_token);

        if(!phone || phone.length < 10 || !email || !auth_token )
            throw new Error("APIUTILS: Valid phone number required to verify number -- as well as a valid user token");

        // build url
        let url = DEV_ENV ? makeDevUrl('request_phone_verification/') : makeUrl('request_phone_verification/');
        

        // abort any other similar requests
        abortPendingRequests(key);

        let success = function(res){
            console.log("APIUTIL.requestPhoneVerification()");
            console.log(res.text);

            res = res || "{}";
            let data = JSON.parse(res.text);

            let { email , authentication_token } = data;

            if( email && authentication_token ){
                localStorage.token = authentication_token;
                localStorage.email = email;
            }

            return data;
        };

        let error = function(err){
            if(err.status === 403){
                alert('Authentication error -- logging out!');
                localStorage.clear();
            }

            throw "APIUTIL.requestPhoneVerification()";
            console.warn(err);

            return err;
        };

        // create a pending request and make call to api
         _pendingRequests[key] = 
            request
                .get(url)
                .timeout(TIMEOUT)
                .query({phone:phone})
                .set("X-USER-TOKEN",auth_token)
                .set("X-USER-EMAIL",email)
                .then(success,error);

        return _pendingRequests[key];
    },



    submitPhoneVerification : function(code){

        console.log("APIUTIL.submitPhoneVerification()");

        let auth_token = localStorage.token;
        let email = localStorage.email;
        let key = apiConstants.SUBMIT_PHONE_VERIFICATION;


        if(!code || !email || !auth_token )
            throw new Error("APIUTILS: Code is required to submit verification -- as well as a valid user token.");

        // build url
        let url = DEV_ENV ? makeDevUrl('submit_phone_verification/') : makeUrl('submit_phone_verification/');
        

        // abort any other similar requests
        abortPendingRequests(key);

        let success = function(res){
            console.log("APIUTIL.submitPhoneVerification()");
            console.log(res.text);


            res = res || "{}";
            let data = JSON.parse(res.text);

            console.log(res.text);

            let {email,authentication_token} = data;

            if( email && authentication_token ){
                localStorage.token = authentication_token;
                localStorage.email = email;
            }

            return data;
        };

        let error = function(err){

            if(err.status === 403){
                alert('Authentication error -- logging out!');
                localStorage.clear();
            }

            throw "APIUTIL.submitPhoneVerification()";
            console.warn(err);
        };

        // create a pending request and make call to api
         _pendingRequests[key] = 
            request
                .post(url)
                .timeout(TIMEOUT)
                .set("X-USER-TOKEN",auth_token)
                .set("X-USER-EMAIL",email)
                .query({phone_verification_code:code})
                .then(success,error);

        return _pendingRequests[key];
    },

    createCalucroNumber : function( number ){

        console.log("APIUTIL.createCalucroNumber()");

        let auth_token = localStorage.token;
        let email = localStorage.email;
        let key = apiConstants.CREATE_CALUCRO_NUMBER;

        // build url
        let url = DEV_ENV ? makeDevUrl('calucro_numbers/') : makeUrl('calucro_numbers/');
        
        // abort any other similar requests
        abortPendingRequests(key);

        let success = function(res){            

            res = res || "{}";
            let data = JSON.parse(res.text);

            // console.log("APIUTIL.createCalucroNumber()",data);

            let {email,authentication_token} = data;

            if( email && authentication_token ){
                localStorage.token = authentication_token;
                localStorage.email = email;
            }

            return data;
        };

        let error = function(err){

            if(err.status === 403){
                alert('Authentication error -- logging out!');
                localStorage.clear();
            }

            throw "APIUTIL.createCalucroNumber()";
            console.warn(err);

            return err;
        };

        // create a pending request and make call to api
         _pendingRequests[key] = 
            request
                .post(url)                
                .send({phone:number})
                .timeout(TIMEOUT)
                .set("X-USER-TOKEN",auth_token)
                .set("X-USER-EMAIL",email)
                .then(success,error);

        return _pendingRequests[key];
    },

    updateCalucroNumber : function( number ){

        console.log("APIUTIL.updateCalucroNumber()");

        let auth_token = localStorage.token;
        let email = localStorage.email;
        let key = apiConstants.UPDATE_CALUCRO_NUMBER;

        // build url
        let url = DEV_ENV ? makeDevUrl('calucro_numbers/' + number.id) : makeUrl('calucro_numbers/' + number.id);
        
        // abort any other similar requests
        abortPendingRequests(key);

        let success = function(res){            

            res = res || "{}";
            let data = JSON.parse(res.text);

            let {email,authentication_token} = data;

            if( email && authentication_token ){
                localStorage.token = authentication_token;
                localStorage.email = email;
            }

            return data;
        };

        let error = function(err){

            if(err.status === 403){
                alert('Authentication error -- logging out!');
                localStorage.clear();
            }

            throw "APIUTIL.updateCalucroNumber()";
            console.warn(err);

            return err;
        };

        // create a pending request and make call to api
         _pendingRequests[key] = 
            request
                .put(url)                
                .send(number)
                .timeout(TIMEOUT)
                .set("X-USER-TOKEN",auth_token)
                .set("X-USER-EMAIL",email)
                .then(success,error);

        return _pendingRequests[key];
    },

    searchCalucroNumber : function( phone , quantity, areacode ){

        let auth_token = localStorage.token;
        let email = localStorage.email;
        let key = apiConstants.SEARCH_CALUCRO_NUMBER;

        quantity = quantity || 5;

        // build url
        let url = DEV_ENV ? makeDevUrl('calucro_numbers/search') : makeUrl('calucro_numbers/search');
        
        // abort any other similar requests
        abortPendingRequests(key);

        let success = function(res){            

            res = res || "{}";
            let data = JSON.parse(res.text);

            // console.log("APIUTIL.createCalucroNumber()",data);

            let {email,authentication_token} = data;

            if( email && authentication_token ){
                localStorage.token = authentication_token;
                localStorage.email = email;
            }

            return data;
        };

        let error = function(err){

            if(err.status === 403){
                alert('Authentication error -- logging out!');
                localStorage.clear();
            }
            throw "APIUTIL.searchCalucroNumber()";
            return err;
        };

        console.log("APIUTIL.searchCalucroNumber()",phone,quantity);

        // create a pending request and make call to api
         _pendingRequests[key] = 
            request
                .get(url)                
                .query({phone:phone,quantity:quantity,area_code:areacode})
                .timeout(TIMEOUT)
                .set("X-USER-TOKEN",auth_token)
                .set("X-USER-EMAIL",email)
                .then(success,error);

        return _pendingRequests[key];
    },

    getCalucroNumbers : function(  ){

        let auth_token = localStorage.token;
        let email = localStorage.email;
        let key = apiConstants.GET_CALUCRO_NUMBERS;
        
        // build url
        let url = DEV_ENV ? makeDevUrl('calucro_numbers/') : makeUrl('calucro_numbers/');
        
        // abort any other similar requests
        abortPendingRequests(key);

        let success = function(res){            

            res = res || "{}";
            let data = JSON.parse(res.text);

            // console.log("APIUTIL.getCalucroNumbers()",data);

            let {email,authentication_token} = data;

            if( email && authentication_token ){
                localStorage.token = authentication_token;
                localStorage.email = email;
            }

            return data;
        };

        let error = function(err){

            if(err.status === 403){
                alert('Authentication error -- logging out!');
                localStorage.clear();
            }

            throw "APIUTIL.getCalucroNumbers()";
            console.warn(err);

            return err;
        };


        // create a pending request and make call to api
         _pendingRequests[key] = 
            request
                .get(url)                
                .timeout(TIMEOUT)
                .set("X-USER-TOKEN",auth_token)
                .set("X-USER-EMAIL",email)
                .then(success,error);

        return _pendingRequests[key];
    },

    getSMSTemplates : function(){

        console.log("APIUTIL.getSMSTemplate()");

        let auth_token = localStorage.token;
        let email = localStorage.email;
        let key = apiConstants.GET_SMS_TEMPLATES;

        // build url
        let url = DEV_ENV ? makeDevUrl('sms_templates/') : makeUrl('sms_templates/');
        
        // abort any other similar requests
        abortPendingRequests(key);

        let success = function(res){            

            res = res || "{}";
            let data = JSON.parse(res.text);

            console.log("APIUTIL.getSMSTemplates()",data);

            let {email,authentication_token} = data;

            if( email && authentication_token ){
                localStorage.token = authentication_token;
                localStorage.email = email;
            }

            return data;
        };

        let error = function(err){

            if(err.status === 403){
                alert('Authentication error -- logging out!');
                localStorage.clear();
            }

            throw "APIUTIL.getSMSTemplates()";
            console.warn(err);
            return err;
        };

        // create a pending request and make call to api
        _pendingRequests[key] = 
            request
                .get(url)                
                .timeout(TIMEOUT)
                .set("X-USER-TOKEN",auth_token)
                .set("X-USER-EMAIL",email)
                .then(success,error);

        return _pendingRequests[key];
    },

    createSMSTemplate : function( smsTemplate ){

        console.log("APIUTIL.createSMSTemplate()");

        let auth_token = localStorage.token;
        let email = localStorage.email;
        let key = apiConstants.CREATE_SMS_TEMPLATE;

        // build url
        let url = DEV_ENV ? makeDevUrl('sms_templates/') : makeUrl('sms_templates/');
        
        // abort any other similar requests
        abortPendingRequests(key);

        let success = function(res){            

            res = res || "{}";
            let data = JSON.parse(res.text);

            console.log("APIUTIL.createSMSTemplate()",data);

            let {email,authentication_token} = data;

            if( email && authentication_token ){
                localStorage.token = authentication_token;
                localStorage.email = email;
            }

            return data;
        };

        let error = function(err){

            if(err.status === 403){
                alert('Authentication error -- logging out!');
                localStorage.clear();
            }

            throw "APIUTIL.createSMSTemplate()";
            console.warn(err);
            return err;
        };

        // create a pending request and make call to api
        _pendingRequests[key] = 
            request
                .post(url)                
                .send(smsTemplate)
                .timeout(TIMEOUT)
                .set("X-USER-TOKEN",auth_token)
                .set("X-USER-EMAIL",email)
                .then(success,error);

        return _pendingRequests[key];
    },

    updateSMSTemplate : function( smsTemplate ){

        console.log("APIUTIL.updateSMSTemplate()");

        let auth_token = localStorage.token;
        let email = localStorage.email;
        let key = apiConstants.UPDATE_SMS_TEMPLATE;

        // build url
        let url = DEV_ENV ? makeDevUrl('sms_templates/'+smsTemplate.id) : makeUrl('sms_templates/'+smsTemplate.id);
        
        // abort any other similar requests
        abortPendingRequests(key);

        let success = function(res){            

            res = res || "{}";
            let data = JSON.parse(res.text);

            console.log("APIUTIL.updateSMSTemplate()",data);

            let {email,authentication_token} = data;

            if( email && authentication_token ){
                localStorage.token = authentication_token;
                localStorage.email = email;
            }

            return data;
        };

        let error = function(err){

            if(err.status === 403){
                alert('Authentication error -- logging out!');
                localStorage.clear();
            }

            throw "APIUTIL.updateSMSTemplate()";
            console.warn(err);
            return err;
        };

        // create a pending request and make call to api
        _pendingRequests[key] = 
            request
                .put(url)                
                .send(smsTemplate)
                .timeout(TIMEOUT)
                .set("X-USER-TOKEN",auth_token)
                .set("X-USER-EMAIL",email)
                .then(success,error);

        return _pendingRequests[key];
    },

    deleteSMSTemplate : function( smsTemplate ){

        console.log("APIUTIL.deleteSMSTemplate()");

        let auth_token = localStorage.token;
        let email = localStorage.email;
        let key = apiConstants.DELETE_SMS_TEMPLATE;

        // build url
        let url = DEV_ENV ? makeDevUrl('sms_templates/' + smsTemplate.id) : makeUrl('sms_templates/' + smsTemplate.id);
        
        // abort any other similar requests
        abortPendingRequests(key);

        let success = function(res){            

            res = res || "{}";
            let data = JSON.parse(res.text);

            console.log("APIUTIL.deleteSMSTemplate()",data);

            let {email,authentication_token} = data;

            if( email && authentication_token ){
                localStorage.token = authentication_token;
                localStorage.email = email;
            }

            return data;
        };

        let error = function(err){

            if(err.status === 403){
                alert('Authentication error -- logging out!');
                localStorage.clear();
            }

            throw "APIUTIL.updateSMSTemplate()";
            console.warn(err);
            return err;
        };

        // create a pending request and make call to api
        _pendingRequests[key] = 
            request
                .del(url)
                .timeout(TIMEOUT)
                .set("X-USER-TOKEN",auth_token)
                .set("X-USER-EMAIL",email)
                .then(success,error);

        return _pendingRequests[key];
    },

    createProAnswer : function( calucroID ){

        console.log("APIUTIL.createProAnswer()");

        let auth_token = localStorage.token;
        let email = localStorage.email;
        let key = apiConstants.CREATE_PRO_ANSWER;

        // build url
        let url = DEV_ENV ? makeDevUrl('proanswers/') : makeUrl('proanswers/');
        
        // abort any other similar requests
        abortPendingRequests(key);

        let success = function(res){            

            res = res || "{}";
            let data = JSON.parse(res.text);

            console.log("APIUTIL.createProAnswer()",data);

            let {email,authentication_token} = data;

            if( email && authentication_token ){
                localStorage.token = authentication_token;
                localStorage.email = email;
            }

            return data;
        };

        let error = function(err){

            if(err.status === 403){
                alert('Authentication error -- logging out!');
                localStorage.clear();
            }

            throw "APIUTIL.createProAnswer()";
            console.warn(err);
            return err;
        };

        // create a pending request and make call to api
        _pendingRequests[key] = 
            request
                .post(url)                
                .send({calucro_number_id:calucroID})
                .timeout(TIMEOUT)
                .set("X-USER-TOKEN",auth_token)
                .set("X-USER-EMAIL",email)
                .then(success,error);

        return _pendingRequests[key];
    },

    getProAnswers : function( calucroID ){

        let auth_token = localStorage.token;
        let email = localStorage.email;
        let key = apiConstants.GET_PRO_ANSWER;

        // build url
        let url = DEV_ENV ? makeDevUrl('proanswers/') : makeUrl('proanswers/');
        
        // abort any other similar requests
        abortPendingRequests(key);

        let success = function(res){            

            res = res || "{}";
            let data = JSON.parse(res.text);

            // console.log("APIUTIL.getProAnswer() :: response",data);

            let {email,authentication_token} = data;

            if( email && authentication_token ){
                localStorage.token = authentication_token;
                localStorage.email = email;
            }

            return data;
        };

        let error = function(err){

            if(err.status === 403){
                alert('Authentication error -- logging out!');
                localStorage.clear();
            }

            throw "APIUTIL.getProAnswers()";
            console.warn(err);

            return err;
        };

        // create a pending request and make call to api
        _pendingRequests[key] = 
            request
                .get(url)
                .use(nocache)                
                .query({calucro_number_id:calucroID,k:Math.random().toString(36).substring(7)})
                .timeout(TIMEOUT)
                .set("X-USER-TOKEN",auth_token)
                .set("X-USER-EMAIL",email)
                .then(success,error);

        return _pendingRequests[key];
    },

    getVcards : function(){

        let auth_token = localStorage.token;
        let email = localStorage.email;
        let key = apiConstants.GET_VCARDS;

        // build url
        let url = DEV_ENV ? makeDevUrl('vcards/') : makeUrl('vcards/');
        
        // abort any other similar requests
        abortPendingRequests(key);

        let success = function(res){            

            res = res || "{}";
            let data = JSON.parse(res.text);

            let {email,authentication_token} = data;

            if( email && authentication_token ){
                localStorage.token = authentication_token;
                localStorage.email = email;
            }

            return data;
        };

        let error = function(err){

            if(err.status === 403){
                alert('Authentication error -- logging out!');
                localStorage.clear();
            }

            throw "APIUTIL.getVcards()";
            console.warn(err);
            
            return err;
        };

        // create a pending request and make call to api
        _pendingRequests[key] = 
            request
                .get(url)
                .use(nocache)                
                .timeout(TIMEOUT)
                .set("X-USER-TOKEN",auth_token)
                .set("X-USER-EMAIL",email)
                .then(success,error);

        return _pendingRequests[key];

    },

    createVcard : function(vcard){

        let auth_token = localStorage.token;
        let email = localStorage.email;
        let key = apiConstants.CREATE_VCARD;

        if( !vcard )
            return;

        let payload = {
            vcard_name : vcard.name || "",
            first_name : vcard.first || "",
            last_name : vcard.last || "",
            email : vcard.email || "",
            phone : vcard.phone || "",
            urls : vcard.urls || [],
            addr_city : vcard.city || "",
            addr_state : vcard.state || "",
            addr_street : vcard.street_address || "",
            addr_zip : vcard.zip || ""
        };

        // build url
        let url = DEV_ENV ? makeDevUrl('vcards/') : makeUrl('vcards/');
        
        // abort any other similar requests
        abortPendingRequests(key);

        let success = function(res){            

            res = res || "{}";
            let data = JSON.parse(res.text);

            console.log("APIUTIL.createVcard()",data);

            let {email,authentication_token} = data;

            if( email && authentication_token ){
                localStorage.token = authentication_token;
                localStorage.email = email;
            }

            return data;
        };

        let error = function(err){

            if(err.status === 403){
                alert('Authentication error -- logging out!');
                localStorage.clear();
            }

            throw "APIUTIL.createVcard()";
            console.warn(err);
            return err;
        };

        // create a pending request and make call to api
        _pendingRequests[key] = 
            request
                .post(url)                
                .send(payload)
                .timeout(TIMEOUT)
                .set("X-USER-TOKEN",auth_token)
                .set("X-USER-EMAIL",email)
                .then(success,error);

        return _pendingRequests[key];

    },

    updateVcard : function(vcard){

        console.log(vcard)

        let auth_token = localStorage.token;
        let email = localStorage.email;
        let key = apiConstants.UPDATE_VCARD;

        // build url
        let url = DEV_ENV ? makeDevUrl('vcards/' +vcard.id) : makeUrl('vcards/'+vcard.id);
        
        // abort any other similar requests
        abortPendingRequests(key);

        let success = function(res){            

            res = res || "{}";
            let data = JSON.parse(res.text);

            let {email,authentication_token} = data;

            if( email && authentication_token ){
                localStorage.token = authentication_token;
                localStorage.email = email;
            }

            return data;
        };

        let error = function(err){

            if(err.status === 403){
                alert('Authentication error -- logging out!');
                localStorage.clear();
            }

            throw "APIUTIL.updateVcard()";
            console.warn(err);
            
            return err;
        };

        // create a pending request and make call to api
        _pendingRequests[key] = 
            request
                .put(url)               
                .send(vcard)
                .timeout(TIMEOUT)
                .set("X-USER-TOKEN",auth_token)
                .set("X-USER-EMAIL",email)
                .then(success,error);

        return _pendingRequests[key];

    },

    deleteVcard : function(vcard){
        let auth_token = localStorage.token;
        let email = localStorage.email;
        let key = apiConstants.DELETE_VCARD;

        // build url
        let url = DEV_ENV ? makeDevUrl('vcards/' +vcard.id) : makeUrl('vcards/'+vcard.id);
        
        // abort any other similar requests
        abortPendingRequests(key);

        let success = function(res){            

            res = res || "{}";
            let data = JSON.parse(res.text);

            let {email,authentication_token} = data;

            if( email && authentication_token ){
                localStorage.token = authentication_token;
                localStorage.email = email;
            }

            return data;
        };

        let error = function(err){

            if(err.status === 403){
                alert('Authentication error -- logging out!');
                localStorage.clear();
            }

            throw "APIUTIL.deleteVcard()";
            console.warn(err);
            
            return err;
        };

        // create a pending request and make call to api
        _pendingRequests[key] = 
            request
                .del(url)               
                .send(vcard)
                .timeout(TIMEOUT)
                .set("X-USER-TOKEN",auth_token)
                .set("X-USER-EMAIL",email)
                .then(success,error);

        return _pendingRequests[key];

    },

    getVoicemails(calucroID){
        let auth_token = localStorage.token;
        let email = localStorage.email;
        let key = apiConstants.GET_VOICEMAILS;

        // build url
        let url = DEV_ENV ? makeDevUrl('voicemails/') : makeUrl('voicemails/');
        
        // abort any other similar requests
        abortPendingRequests(key);

        let success = function(res){            

            res = res || "{}";
            let data = JSON.parse(res.text);

            // console.log("APIUTIL.getVoicemails() :: response",data);

            let {email,authentication_token} = data;

            if( email && authentication_token ){
                localStorage.token = authentication_token;
                localStorage.email = email;
            }

            return data;
        };

        let error = function(err){

            if(err.status === 403){
                alert('Authentication error -- logging out!');
                localStorage.clear();
            }

            throw "APIUTIL.getVoicemails()";
            console.warn(err);
            
            return err;
        };

        // create a pending request and make call to api
        _pendingRequests[key] = 
            request
                .get(url)
                .use(nocache)                
                .query({calucro_number_id:calucroID})
                .timeout(TIMEOUT)
                .set("X-USER-TOKEN",auth_token)
                .set("X-USER-EMAIL",email)
                .then(success,error);

        return _pendingRequests[key];
    },

    deleteVoicemail( voicemail){

        console.log("APIUTIL.deleteVoicemail()");

        let auth_token = localStorage.token;
        let email = localStorage.email;
        let key = apiConstants.DELETE_VOICEMAILS;

        // build url
        let url = DEV_ENV ? makeDevUrl('voicemails/' + voicemail.id) : makeUrl('voicemails/' + voicemail.id);
        
        // abort any other similar requests
        abortPendingRequests(key);

        let success = function(res){            

            res = res || "{}";
            let data = JSON.parse(res.text);

            console.log("APIUTIL.deleteVoicemails()",data);

            let {email,authentication_token} = data;

            if( email && authentication_token ){
                localStorage.token = authentication_token;
                localStorage.email = email;
            }

            return data;
        };

        let error = function(err){

            if(err.status === 403){
                alert('Authentication error -- logging out!');
                localStorage.clear();
            }

            throw "APIUTIL.deleteVoicemails()";
            console.warn(err);
            return err;
        };

        // create a pending request and make call to api
        _pendingRequests[key] = 
            request
                .del(url)
                .timeout(TIMEOUT)
                .set("X-USER-TOKEN",auth_token)
                .set("X-USER-EMAIL",email)
                .then(success,error);

        return _pendingRequests[key];
    },

    updateVoicemail( voicemail ){

        console.log("APIUTIL.updateVoicemail()");

        if(!voicemail)
            return false;

        let auth_token = localStorage.token;
        let email = localStorage.email;
        let key = apiConstants.UPDATE_VOICEMAILS;

        // build url
        let url = DEV_ENV ? makeDevUrl('voicemails/' + voicemail.id) : makeUrl('voicemails/' + voicemail.id);
        
        // abort any other similar requests
        abortPendingRequests(key);

        let success = function(res){            

            res = res || "{}";
            let data = JSON.parse(res.text);

            console.log("APIUTIL.updateVoicemail()",data);

            let {email,authentication_token} = data;

            if( email && authentication_token ){
                localStorage.token = authentication_token;
                localStorage.email = email;
            }

            return data;
        };

        let error = function(err){

            if(err.status === 403){
                alert('Authentication error -- logging out!');
                localStorage.clear();
            }

            throw "APIUTIL.updateVoicemail()";
            console.warn(err);
            return err;
        };

        // create a pending request and make call to api
        _pendingRequests[key] = 
            request
                .put(url)
                .send(voicemail)
                .timeout(TIMEOUT)
                .set("X-USER-TOKEN",auth_token)
                .set("X-USER-EMAIL",email)
                .then(success,error);

        return _pendingRequests[key];
    },

    getLeads : function( calucroID ){

        console.log('Api.getLeads()',calucroID)

        let auth_token = localStorage.token;
        let email = localStorage.email;
        let key = apiConstants.GET_INTERACTIONS;

        // build url
        let url = DEV_ENV ? makeDevUrl('leads/') : makeUrl('leads/');
        
        // abort any other similar requests
        abortPendingRequests(key);

        let success = function(res){            

            res = res || "{}";
            let data = JSON.parse(res.text);

            // console.log("APIUTIL.getLeads() :: response",data);

            let {email,authentication_token} = data;

            if( email && authentication_token ){
                localStorage.token = authentication_token;
                localStorage.email = email;
            }

            return data;
        };

        let error = function(err){

            if(err.status === 403){
                alert('Authentication error -- logging out!');
                localStorage.clear();
            }

            throw "APIUTIL.getLeads()";
            console.warn(err);
            
            return err;
        };

        // create a pending request and make call to api
        _pendingRequests[key] = 
            request
                .get(url)
                .use(nocache)                
                .query({calucro_number_id:calucroID})
                .timeout(TIMEOUT)
                .set("X-USER-TOKEN",auth_token)
                .set("X-USER-EMAIL",email)
                .then(success,error);

        return _pendingRequests[key];
    },

    updateLead : function( lead ){

        let auth_token = localStorage.token;
        let email = localStorage.email;
        let key = apiConstants.GET_INTERACTIONS;

        // build url
        let url = DEV_ENV ? makeDevUrl('leads/' +lead.id) : makeUrl('leads/'+lead.id);
        
        // abort any other similar requests
        abortPendingRequests(key);

        let success = function(res){            

            res = res || "{}";
            let data = JSON.parse(res.text);

            let {email,authentication_token} = data;

            if( email && authentication_token ){
                localStorage.token = authentication_token;
                localStorage.email = email;
            }

            return data;
        };

        let error = function(err){

            if(err.status === 403){
                alert('Authentication error -- logging out!');
                localStorage.clear();
            }

            throw "APIUTIL.getLeads()";
            console.warn(err);
            
            return err;
        };

        // create a pending request and make call to api
        _pendingRequests[key] = 
            request
                .put(url)               
                .send(lead)
                .timeout(TIMEOUT)
                .set("X-USER-TOKEN",auth_token)
                .set("X-USER-EMAIL",email)
                .then(success,error);

        return _pendingRequests[key];
    },

    getInteractions : function(options){

        options = options || {
            calucroID : null,
            type : null,
            lead_id : null
        };

        let auth_token = localStorage.token;
        let email = localStorage.email;
        let key = apiConstants.GET_INTERACTIONS;

        // build url
        let url = DEV_ENV ? makeDevUrl('interactions/') : makeUrl('interactions/');
        
        // abort any other similar requests
        abortPendingRequests(key);

        let success = function(res){            

            res = res || "{}";
            let data = JSON.parse(res.text);

            // console.log("APIUTIL.getInteractions() :: response",data);

            let {email,authentication_token} = data;

            if( email && authentication_token ){
                localStorage.token = authentication_token;
                localStorage.email = email;
            }

            return data;
        };

        let error = function(err){

            if(err.status === 403){
                alert('Authentication error -- logging out!');
                localStorage.clear();
            }

            throw "APIUTIL.getInteractions()";
            console.warn(err);
            
            return err;
        };

        // create a pending request and make call to api
        _pendingRequests[key] = 
            request
                .get(url)
                .use(nocache)                
                .query({
                    calucro_number_id:options.calucroID,
                    type: options.type,
                    lead_id: options.lead_id})
                .timeout(TIMEOUT)
                .set("X-USER-TOKEN",auth_token)
                .set("X-USER-EMAIL",email)
                .then(success,error);

        return _pendingRequests[key];
    },

    getTextOverview : function(options){

        options = options || {
            calucroID : null,
            type : null,
            lead_id : null
        };

        options.overview = true;

        let auth_token = localStorage.token;
        let email = localStorage.email;
        let key = apiConstants.GET_INTERACTIONS_OVERVIEW;

        // build url
        let url = DEV_ENV ? makeDevUrl('interactions/') : makeUrl('interactions/');
        
        // abort any other similar requests
        abortPendingRequests(key);

        let success = function(res){            

            res = res || "{}";
            let data = JSON.parse(res.text);

            // console.log("APIUTIL.getInteractions() :: response",data);

            let {email,authentication_token} = data;

            if( email && authentication_token ){
                localStorage.token = authentication_token;
                localStorage.email = email;
            }

            return data;
        };

        let error = function(err){

            if(err.status === 403){
                alert('Authentication error -- logging out!');
                localStorage.clear();
            }

            throw "APIUTIL.getInteractions()";
            console.warn(err);
            
            return err;
        };

        // create a pending request and make call to api
        _pendingRequests[key] = 
            request
                .get(url)
                .use(nocache)                
                .query({
                    //calucro_number_id:options.calucroID,
                    type: "message",
                    overview: options.overview,
                    //lead_id: options.lead_id
                 })
                .timeout(TIMEOUT)
                .set("X-USER-TOKEN",auth_token)
                .set("X-USER-EMAIL",email)
                .then(success,error);

        return _pendingRequests[key];
    },


    getRecordings : function(options){

        options = options || {
            calucroID : null,
            type : null,
            lead_id : null
        };

        let auth_token = localStorage.token;
        let email = localStorage.email;
        let key = apiConstants.GET_RECORDINGS;

        // build url
        let url = DEV_ENV ? makeDevUrl('interactions/') : makeUrl('interactions/');
        
        // abort any other similar requests
        abortPendingRequests(key);

        let success = function(res){            

            res = res || "{}";
            let data = JSON.parse(res.text);

            // console.log("APIUTIL.getInteractions() :: response",data);

            let {email,authentication_token} = data;

            if( email && authentication_token ){
                localStorage.token = authentication_token;
                localStorage.email = email;
            }

            return data;
        };

        let error = function(err){

            if(err.status === 403){
                alert('Authentication error -- logging out!');
                localStorage.clear();
            }

            throw "APIUTIL.getInteractions()";
            console.warn(err);
            
            return err;
        };

        // create a pending request and make call to api
        _pendingRequests[key] = 
            request
                .get(url)
                .use(nocache)                
                .query({
                    calucro_number_id:options.calucroID,
                    with_recordings: true,
                })
                .timeout(TIMEOUT)
                .set("X-USER-TOKEN",auth_token)
                .set("X-USER-EMAIL",email)
                .then(success,error);

        return _pendingRequests[key];
    },



    createInteraction : function(options){

        options = options || {
            calucroID : null,
            type : null,
            text: null,
            lead_id : null,
            v_card_id : null
        };

        let auth_token = localStorage.token;
        let email = localStorage.email;
        let key = apiConstants.CREATE_INTERACTIONS;

        // build url
        let url = DEV_ENV ? makeDevUrl('interactions/') : makeUrl('interactions/');
        
        // abort any other similar requests
        abortPendingRequests(key);

        let success = function(res){            

            res = res || "{}";
            let data = JSON.parse(res.text);

            console.log("APIUTIL.CREATE_INTERACTIONS() :: response",data);

            let {email,authentication_token} = data;

            if( email && authentication_token ){
                localStorage.token = authentication_token;
                localStorage.email = email;
            }

            return data;
        };

        let error = function(err){

            if(err.status === 403){
                alert('Authentication error -- logging out!');
                localStorage.clear();
            }

            throw "APIUTIL.createInteraction()";
            console.warn(err);
            
            return err;
        };

        // create a pending request and make call to api
        _pendingRequests[key] = 
            request
                .post(url)
                .use(nocache)                
                .send({
                    calucro_number_id:options.calucroID,
                    type: options.type,
                    text: options.text,
                    v_card_id:options.v_card_id,
                    lead_id: options.lead_id})
                .timeout(TIMEOUT)
                .set("X-USER-TOKEN",auth_token)
                .set("X-USER-EMAIL",email)
                .then(success,error);

        return _pendingRequests[key];
    },


    getLatestInteractions : function(){

        let auth_token = localStorage.token;
        let email = localStorage.email;
        let key = apiConstants.GET_LATEST_INTERACTIONS;

        console.log(apiConstants.GET_LATEST_INTERACTIONS);

        // build url
        let url = DEV_ENV ? makeDevUrl('interactions/') : makeUrl('interactions/');
        
        // abort any other similar requests
        abortPendingRequests(key);

        let success = function(res){            

            res = res || "{}";
            let data = JSON.parse(res.text);

            console.log("APIUTIL.getLatestInteractions() :: response",data);

            let {email,authentication_token} = data;

            if( email && authentication_token ){
                localStorage.token = authentication_token;
                localStorage.email = email;
            }

            return data;
        };

        let error = function(err){

            if(err.status === 403){
                alert('Authentication error -- logging out!');
                localStorage.clear();
            }

            throw "APIUTIL.getLatestInteractions()";
            console.warn(err);
            
            return err;
        };

        // create a pending request and make call to api
        _pendingRequests[key] = 
            request
                .get(url)
                .use(nocache)
                .query({k:"latest"})
                .timeout(TIMEOUT)
                .set("X-USER-TOKEN",auth_token)
                .set("X-USER-EMAIL",email)
                .then(success,error);

        return _pendingRequests[key];
    }
};

module.exports = Api;


