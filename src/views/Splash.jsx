import React from 'react';
import Snackbar from 'react-toolbox/lib/snackbar';
import ProgressBar from 'react-toolbox/lib/progress_bar';

import {Button} from 'react-toolbox/lib/button';
import PropTypes from 'prop-types';
import KeystackUtils from '../utils/keystack-utils'

import UserConstants from '../constants/UserConstants'
import UserActions from '../actions/UserActions'
import UserStore from '../stores/UserStore'



const ButtonToNavigate = (props, context) => (
  	<Button 
	  label="Sign Up" 
	  style={{fontSize:'1.2em',fontWeight:'bold',color:"#fff"}}
	  onClick={() => context.router.history.push('/signup')}  
	  primary />
);

ButtonToNavigate.contextTypes = {
  router: PropTypes.shape({
    history: PropTypes.object.isRequired,
  }),
};

export default class Splash extends React.Component {
  static propTypes = {
    name: React.PropTypes.string,
  };

  state = {
	currentVideo : 0,
	msgIndex : 0,
	user : UserStore.getData(),
	snackbar : false,
	loading : false,
	number: '',
  }


  componentWillMount() {
  	UserStore.onChange(this.onUserStoreChange);
  	
  	if( this.state.user.id ){
  		UserActions.getUserByNumber(this.state.user.phone);
  		this.setState({loading:true})
  	}
  }

  componentWillUnmount(){
  	UserStore.offChange(this.onUserStoreChange);
  }

  onUserStoreChange = ( evt ) => {

  	let { data, type } = evt;
    let { status } = data;


  	if( evt.type === UserConstants.GET_SUCCESS ){
        let user = UserStore.getData();
        this.setState({
            user : user,            
            loading: false
        });
     }
     if( evt.type === UserConstants.GET_FAIL ){

        this.setState({
            snackbar : true,
            error :  "Can't find you, check your number.",        
            loading : false
        });
     }
  }

  handleChange = (name, evt) => {
   		let {value} = evt.target;
   		
   		value = KeystackUtils.unPrettyNumber(value);

   		if( value.length > 10 ) return

   		if(value.length === 10)
   			UserActions.getUserByNumber(value)

      	this.setState({...this.state, 
      		[name]: value, 
      		snackbar:false});    
   }

  playVideo = ( index ) => {
		
	let currentVideo = index;
	this.video.src = this.video.children[currentVideo].src;

	this.video.load();
	this.video.play();
  }

  onVideoEnd = () =>{
  	console.log()
	let nextVideo = this.state.currentVideo + 1;

	if ( nextVideo >= this.video.children.length ) {
	  nextVideo = 0;
	}

	this.setState({
	  currentVideo:nextVideo
	});

	this.playVideo( nextVideo );
  }

  componentDidMount() {
	this.video = this.refs.video;
	$(this.video).on('ended',this.onVideoEnd);	


  }

  componentWillUnmount() {
  	clearTimeout(this.timeOut);
  }

  onLoginTap = (evt) => {

  	let messageIndex = this.state.msgIndex;
  	console.log(messageIndex)

  	if( !this.state.snackbar && messages.length > this.state.msgIndex ){
	  	this.setState({
	  		msg : messages[messageIndex],
	  		snackbar : true,
	  		msgIndex : messageIndex+1
	  	});

	  	this.timeOut = setTimeout(()=>{
	  		this.setState({
	  			snackbar:false
	  		})
	  		if( this.state.msgIndex >= messages.length ){
	  			this.setState({
		  			snackbar:false,
		  			hideLogin : true
		  		})
	  		}	
	  	},2000);
	 }
  }

  componentWillUnmount() {
  	$(this.video).off('ended',this.onVideoEnd);
  }

  render() {

  	console.log('show snack',this.state.snackbar)

  	let loginButton = ( this.state.hideLogin ) 
  		? ""
  		: <Button  label="LOGIN" style={{fontSize:'1.2em',fontWeight:'bold'}}  
    		onClick={this.onLoginTap} raised primary />


    let form = 
    	(<div>
			<input 
				onChange={this.handleChange.bind(this,'number')}
				style={styles.input}
				value={KeystackUtils.prettyNumber(this.state.number)}
				placeholder="Sign in using your phone number" />
		</div>);

    let content = 
    	(<div className={(this.state.loading)?'hidden':''} style={{margin: "30px 0 50px 0"}}>
    		<div className="bounce" style={{
    			height: "200px",
    			width: "200px",
    			borderRadius: '99999px',
    			backgroundSize:"cover",
    			margin:"auto",
    			border: "8px solid rgb(63, 81, 181)",
    			backgroundRepeat: "no-repeat",
    			backgroundImage: `url('${this.state.user.avatar_image}')`
    		}}>
    		</div>
    		<h2>You've officially checked in, {this.state.user.first_name}! Welcome to the Summer 2017 Hackthon</h2>
    	</div>)

    let contents = ( this.state.user.id ) ? content : form ;
  	
    return (
      <div style={styles.container}>      	
      	<video ref="video" autoPlay muted playsInline style={styles.video}>
		    <source src={ require('../assets/722729745.mp4') } type="video/mp4" />
            <source src={ require('../assets/722779149.mp4') } type="video/mp4" />
            <source src={ require('../assets/722787372.mp4') } type="video/mp4" />
            <source src={ require('../assets/497632384.mp4') } type="video/mp4" />
		</video>
		<div style={styles.logoContainer}>
	        <img src={require('../assets/logo-sm.png')} style={styles.logo}/>
	        <div style={{height:"100px",position:"absolute",left:"50%",top:"150px",marginLeft:"-30px"}}>
	        	<ProgressBar className={(this.state.loading)?'':'hidden'} type="circular" mode="indeterminate" />
	        </div>
	        { contents }
		</div>
		
	    <Snackbar
            label={this.state.error}
            ref='snackbar'
            type='warning'
            timeout={2500}
            active={this.state.snackbar}
          />          
      </div>
    );
  }
};

const styles = {
	video:{
		position: "absolute",
		top: "0%",
		left:"-1000px",
		opacity:"0.4",
		minHeight: "100%",
		width: "auto",
		height: "auto",
		zIndex: 0,
		backgroundColor:"transparent",
		backgroundSize: "cover" 
	},
	container:{
		color:"white",
		lineHeight:"2.2em",
		position:'relative',
		overflow: 'hidden',
		height:window.innerHeight,
		width:window.innerWidth,
		background:"#242843"
	},
	logoContainer: {
		textAlign: "center",
		height:"100%",
		position:"absolute",
		top:"10%",
		width:"100%"
	},
	logo: {
		maxWidth:"90%",
	},
	buttonSection:{
		position:'absolute',
		bottom:'80px',
		textAlign:"center",
		width:'100%'
	},
	input: {
		fontFamily: "Montserrat-Light",
		color:"#888",
		marginTop:'20px',
		padding: "10px 0",
		width:"90%",
		fontSize: "1.2em",
		outline: 'none',
		border: 'none',
		textAlign: 'center',
		border: '1px solid #444',
		borderRadius: '2px 2px',

	}
};

const messages = [
	"Really? You know you don't have an account!",
	"Wrong button buddy! Try the other one, eh?!",
	"Come on, I can do this all day! Really, I can.",
	"Really?... let's just get with on it! Sign Up!",
	"Enjoying yourself? I glad someone finds this amusing",
	"So you're gonna take it there? Let's not do that.",
	"Okay, you're gonna make me ...",
	"Alright! That's it!"
];
