import React from 'react';
import { hashHistory, Route } from 'react-router';
import { Router , HashRouter, Switch, Redirect } from 'react-router-dom';

import {requireAuth,routeSignUp} from  './utils/route-validations';

import Main    from  './views/Main';
import Login from  './views/Login';
import Profile from  './views/Profile';
import Messenger from './views/Messenger'

import UserStore    from './stores/UserStore';

import UserActions  from './actions/UserActions';
import NumbersActions from './actions/NumbersActions';
import LeadsActions from './actions/LeadsActions';

import auth from './utils/auth';

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    auth.isAuth() ? (
      <Component {...props}/>
    ) : (
      <Redirect to={{
        pathname: '/login',
        state: { from: props.location }
      }}/>
    )
  )}/>
);

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
   // });

   // UserActions.logout(); 
   // UserActions.login('d1@keystack.com','password23e32')
   // UserActions.get()
   // UserActions.update(UserStore.getData());

  }

  render() {

    let user = UserStore.getData();

    return (
      <HashRouter >
          <main>
            <Switch>
              <PrivateRoute exact path='/' component={Main}/>
              <Route path='/login' component={Login} />
              <PrivateRoute path='/profile' component={Profile} />
            </Switch>
          </main> 
      </HashRouter>
    );
  }

}