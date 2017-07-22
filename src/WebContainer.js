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


export default class WebContainer extends React.Component {

  constructor(props, context){
    super(props);
  }

  componentDidMount(){  

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