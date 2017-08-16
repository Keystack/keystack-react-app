import React from 'react';
import { Input , Page , Button , ToolbarButton, Toolbar , Icon } from 'react-onsenui'

import ks from '../utils/keystack-utils';

import InteractionsConstants  from '../constants/InteractionsConstants';

import UserStore          from '../stores/UserStore';
import LeadsStore         from '../stores/LeadsStore'; 
import NumbersStore       from '../stores/NumbersStore';
import InteractionsStore  from '../stores/InteractionsStore';

import LeadsActions           from '../actions/LeadsActions';
import InteractionsActions    from '../actions/InteractionsActions';

import SMSConversation from './SMSConversation';
// import ContactCardModal from './ContactCardModal';
// import ImageUploadModal from './ImageUploadModal';

import {throttle,debounce} from 'throttle-debounce';
import _ from "lodash";

const styles = {
  container: {
    padding: "10px",
    textAlign : 'left !important',
  },
  numberContainer:{
    height:"60px",
    boxShadow:"3px 3px 3px rgba(0,0,0,0.3)"
  },
  textContainer:{
    borderTop:"1px solid #eee",
    height:"45px",
    padding:"5px 5px",
    position:"absolute",
    bottom:"0px",
    width:"100%",
    overflow:"hidden"
  },
  input : {
    // border: "solid 1px #ccc",
    margin: "20px 0",
    display:"block",
    textAlign : 'left !important',
    background: 'transparent',
  },
  msgInput : {
    // border: "solid 1px #ccc",
    display:"block",
    margin:"5px",
    height:"40px",
    textAlign : 'left !important',
    background: 'transparent',
  },
  noPadding : {
    paddingLeft : 0,
    paddingRight : 0
  }
};

export default class NewTextMessageModule extends React.Component {
  
  constructor(props) {
    super(props);

    this.resizeEvent = (debounce(100,false,this.onResizeEvent)).bind(this);

    this.state = {
    	lead : props.data,
      phoneNumber : null,
      messageText : "",
      user : UserStore.get('data'),
      activeLine : NumbersStore.getActiveLine(),
    	interactions : this.props.interactions || [],
      height : window.innerHeight - 60 + "px",
      contactModalOpen : false,
      attachModalOpen : false
    };

  }

  componentWillMount() {
  	InteractionsStore.onChange(this.onInteractionsStoreChange);
    window.addEventListener('resize',this.resize);
  }

  componentWillUnmount() {
    InteractionsStore.offChange(this.onInteractionsStoreChange);
    window.removeEventListener('resize',this.resize);

    clearInterval(this.pollInterval);
  }

  componentDidMount(){

  	let _self = this;
    let { data } = this.props;

    if( data && data.id ){
      
      InteractionsActions.getTextMessages({
        lead_id : data.id,
        type : "message"
      });

      this.pollInterval = setInterval(function(){
        InteractionsActions.getTextMessages({
          lead_id : data.id,
          type: "message"
        });
      },10000);
    }

  }

  onResizeEvent(){
    this.setState({
      height:window.innerHeight - 60 + "px"
    });
  }

  onInputChange=(evt)=>{

    if(evt.target.value.length > 14) {
      this.forceUpdate()
      return;
    }

    let value = (evt.target.value.replaceAll("[- \/\\^$+?a-zA-Z.\\(\\)\\[\\]\\{\\}]",""));

    this.setState({
      phoneNumber : value
    });
  }

  onMessageTextChange=(evt)=>{
    this.setState({
      messageText : evt.target.value
    });
  }

  onCloseTap=()=>{
    // Go to Message Tab on Main View
    this.props.history.push("/tab/0");
  }

  onInteractionsStoreChange=(evt)=>{

    console.log("NewTextMessageModule.onInteractionsStoreChange",evt);
    
    if( evt.type === InteractionsConstants.NEW_INTERACTION ){

      let {newInteraction} = InteractionsStore.getActionState(InteractionsConstants.NEW_INTERACTION);

      if( newInteraction && newInteraction.lead_id ){
        this.props.history.push("/conversation/"+newInteraction.lead_id);
      } 
    } 
  }

  handleKeyPress=(event)=>{
    
    if(event.key === 'Enter'){
      
      let message = this.state.messageText;
      let phoneNumber = this.state.phoneNumber;
      let calucro_id = this.state.activeLine.id;
      let lead_id = (this.state.lead)? this.state.lead.id : null;

      if( message.length ){

        InteractionsActions.create({
          lead_id : lead_id,
          to : phoneNumber,
          calucroID : calucro_id,
          type : "message",
          text : message
        });

      }
    }

  }

  onMessageSend=()=>{
  	let message = this.state.messageText;
    let phoneNumber = this.state.phoneNumber;
    let calucro_id = this.state.activeLine.id;
    let lead_id = (this.state.lead)? this.state.lead.id : null;

  	if( message.length ){
  		InteractionsActions.create({
  			lead_id : lead_id,
        to : phoneNumber,
        calucroID : calucro_id,
  			type : "message",
  			text : message
  		});
  	}
  }

  renderToolbar = () => {

    let leftButton= null , rightButton = null;
    let activeLine = NumbersStore.getActiveLine();

    leftButton = (
        <ToolbarButton  ripple modifier="" onClick={this.onCloseTap}>
          <Icon icon='ion-android-close' style={{color:"white"}}></Icon>
        </ToolbarButton>
    );

    return (
      <Toolbar modifier="material">
        <div className='left'>
          {leftButton}
        </div>
        <div className='center'>
          New Message
        </div>
        <div className='right'>
          {rightButton}
        </div>
      </Toolbar>
    );
  }

  render() {

    return (
      <Page renderToolbar={this.renderToolbar}>
        
        <div className="container" style={styles.numberContainer}>
          <div className="col-xs-1" style={styles.noPadding}>
            <p style={{padding:"20px 0"}}>To:</p>
          </div>
          <div className="col-xs-11" style={styles.noPadding}>
            <Input
                style={styles.input}
                value={ks.prettyNumber(this.state.phoneNumber)}
                onChange={this.onInputChange}
                modifier='transparent'
                type='text'
                placeholder='Type a number to text' />
          </div>              
        </div>

      	<SMSConversation interactions={this.state.interactions} />
        
        <div className="" style={styles.textContainer}>
          <div className="col-xs-10" style={styles.noPadding}>
            <Input
                style={styles.msgInput}
                value={this.state.messageText}
                onChange={this.onMessageTextChange}
                modifier='transparent'
                type='text'
                placeholder='Enter a message' />
          </div>
          <div className="col-xs-2" style={styles.noPadding}>
            <Button onClick={this.onMessageSend}>Send</Button>
          </div>
        </div>
        
      </Page>
    );
  }
}

NewTextMessageModule.propTypes = {
};
