import React from 'react';
import ons from 'onsenui';
import {Page,Button,Tabbar,Tab,Toolbar} from 'react-onsenui';
import Dialer from './Dialer';
import LoginFormModule from '../components/LoginFormModule';

import auth from '../utils/auth';


export default class Login extends React.Component {
  
  state = { index: 1 }

  constructor(props) {
    super(props);
  }

  renderToolbar = () => {
    return (
      <Toolbar>
        <div className='center'>
          Calucro Login
        </div>
      </Toolbar>
    );
  }

  componentDidMount() {

    if( auth.isAuth() ){
      // this.context.router.transitionTo("/")
      this.props.history.push('/tab/1')
    }
  }

  onLoginSuccess = () =>{
    this.props.history.push('/tab/1');
  }


  render() {

    console.log('logins')
    
    return (
      <Page >
        <LoginFormModule onSuccess={this.onLoginSuccess} />
      </Page>     
    );

  }
  
};

Login.propTypes = {
  data : React.PropTypes.object
};

Login.contextTypes ={
  router : React.PropTypes.object
}
