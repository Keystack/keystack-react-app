import React from 'react';
import ons from 'onsenui';
import { Page, Button, Toolbar, ToolbarButton, Icon, ProgressCircular } from 'react-onsenui';

import TextMessageModule from '../components/TextMessageModule';

import LeadsStore from '../stores/LeadsStore';
import LeadsActions from '../actions/LeadsActions';
import NumbersStore from '../stores/NumbersStore';

const style ={
	progressBar : {
		margin:"0 auto", 
		paddingTop:"50%", 
		width:"50%", 
		height:"70px",
		textAlign:"center"
	}
}

export default class Conversation extends React.Component {

  constructor(props) {
    super(props);

    let route = props.location.pathname.split("/");
    let id = route[route.length-1];

    let lead = LeadsStore.getLeadById(id);

    this.state = {
    	leadId : id,
      isLoading: true,
    	lead : lead || null,
    };
  }

  componentWillMount() {
  	LeadsStore.onChange(this.onLeadsChange);
  }

  componentDidMount() {

  	let activeLine = NumbersStore.getActiveLine();

    console.log('Conversation.cdm',activeLine)
  	
  	if( activeLine ){
  		LeadsActions.get(activeLine.id);
      this.setState({
        isLoading: true
      })
    }
  }

  componentWillUnmount() {
  	LeadsStore.offChange(this.onLeadsChange);
  }

  onLeadsChange=(evt)=>{

  	let lead = LeadsStore.getLeadById(this.state.leadId);

  	if( lead ){
  		this.setState({
	  		lead : lead,
        isLoading:false
	  	});
  	}else{
  		this.props.history.push('/');
  	}

  }

  goBack=()=>{
  	this.props.history.goBack()
  }

  renderToolbar = () => {

    let {first_name,last_name,formatted_phone} = this.state.lead || {};
    let name = first_name + last_name;

    return (
      <Toolbar modifier="material">
        <div className='left'>
          <ToolbarButton  ripple modifier="material">
            <Icon icon='ion-android-arrow-back' onClick={this.goBack}></Icon>
          </ToolbarButton>
        </div>
        <div className='center'>
          {(name)?name:formatted_phone}
        </div>
      </Toolbar>
    );
  }

  render() {
  	let content;

  	if( !this.state.isLoading ){
  		content = <TextMessageModule data={this.state.lead} />
  	}else{
  		content = 
  			<div style={style.progressBar}>
  				<ProgressCircular indeterminate  />
  			</div>
  	}

    return (
      <Page modifier="material" renderToolbar={this.renderToolbar}>
      	{content}
      </Page>
    );
  }
}
