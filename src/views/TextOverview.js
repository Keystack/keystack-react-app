import React from 'react';
import { Redirect } from 'react-router-dom';
import {Page,Button,Toolbar,ToolbarButton,Icon} from 'react-onsenui';
import TextMessageList from '../components/TextMessageList';
import TextMessageModule from '../components/TextMessageModule';

import ListGroup from 'react-bootstrap/lib/ListGroup';
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem';

import LeadsStore from '../stores/LeadsStore';
import LeadsActions from '../actions/LeadsActions';

import InteractionsStore from '../stores/InteractionsStore';
import InteractionsActions from '../actions/InteractionsActions';
import InteractionsConstants from '../constants/InteractionsConstants';

import NumbersStore from '../stores/NumbersStore';
import NumbersActions from '../actions/NumbersActions';
import NumbersConstants from '../constants/NumbersConstants';

export default class TextOverview extends React.Component {

  constructor(props) {
    super(props);

    let leads = LeadsStore.getLeads();
    let calucroNumbers = NumbersStore.getNumbers()
    let overviewMessages = 
      InteractionsStore.getActionState(
        InteractionsConstants.TEXT_MESSAGE_OVERVIEW,
        "overview");

    this.state = {
      latestInteractions : [],
      leads : leads,
      convoLeadId : null,
      messages : overviewMessages,
      calucroNumbers : calucroNumbers,
      selectedNumber : "",      
      selectedIndex : -1,
      isLoadingLeads : false,
      newMessage :false,
      isLoadingMessages : true
    }
  }

  componentWillMount() {
    InteractionsStore.onChange(this._onInteractionsChangeEvent);
    NumbersStore.onChange(this._onNumbersChangeEvent);
  }

  componentDidMount() {
    
    let numbers = NumbersStore.getNumbers();
    let activeLine = NumbersStore.getActiveLine();

    if( numbers.length === 0 || activeLine === null ){
      // Fetch Calucro Numbers
      NumbersActions.get();
    }
    else{

      this.setState({
        isLoadingMessages : true,
        activeLine : activeLine
      });

      // Fetch new text message overview
      InteractionsActions.getTextOverview({
        calucro_id : activeLine
      });
    }
  }

  componentWillUnmount(){
    InteractionsStore.offChange(this._onInteractionsChangeEvent);
    NumbersStore.offChange(this._onNumbersChangeEvent);
  }

  onCreateMessage=()=>{
    this.setState({
      newMessage :true
    })
  }

  _onLeadsChangeEvent=()=>{
    
    let leads = LeadsStore.getLeads();
    
    this.setState({
      leads: leads,
      isLoadingLeads : false
    });
  }

  _onInteractionsChangeEvent=( evt )=>{

    let selectedIndex = this.state.selectedIndex;

    if( evt.type === InteractionsConstants.TEXT_MESSAGE_OVERVIEW){
      
      let interactionState = 
      InteractionsStore.getActionState(
        InteractionsConstants.TEXT_MESSAGE_OVERVIEW);

      let {overview,success} = interactionState;

      if( success ){

          if( this.state.convoLeadId ){
            selectedIndex = 
              InteractionsStore.getTextIndexByLeadId(this.state.convoLeadId);
          }

          this.setState({
            messages : overview,
            selectedIndex : selectedIndex,
            isLoadingMessages : false
          });
      }

    }

  }

  _onNumbersChangeEvent=( evt ) => {
    
    let numbers = NumbersStore.getNumbers();
    let activeLine = NumbersStore.getActiveLine();

    if( evt.type === NumbersConstants.GET_SUCCESS ){

        console.log(NumbersConstants.GET_SUCCESS,activeLine,this.state.activeLine)

        if( activeLine.id !== this.state.activeLine.id ){
      
        let id = activeLine.id || null;

        // Fetch new Leads
        InteractionsActions.getTextOverview({calucro_id:id});

        this.setState({
          calucroNumbers: numbers,
          selectedNumber : activeLine
        });
      }
    }
    
  }

  onListItemTap=(evt)=>{
    let messageID = evt.target.id;
    
    if( messageID ){
      
      let selected = InteractionsStore.getTextIndexById(messageID);
      let message  = InteractionsStore.getTextById(messageID);

      if(this.props.onSMSTap )
        this.props.onSMSTap(message);
    }
  }

  renderToolbar = () => {

    let leftButton= null , rightButton = null;
    let activeLine = NumbersStore.getActiveLine();

    leftButton = (
        <ToolbarButton  ripple modifier="" onClick={this.props.onMenuTap}>
          <Icon icon='ion-android-menu' style={{color:"white"}}></Icon>
        </ToolbarButton>
    );

    if( activeLine ){
      rightButton = (
       <ToolbarButton ripple onClick={this.onCreateMessage}>
          <Icon icon="ion-ios-compose"></Icon>
        </ToolbarButton>
      );
    }

    return (
      <Toolbar modifier="material">
        <div className='left'>
          {leftButton}
        </div>
        <div className='center'>
          Messages
        </div>
        <div className='right'>
          {rightButton}
        </div>
      </Toolbar>
    );
  }

  render() {
    
    let content;
    let lead = LeadsStore.getLeadById(this.state.convoLeadId);

    if( this.state.newMessage ){
      return(
        <Redirect to={{
          pathname: '/conversation/new/',
          state: { from: this.props.location }
        }}/>
      )
    }

    content = (
      <TextMessageList
        loading={this.state.isLoadingMessages} 
        data={this.state.messages} 
        onItemTap={this.onListItemTap} />
    );
      
    return (
      <Page renderToolbar={this.renderToolbar}>
      	{content}
      </Page>
    );
  }
}

TextOverview.propTypes={
  data: React.PropTypes.object,
  onSMSTap : React.PropTypes.func
}

TextOverview.contextTypes={
  router: React.PropTypes.object
}
