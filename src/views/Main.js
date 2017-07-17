import React from 'react';

import Login from './Login';
import Home from './Home';

import { Switch, Route } from 'react-router-dom'; 

export default class Main extends React.Component {
    
  constructor(props) {
    super(props);

  }

  componentWillMount() {
    
  }

  render() {
    return (
      <main>
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route path='/login' component={Login}/>
        </Switch>
      </main>    
    );
  }

};

