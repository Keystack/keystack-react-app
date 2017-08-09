import React from 'react';
import DialPad from '../components/DialPad';
import {Page,Button} from 'react-onsenui';
import TextMessageList from '../components/TextMessageList';
import TextMessageModule from '../components/TextMessageModule';

import LeadsStore from '../stores/LeadsStore';
import LeadsActions from '../actions/LeadsActions';

import InteractionsStore from '../stores/InteractionsStore';
import InteractionsActions from '../actions/InteractionsActions';
import InteractionsConstants from '../constants/InteractionsConstants';

import NumbersStore from '../stores/NumbersStore';
import NumbersActions from '../actions/NumbersActions';

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
      isLoadingMessages : false,
      isLoadingInteractions : false
    }
  }

  componentWillMount() {
    InteractionsStore.onChange(this._onInteractionsChangeEvent);
    NumbersStore.onChange(this._onNumbersChangeEvent);
  }

  componentDidMount() {

    this.setState({
      isLoadingMessages : true,
    });
    
    let numbers = NumbersStore.getNumbers();
    let activeLine = NumbersStore.getActiveLine();
    
    if( numbers.length === 0 ){
      // Fetch Calucro Numbers
      NumbersActions.get();
    }
    else{
      // Fetch new text message overview
      InteractionsActions.getTextOverview({
        calucro_id:activeLine
      });
    }
  }

  componentWillUnmount(){
    InteractionsStore.offChange(this._onInteractionsChangeEvent);
    NumbersStore.offChange(this._onNumbersChangeEvent);
  }

  _onLeadsChangeEvent=()=>{
    
    let leads = LeadsStore.getLeads();
    
    this.setState({
      leads: leads,
      isLoadingLeads : false,
    });
  }

  _onInteractionsChangeEvent=()=>{

    let selectedIndex = this.state.selectedIndex;
    let messages = 
      InteractionsStore.getActionState(
        InteractionsConstants.TEXT_MESSAGE_OVERVIEW,
        "overview");

    if( messages !== this.state.messages ){

      if( this.state.convoLeadId ){
        selectedIndex = InteractionsStore.getTextIndexByLeadId(this.state.convoLeadId);
      }

      this.setState({
        messages : messages,
        selectedIndex : selectedIndex,
        isLoadingMessages : false
      });
    }
  }

  _onNumbersChangeEvent= () =>{
    
    let numbers = NumbersStore.getNumbers();
    let activeLine = NumbersStore.getActiveLine();
    
    if( numbers.length && activeLine ){

      let id = activeLine.id || null;

      // Fetch new Leads
      InteractionsActions.getTextOverview({calucro_id:id});

      this.setState({
        calucroNumbers: numbers,
        selectedNumber : activeLine
      });
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

  render() {
    
    let content;
    let lead = LeadsStore.getLeadById(this.state.convoLeadId);

    content = (
      <TextMessageList 
        data={this.state.messages} 
        onItemTap={this.onListItemTap} />
    );
      
    return (
      <Page >
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
