import React from 'react';
import { Redirect } from 'react-router-dom';
import _ from 'lodash';

import KeystackUtils from '../utils/keystack-utils';

import Input    from 'react-toolbox/lib/input/Input';
import FontIcon from 'react-toolbox/lib/font_icon';
import Avatar   from 'react-toolbox/lib/avatar';
import Chip     from 'react-toolbox/lib/chip';
import Snackbar from 'react-toolbox/lib/snackbar';
import ProgressBar from 'react-toolbox/lib/progress_bar';

import TypeForm         from '../components/TypeForm';
import TypeFormSection  from '../components/TypeFormSection';
import Selectables      from '../components/Selectables';
import AvatarUpload     from '../components/AvatarUpload';

import UserConstants  from '../constants/UserConstants'
import UserStore   from '../stores/UserStore';
import UserActions from '../actions/UserActions';

import InterestsConstants  from '../constants/InterestsConstants'
import InterestsStore   from '../stores/InterestsStore';
import InterestsActions from '../actions/InterestsActions';

const styles = {
  headerLogo : {
    maxWidth:"75%",
    margin:"0 auto"
  },
  slideStyle:{
    padding:'10px'
  }
}


export default class SignUp extends React.Component {

   state = { 
     name: UserStore.getName() || '', 
     phone: UserStore.getData().phone || '', 
     email: UserStore.getData().email || '', 
     password:'', 
     errorMsg : '',
     selectedInterests : UserStore.getData().interests || [],
     interests : InterestsStore.getData(),
     user: UserStore.getData(), 
     current : 0,
     snackbar : false,
     loading : false,
     ready:false,
     completed : false     
   };

   componentWillMount() {     
     UserStore.onChange(this.onUserStoreChange);
     InterestsStore.onChange(this.onInterestsChange);

     // Retreive list of interests
     InterestsActions.get();
   }

   componentDidMount() {
     
     let user = UserStore.getData();

     if( this.hasCompleted(user) ){
      this.setState({
        completed : true
      })
     }
   }
   
   componentWillUnmount() {
      UserStore.offChange(this.onUserStoreChange);
      InterestsStore.offChange(this.onInterestsChange);
   }


   handleChange = (name, value) => {    
      this.setState({...this.state, [name]: value, snackbar:false});    
   }


   onInterestSelect = (evt) => {
    
    let {id} = evt.target;

    let selected = _.find(this.state.interests,{id:parseInt(id)});

    let newSelectedInterests = _.filter(this.state.selectedInterests.concat(),function(item,index){
        return selected.id !== item.id
    });

    let interests =
      ( newSelectedInterests.length === this.state.selectedInterests.length ) 
          ? [...this.state.selectedInterests,selected] 
          : newSelectedInterests;
    
    this.setState({
        selectedInterests : interests,
        snackbar : false,
    });

   }

   onNextClick = () => {
    
    let { email, password, name, phone, selectedInterests } = this.state;
    
    // Create new user at step 3
    if( this.state.current === 3 ) {

      this.createAccount();

      this.setState({
        loading: true
      });
    }

    //  Update user at each step after
    // it has been created    
    if( this.state.current > 3 ){
      this.updateAccount();
    }

    // Run validation check
    // If passed -- move on to the 
    // the next page
    if( this.runValidations() )
      this.setState({
        current : this.state.current+1
      });    
   }

   runValidations = () => {

    let { user, email, password, current,phone, name, selectedInterests } = this.state;
    let valid = false;

    switch(current){
      case 0:
        if(name.length > 1){
          valid = true
        }
        else{    
          this.setState({
            errorMsg : 'But we really want to know your name!',
            snackbar : true
          });
        }
        break;

      case 1:
        if( phone.length > 9 ){
          valid = true;
        }
        else{
          this.setState({
            errorMsg : 'Your phone number is incorrect.',
            snackbar : true
          });
        }        
        break;

      case 2:
        if( KeystackUtils.validateEmail(email) ) 
          valid = true
        else
          this.setState({
            errorMsg : 'Your email address needs another look.',
            snackbar : true
          });
        break;

      case 3:
        if( password.length > 7 ){
          // This step is valid only if 
          // a user has successfully been created
          if( user.id ){
            valid = true;
          }
        }
        else{
          this.setState({
            errorMsg : 'Your password needs to be longer.',
            snackbar : true
          });
        }        
        break;
      

      case 4:
        if( selectedInterests.length > 0 )
          valid = true;
        else
          this.setState({
            errorMsg : 'Come on, select at least one!',
            snackbar : true
          });
        break;

      case 5:
        if( ( user.avatar_url || user.avatar_image)  )
          valid = true
        break;

    }

    return valid;

   }

   hasCompleted = ( user ) =>{
    
    let { email, id, first_name, interests } = user;
    let phone = user.phone || "";
    let avatar_image = user.avatar_image || "";
    

    return ( phone.length 
      > 0 && email.length 
      > 0 && id
      > 0 && avatar_image.length 
      > 0 && first_name.length 
      > 0 && interests.length ) ? true : false;
   }
   
   getCurrent = (user) =>{
      let current = 5;

      if( !user.phone )
        current = 2;
      if( !user.email )
        current = 3;
      if( !user.interests.length === 0 )
        current = 4;
      if( !user.avatar_image )
        current = 5;

      return current;
   }

