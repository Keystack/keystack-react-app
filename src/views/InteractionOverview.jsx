import React from 'react';
import { Page, ProgressCircular, Button,Toolbar,LazyList,ListItem,ToolbarButton, Icon} from 'react-onsenui';
import ons from 'onsenui';

import LeadsStore from '../stores/LeadsStore';
import LeadsActions from '../actions/LeadsActions';

import InteractionsStore from '../stores/InteractionsStore';
import InteractionsActions from '../actions/InteractionsActions';
import InteractionsConstants from '../constants/InteractionsConstants';

import NumbersStore from '../stores/NumbersStore';
import NumbersActions from '../actions/NumbersActions';

import {throttle,debounce} from 'throttle-debounce';

const styles = {
	progressBar : {
		margin:"0 auto", 
		paddingTop:"50%", 
		width:"50%", 
		height:"70px",
		textAlign:"center"
	},
	call_status: {
		marginRight: '10px'
	}
};

export default class InteractionOverview extends React.Component {
  
  state = { isLoading : false, interactions :[] }

  constructor(props) {
    super(props);
    this.resizeEvent = debounce(100,false,this.onResizeEvent).bind(this);

  }

  componentWillMount() {
  	InteractionsStore.onChange(this._onLatestInteractionsChangeEvent);
  }

  componentDidMount() {
  	
  	InteractionsActions.getLatest("call");
  	this.setState({
    	isLoading: true
    })
  }

  componentWillUnmount() {
  	InteractionsStore.offChange(this._onLatestInteractionsChangeEvent);
  }

  _onLatestInteractionsChangeEvent=( evt )=>{

  	if(evt.type === InteractionsConstants.GET_LATEST){
		// console.log(evt);
		let interactionState = 
	      InteractionsStore.getActionState(
	        InteractionsConstants.GET_LATEST);

	    let {latestInteractions,success} = interactionState;

	    this.setState({
	    	interactions : latestInteractions,
	    	isLoading: false
	    });
  	}
  }

  onClickCall=(evt)=>{

  }

  onClickMsg=(evt)=>{
  	
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
       <ToolbarButton ripple >
          <Icon icon=""></Icon>
        </ToolbarButton>
      );
    }

    return (
      <Toolbar modifier="material">
        <div className='left'>
          {leftButton}
        </div>
        <div className='center'>
          Call Logs
        </div>
        <div className='right'>
          {rightButton}
        </div>
      </Toolbar>
    );
  }

  renderRow=(index)=>{
  	let interaction = this.state.interactions[index];
  	
  	let name = interaction.first_name + ' ' + interaction.last_name;
  	let number = interaction.incoming_number || interaction.outgoing_number;
  	let content = (name.length>1)?name:number;

  	let statusImg = 
  		(interaction.missed_call)
  		? require('../assets/missed.png')
  		: require('../assets/incoming.png')

  	let callAvatar = 
  		(interaction.incoming_number)
  			? <img style={styles.call_status} src={statusImg} />
  			: <img style={styles.call_status} src={require('../assets/outgoing.png')} />



    return (
      <ListItem modifier='longdivider' key={index}>
      	<div className='left'>{callAvatar}</div>
        <div className='center'>{content}</div>
        <div className='right'>
        	<Button modifier='quiet' ripple>
        	 <Icon icon="ion-android-call" size={24} modifier="material" onClick={this.onClickCall}></Icon>
        	</Button>
        </div>
        <div className='right'>
        	 
        	 <Button modifier='quiet' ripple>
        	 	<Icon icon="ion-android-chat" modifier="material" size={24} onClick={this.onClickMsg}></Icon>
        	</Button>
        </div>
      </ListItem>
    );
  }

  render() {

  	if( this.state.isLoading ){
  		return(
  			<Page renderToolbar={this.renderToolbar}>
	  			<div style={styles.progressBar}>
	  				<ProgressCircular indeterminate  />
	  			</div>
      		</Page>
		);
  	}


    return (
      <Page renderToolbar={this.renderToolbar}>
      	<LazyList
          length={this.state.interactions.length}
          renderRow={this.renderRow}
          calculateItemHeight={() => ons.platform.isAndroid() ? 48 : 44}
        />
      </Page>
    );
  }
}
