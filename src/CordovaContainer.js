import React from 'react';

import { requireAuth, routeSignUp } from './utils/route-validations';
import AppConstants from './constants/AppConstants';

import Main from './views/Main';
import Login from './views/Login';


const App = () => (
  <div>
    <Main />
  </div>
)

class CordovaContainer extends React.Component {

  constructor(props, context){
    super(props);

    this.onDeviceReady = this.onDeviceReady.bind(this);
    this.onPushRegistration = this.onPushRegistration.bind(this);

    this.state = {
      ready: false,
    };
  }

  onDeviceReady(){
    
    // UAirship.setUserNotificationsEnabled(true, function (enabled) {
    //     console.log("User notifications are enabled! Fire away!");
    // })

    // Register for any Urban Airship events
    document.addEventListener("urbanairship.registration", this.onPushRegistration );
    // Register for any Urban Airship push events
    document.addEventListener("urbanairship.push", this.onPushEvent);

    this.setState({
      ready:true
    });
  }


  componentDidMount(){
    document.addEventListener("deviceready",this.onDeviceReady);
  }

  componentWillUnmount() {

    document.removeEventListener("deviceready",this.onDeviceReady);
    document.removeEventListener("urbanairship.registration",this.onPushRegistration);
    document.removeEventListener("urbanairship.push",this.onPushEvent);

  }

  onPushEvent(event){

    console.log("Received a push message!");
    console.log(JSON.stringify(event));

  }

  onPushRegistration(event){
    
    if(event){
       localStorage.channelID = event.channelID
      }

    if (event.error) {
        console.log('There was an error registering for push notifications')
    } else {
        console.log("Registered with ID: " + event.channelID);
    }
  }

  
  render() {
    
    return (
       <Router history={hashHistory}>
        <Route path="/" component={App}>
          <IndexRoute component={Main} onEnter={requireAuth}></IndexRoute>
          <Route path="login" component={LoginView}></Route>
        </Route>
      </Router>
    );
  }
}

export default CordovaContainer;