   onUserStoreChange = (evt) => {

      let { data, type } = evt;
      let { status } = data;

      console.log(evt);

      if( type === UserConstants.CREATE_SUCCESS ){
          let user = UserStore.getData();
          this.setState({
            user : user,
            current : this.state.current+1,
            loading: false
          });
      }
      if( type === UserConstants.CREATE_FAIL ){
          let user = UserStore.getData();
          this.setState({
            user : user,
            current : this.state.current -1,
            errorMsg : status.error,
            snackbar : true,
            loading: false
          });
      }
      if( evt.type === UserConstants.GET_SUCCESS ){
         let user = UserStore.getData();
         console.log(this.getCurrent(user))
          this.setState({
            user : user,
            current : this.getCurrent(user),
            completed : this.hasCompleted(user),
            name : UserStore.getName(),
            email : user.email || "",
            phone : user.phone || "",
            errorMsg : "",
            snackbar : false,
            loading: false
          });


      }
      if( evt.type === UserConstants.UPDATE_SUCCESS ||  evt.type === UserConstants.UPDATE_AVATAR_SUCCESS ){
          
          let user = UserStore.getData();
          
          this.setState({
            user : user,
            completed : this.hasCompleted(user),
            name : UserStore.getName(),
            email : user.email || "",
            phone : user.phone || "",
            // current : this.state.current ,
            errorMsg : "",
            snackbar : false,
            loading: false
          });
      }      
   }

   onInterestsChange = (evt) =>{

      KeystackUtils.log(evt)

      if( evt.type === InterestsConstants.GET_SUCCESS ){
          let interests = InterestsStore.getData();
          this.setState({
            interests : interests
          });
      }      
   }

   submit = () => {
      let user = this.state.user;
      if( this.hasCompleted(user) ){
         this.setState({
            ready : true
         })
      }
   }


   updateAccount(){
      let { selectedInterests } = this.state;
      let userData = UserStore.getData();
      let user = _.assign({},this.state.user,  {
          interests : selectedInterests.map( (key,index) => {
              return key.id;
          })
      });      
      UserActions.update(user);
   }

   createAccount(){

      let {email,password,name,phone} = this.state;

      let arr = name.split(" ");
      let first = arr[0];
      let last = (arr.length === 2) ? arr[1]:"";

      UserActions.create({
        first_name : first,
        last_name : last,
        phone : phone,
        email : email,
        password : password
      });
   }

  render() {

    let submitBtnText = ( this.state.completed ) ? 'SAVE' : 'SKIP'

    if( this.state.completed && this.state.ready)
      return (
        <Redirect  to={{
            pathname:'/profile',
            state:{
              from: this.props.location
            }}
        }/>
      );
    

    return (
      <div>
        <TypeForm onSubmit={this.submit} submitBtnText={submitBtnText} nextBtnOnClick={this.onNextClick}
          current={this.state.current}
          nextBtnClass="floating-next-button" 
          submitBtnClass="floating-next-button">

          <TypeFormSection>
            <div className="wrapper">            
              <Input  className="form-input" 
                type='text' 
                name='name'
                ref={c => this._name = c}
                label="1. So, what's your name?" 
                value={this.state.name} 
                onChange={this.handleChange.bind(this, 'name')} />
            </div>  
          </TypeFormSection>

          <TypeFormSection>
            <div className="wrapper">            
              <Input className="form-input" 
              type='number' 
              name='phone' 
              ref={c => this._number = c}
              value={this.state.phone}
              label="2. What's the best number to reach you?" 
              onChange={this.handleChange.bind(this,'phone')}  />
            </div>  
          </TypeFormSection>


          <TypeFormSection>
            <div className="wrapper">            
              <Input className="form-input" 
                type='text' 
                name='email'
                ref={c => this._email = c}
                label="3. To setup your account, what's your email?"  
                value={this.state.email} 
                onChange={this.handleChange.bind(this, 'email')} />
            </div>
          </TypeFormSection>


          <TypeFormSection>
            <div className="wrapper">            
              <Input className="form-input" 
              type='password' 
              name='pass'
              ref={c => this._pass = c}
              value={this.state.password}
              label="4. Let's protect your account, enter a password." 
              onChange={this.handleChange.bind(this,'password')}  />
              <ProgressBar className={(!this.state.loading)?'hidden':''} mode='indeterminate'/>
            </div>  
          </TypeFormSection>

          

          <TypeFormSection>
            <div className="wrapper" style={{height:window.innerHeight}}> 
              <p>5. Select a few things that may be of interest to you.</p> 
              <hr />
              <div>              
                <Selectables data={this.state.interests} selected={this.state.selectedInterests} onTap={this.onInterestSelect} />
              </div>
            </div>  
          </TypeFormSection>

          <TypeFormSection>
            <div className="wrapper one-third" >            
              <p className="">6. Last one, upload a photo so we can know who you are!</p> 
              <hr />
              <AvatarUpload size={200} user={this.state.user} />
            </div>  
          </TypeFormSection>

        </TypeForm>

        <Snackbar
            label={this.state.errorMsg}
            ref='snackbar'
            type='cancel'
            active={this.state.snackbar}
          />

        </div>    
    )
  }  
}

SignUp.propTypes = {
  data : React.PropTypes.object
}
