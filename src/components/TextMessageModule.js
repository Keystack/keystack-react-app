import React from 'react';
import UserStore from '../stores/UserStore';

import InteractionsStore from '../stores/InteractionsStore';
import InteractionsActions from '../actions/InteractionsActions';
import InteractionsConstants from '../constants/InteractionsConstants';

import LeadsStore from '../stores/LeadsStore';
import LeadsActions from '../actions/LeadsActions';

import VcardStore from '../stores/VcardStore';
import VcardActions from '../actions/VcardActions';

import SMSConversation from './SMSConversation';
import MessageToolbar from './MessageToolbar';

import ContactCardModal from './ContactCardModal';
import ImageUploadModal from './ImageUploadModal';

import FormGroup from 'react-bootstrap/lib/FormGroup';
import InputGroup from 'react-bootstrap/lib/InputGroup';
import FormControl from 'react-bootstrap/lib/FormControl';
import Button from 'react-bootstrap/lib/Button';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import Glyphicon  from 'react-bootstrap/lib/MenuItem';

import {throttle,debounce} from 'throttle-debounce';
import _ from "lodash";


export default class TextMessageModule extends React.Component {
  

  constructor(props) {
    super(props);

    this.onInteractionsStoreChange = this.onInteractionsStoreChange.bind(this);
    this.onLeadsStoreChange = this.onLeadsStoreChange.bind(this);
    this.onMessageSend = this.onMessageSend.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.resizeEvent = this.resizeEvent.bind(this);

    this.onAttachContact = this.onAttachContact.bind(this);
    this.onAttachImage = this.onAttachImage.bind(this);

    this.onAttachContactSelect = this.onAttachContactSelect.bind(this);
    this.onAttachImageSelect = this.onAttachImageSelect.bind(this);

    this.closeContactModal = this.closeContactModal.bind(this);
    this.closeAttachModal = this.closeAttachModal.bind(this);

    this.onVcardStoreChange = this.onVcardStoreChange.bind(this);

    this.state = {
    	lead : props.data,
      user: UserStore.get('data'),
      vcards : VcardStore.getVcards(),
    	interactions : this.props.interactions || [],
      height: window.innerHeight - 60 + "px",
      throttledResize:debounce(100,false,this.resizeEvent),
      contactModalOpen : false,
      attachModalOpen : false
    };

  }


  componentWillMount() {

  	InteractionsStore.onChange(this.onInteractionsStoreChange);
    VcardStore.onChange(this.onVcardStoreChange);
    
  
     $(window).on('resize',this.state.throttledResize);
  }


  componentWillUnmount() {
    InteractionsStore.offChange(this.onInteractionsStoreChange);
    VcardStore.offChange(this.onVcardStoreChange);


    $(window).off('resize',this.state.throttledResize);
    clearInterval(this.pollInterval);
  }

  componentDidMount() {

  	let _self = this;
    let { data } = this.props;

    VcardActions.get();

    if( data && data.id ){
      
      InteractionsActions.getTextMessages({
        lead_id: data.id,
        type: "message"
      });

      this.pollInterval = setInterval(function(){
        InteractionsActions.getTextMessages({
          lead_id: data.id,
          type: "message"
        });
      },10000);

    }

  }

  onAttachImage(){

  }

  onAttachContact(evt,vCardID){

    let leadID = this.state.lead.id;
    let message = this.messageText.value;

    if( vCardID && leadID ){

      InteractionsActions.create({
        lead_id:this.state.lead.id,
        v_card_id:vCardID,
        type:"v_card"
      });

      this.setState({
        contactModalOpen:false
      });

    }

  }

  onAttachContactSelect(){
    this.setState({
      contactModalOpen:true
    });
  }

  onAttachImageSelect(){
    this.setState({
      attachModalOpen:true
    });
  }

  closeContactModal(){
    this.setState({
      contactModalOpen: false
    })
  }
  
  closeAttachModal(){
    this.setState({
      attachModalOpen: false
    })
  }


  resizeEvent(){
      this.setState({
        height:window.innerHeight-60 + "px"
      });
  }

  componentWillReceiveProps(nextProps) {

    let { data } = nextProps;

    if( data && data.id ){
        InteractionsActions.getTextMessages({
          lead_id : data.id,
          type: "message"
        });

        this.setState({
          lead : nextProps.data
        });
    }
  
  }

  onInteractionsStoreChange(){
  	let state = InteractionsStore.getActionState(InteractionsConstants.TEXT_MESSAGES);
  	this.setState({
  		interactions:state.interactions
  	});
  }

  onLeadsStoreChange(){
  }

  onVcardStoreChange(){
    let vcards = VcardStore.getVcards();

    console.log(vcards);

    this.setState({
      vcards : vcards
    });
  }

  handleKeyPress(event){
    if(event.key === 'Enter'){
      let message = this.messageText.value;
      console.log(message);

      if( message.length ){
        
        InteractionsActions.create({
          lead_id:this.state.lead.id,
          type:"message",
          text:message
        });

        this.messageText.value= "";
      }
    }
  }

  onMessageSend(){

  	let message = this.messageText.value;

  	console.log(message);

  	if( message.length && this.state.lead ){
  		InteractionsActions.create({
  			lead_id:this.state.lead.id,
  			type:"message",
  			text:message
  		});

      this.messageText.value= "";
  	}

  }

  render() {

    return (
      <div className="flex" 
        style={{
          flex:1,
          overflow:"hidden",
          height : this.state.height}}
        >

      	<SMSConversation interactions={this.state.interactions} />

        <ContactCardModal
          data={this.state.vcards} 
          show={this.state.contactModalOpen} 
          onClose={this.closeContactModal} 
          onSave={this.onAttachContact} />

        <ImageUploadModal
          user={this.state.user} 
          show={this.state.attachModalOpen} 
          onClose={this.closeAttachModal}
          onSave={this.onAttachImage} />

      	<div style={{position:"fixed",bottom:"0px",background:"#fff",borderTop:"1px solid #eee"}}>
  	  		
          <FormGroup style={{marginBottom:"0px"}}>
          
          <InputGroup> 
            
            <DropdownButton
                dropup
                style={{backgroundColor:"white",border:"none",color:"#666",fontSize:"16px"}}
                id="message-attach-button"
                componentClass={InputGroup.Button}
                title="">
              <MenuItem key="1" style={{borderTopLeftRadius:"0px"}} onClick={this.onAttachContactSelect}>Contact Card</MenuItem>
              <MenuItem key="2" style={{}} onClick={this.onAttachImageSelect}>Image</MenuItem>
            </DropdownButton>

            <FormControl 
              onKeyDown={this.handleKeyPress} 
              inputRef={ref => { this.messageText = ref; }} 
              type="text" 
              /> 

              <Button
                bsStyle="primary"
  		        	onClick={this.onMessageSend}
  		        	style={{fontSize:"14px"}}
  		          componentClass={InputGroup.Button}
  		          id="input-button-addon">
                  Send
  		        </Button>

  		      </InputGroup>

  		    </FormGroup>
      	</div>
      </div>
    );
  }
}

TextMessageModule.propTypes = {
	data : React.PropTypes.object.isRequired
};
