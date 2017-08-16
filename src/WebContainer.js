import React from 'react';
import { hashHistory, Route } from 'react-router';
import { Router , HashRouter, Switch, Redirect } from 'react-router-dom';

import {requireAuth,routeSignUp} from  './utils/route-validations';

import Main    from  './views/Main';
import Login from  './views/Login';
import Profile from  './views/Profile';
import Conversation from './views/Conversation';
import NewTextMessageModule from './components/NewTextMessageModule';

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
  }

  render() {

    // let user = UserStore.getData();

    return (
      <HashRouter >
          <main>
            <Switch>
              <PrivateRoute exact path='/' component={Main}/>
              <PrivateRoute exact path='/:id' component={Main}/>
              <PrivateRoute exact path='/conversation/new' component={NewTextMessageModule} />
              <PrivateRoute exact path='/conversation/:id' component={Conversation} />
              <Route path='/login' component={Login} />
              <PrivateRoute path='/profile' component={Profile} />
            </Switch>
          </main> 
      </HashRouter>
    );
  }

}