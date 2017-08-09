import React from 'react';

import {Input,Button} from 'react-onsenui';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';

import UserActions from '../actions/UserActions';
import UserStore from '../stores/UserStore';

import auth from '../utils/auth';


const styles = {
  container: {
    padding: "10px",
    textAlign : 'left !important',
  },
  input : {
    border: "solid 1px #ccc",
    width: "100%",
    textAlign : 'left !important',
    background: 'transparent'
  }
};


export default class LoginFormModule extends React.Component {
  
  constructor(props) {
    super(props);

    this.getPasswordValidationState = this.getPasswordValidationState.bind(this);
    this.getEmailValidationState = this.getEmailValidationState.bind(this);
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      email: '',
      password: '',
      errorMsg:''
    }
  }

  componentWillMount() {
    UserStore.onChange(this.onUserStoreChange);
  }

  componentDidMount() {
    
  }

  componentWillUnmount() {
    UserStore.offChange(this.onUserStoreChange);
  }
  

  getEmailValidationState() {
    const length = this.state.password.length;

    if(this.state.errorMsg) return 'error';
  }

  getPasswordValidationState() {
    const length = this.state.password.length;

    if(this.state.errorMsg) return 'error';
    else if (length > 7) return 'success';
    else if (length > 0) return 'error';
  }

  handleChangeEmail(e) {
    this.setState({ email: e.target.value, errorMsg: '' });
  }

  handleChangePassword(e) {
    this.setState({ password: e.target.value,errorMsg: '' });
  }

  onUserStoreChange = () =>{
    console.log('User Change event')
    if( auth.isAuth() ){      
      this.props.onSuccess();
    }

  }

  onSubmit(){

    console.log(this.state);

    if( this.state.email.length > 3 && this.state.password.length > 7 ){
      this.setState({
        'errorMsg': '',
        'loading' : true
      });

      UserActions.login(this.state.email,this.state.password);
    }else{
      this.setState({
        'errorMsg': 'Email Address or Password is incorrect! Try Again!'
      });
    }
  }

  render() {
    return (
      <div className="container" style={styles.container}>        
          <div className="col-md-6 col-md-offset-3">
            <ControlLabel>{this.state.errorMsg}</ControlLabel>
            <p>
              <Input
                style={styles.input}
                width
                value={this.state.email}
                onChange={this.handleChangeEmail} 
                placeholder='Email' />
            </p>
            <p>
              <Input
                style={styles.input}
                value={this.state.password}
                onChange={this.handleChangePassword}                
                type='password'
                placeholder='Password' />
            </p>

            <Button className="col-md-3 pull-right" modifier='large' onClick={this.onSubmit}>Login</Button>
        </div>
      </div>
    );
  }
}

LoginFormModule.propTypes = {
  onSuccess: React.PropTypes.func.isRequired
};