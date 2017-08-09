import React from 'react';
import ons from 'onsenui';
import {Page,Button,Tabbar,Tab,Toolbar} from 'react-onsenui';
import Dialer from './Dialer';
import LoginFormModule from '../components/LoginFormModule';

import auth from '../utils/auth';


export default class Login extends React.Component {
  
  state = { index: 1}

  constructor(props) {
    super(props);
  }

  renderToolbar = () => {
    // const titles = ['Text', 'Dial','Leads'];
    return (
      <Toolbar>
        <div className='center'>
          Calucro Login
        </div>
      </Toolbar>
    );
  }

  componentDidMount() {

    console.log(this.context.router)

    if( auth.isAuth() ){
      // this.context.router.transitionTo("/")
      this.props.history.push('/')
    }
  }

  onLoginSuccess = () =>{
    this.props.history.push('/');
  }


  render() {

    const titles = ['Text', 'Dial','Settings'];

    return (
      <Page renderToolbar={this.renderToolbar}>
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
