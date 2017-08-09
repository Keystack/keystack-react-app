import React from 'react';

import {Page,Button,Toolbar,ToolbarButton,Icon} from 'react-onsenui';
import TextMessageModule from '../components/TextMessageModule';

import LeadsStore from '../stores/LeadsStore';
import LeadsActions from '../actions/LeadsActions';

import InteractionsStore from '../stores/InteractionsStore';
import InteractionsActions from '../actions/InteractionsActions';
import InteractionsConstants from '../constants/InteractionsConstants';

import NumbersStore from '../stores/NumbersStore';
import NumbersActions from '../actions/NumbersActions';


const styles = {
	body : {
		background: "#ccc"
	},
	leadList :{
		maxWidth:"36rem",
		borderLeft:"1px solid #ccc",
		borderRight:"1px solid #ccc"
	},
  controlBarSections:{
    height:"80px",
    lineHeight:"80px"
  }
};

export default class Messenger extends React.Component {
  
  constructor(props) {
    super(props);

    this._onLeadsChangeEvent = this._onLeadsChangeEvent.bind(this);
    // this._onInteractionsChangeEvent = this._onInteractionsChangeEvent.bind(this);
    this._onNumbersChangeEvent = this._onNumbersChangeEvent.bind(this);

    let route = props.location.pathname.split("/");
    let id = route[route.length-1];

    this.state = {
      latestInteractions : [],
    	leads : LeadsStore.getLeads(),
      convoLeadId : id || null,
      messages : InteractionsStore.getActionState(InteractionsConstants.TEXT_MESSAGE_OVERVIEW,"overview"),
    	calucroNumbers : NumbersStore.getNumbers(),
    	selectedNumber : "",      
    	selectedIndex : -1,
      isLoadingLeads : false,
      isLoadingMessages : false,
      isLoadingInteractions : false
    };
  }

  _onLeadsChangeEvent(){
  	let leads = LeadsStore.getLeads();
  	this.setState({
  		leads: leads,
      isLoadingLeads : false,
  	});
  }


  _onNumbersChangeEvent(){
  	let numbers = NumbersStore.getNumbers();
  	if( numbers.length ){
	  	this.setState({
	  		calucroNumbers: numbers,
	  		selectedNumber : numbers[0].id
	  	});
  	}
  }

  goBack = () =>{
    this.props.history.push('/');
  }

  componentWillMount() {
  	let calucroNumbers = NumbersStore.getNumbers();
  	InteractionsStore.onChange(this._onInteractionsChangeEvent);
  	NumbersStore.onChange(this._onNumbersChangeEvent);
  }

  componentDidMount() {

    this.setState({
      isLoadingMessages : true,
    });
    
    let numbers = NumbersStore.getNumbers();
    
    if(numbers.length === 0){
      // Fetch Calucro Numbers
      NumbersActions.get();
    }

    // Fetch new Leads
    InteractionsActions.get();
    InteractionsActions.getTextOverview();
  }

  componentWillUnmount(){
  	InteractionsStore.offChange(this._onInteractionsChangeEvent);
  	NumbersStore.offChange(this._onNumbersChangeEvent);
  }

  renderToolbar = () => {

    const title = this.props.data || '';
    return (
      <div>
        <div className='left'>
          <ToolbarButton>
            <Icon icon='ion-android-arrow-back' onClick={this.goBack}></Icon>
          </ToolbarButton>
        </div>
        <div className='center'>
          {title}
        </div>
        </div>
    );
  }

  render() {

  	let selected = (this.state.selectedIndex >= 0 && this.state.messages.length) 
      ? this.state.messages[this.state.selectedIndex] 
      : {};

    console.log(selected);

    return (
      <Page modifier="android" renderToolbar={this.renderToolbar}>
        <TextMessageModule data={{id:selected.lead_id}} />
      </Page>
    );

  }
}

Messenger.propTypes = {
  data : React.PropTypes.object.isRequired
};

Messenger.contextTypes ={
  router: React.PropTypes.object
}
