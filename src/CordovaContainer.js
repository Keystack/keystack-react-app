import React from 'react';
import { hashHistory, Route } from 'react-router';
import { Router , HashRouter, Switch, Redirect } from 'react-router-dom';

import {requireAuth,routeSignUp} from  './utils/route-validations';
import { ThemeProvider } from 'react-css-themr';
import theme from './theme/themes';

import Login   from  './views/Login';
import Home    from  './views/Home';
import Splash  from  './views/Splash';
import SignUp  from  './views/SignUp';
import Profile from  './views/Profile';

import UserActions  from './actions/UserActions';
import UserStore    from './stores/UserStore';

import auth from './utils/auth';
import BeaconManager from './utils/beacon-manager';


const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    auth.isAuth() ? (
      <Component {...props}/>
    ) : (
      <Redirect to={{
        pathname: '/',
        state: { from: props.location }
      }}/>
    )
  )}/>
)


export default class CordovaContainer extends React.Component {

  constructor(props, context){
    super(props);
  }


  onDeviceReady(){
    
    UAirship.setUserNotificationsEnabled(true, function (enabled) {
        console.log("User notifications are enabled! Fire away!");
    });

    if(window.screen) window.screen.orientation.lock('portrait');

    BeaconManager.start();

    Keyboard.shrinkView(false);
    Keyboard.hideFormAccessoryBar(true);
    Keyboard.disableScrollingInShrinkView(true);

    // Register for any Urban Airship events
    document.addEventListener("urbanairship.registration", this.onPushRegistration );
    // Register for any Urban Airship push events
    document.addEventListener("urbanairship.push", this.onPushEvent);

    // this.setState({
    //   ready:true
    // });
  }


  componentDidMount(){
    document.addEventListener("deviceready",this.onDeviceReady);

    if( UserStore.isAuth() ){
        UserActions.get();
     }

   // TODO : REMOVE  
   // UserActions.create({
   //    email:'d3@keystack.com',
   //    password:'password23e32',
   //    first: 'Devery',
   //    last: 'Channell',
   //    phone: '469-235-8390',
   //    college: 'UTD @ A' 
   //  });
   // UserActions.logout(); 
   // UserActions.login('d1@keystack.com','password23e32')
   // UserActions.get()
   // UserActions.update(UserStore.getData());

  }

  componentWillUnmount() {

    BeaconManager.stop();

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

    let user = UserStore.getData();

    return (
      <HashRouter >
        <ThemeProvider theme={theme} >
          <main>
            <Switch>
              <Route exact path='/' component={Splash}/>
              <Route path='/login' component={Login} />
              <Route path='/signup' component={SignUp} />
              <PrivateRoute path='/profile' component={Profile} />
            </Switch>
          </main>    
        </ThemeProvider>
      </HashRouter>
    );
  }

}