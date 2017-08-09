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
  static propTypes = {
    name: React.PropTypes.string,
  }


  constructor(props) {
    super(props);

    let route = props.location.pathname.split("/");
    let id = route[route.length-1];

    let lead = LeadsStore.getLeadById(id);

    this.state = {
    	leadId : id,
    	lead : lead || null,
    };
  }

  componentWillMount() {
  	LeadsStore.onChange(this.onLeadsChange);
  }

  componentDidMount() {

  	let activeLine = NumbersStore.getActiveLine();
  	
  	if( activeLine )
  		LeadsActions.get(activeLine.id)
  }

  componentWillUnmount() {
  	LeadsStore.offChange(this.onLeadsChange);
  }

  onLeadsChange=(evt)=>{

  	let lead = LeadsStore.getLeadById(this.state.leadId);

  	if( lead ){
  		this.setState({
	  		lead : lead
	  	});
  	}else{
  		this.props.history.push('/');
  	}

  }

  goBack=()=>{
  	this.props.history.goBack()
  }

  renderToolbar = () => {

    return (
      <Toolbar modifier="material">
        <div className='left'>
          <ToolbarButton  ripple modifier="material">
            <Icon icon='ion-android-arrow-back' onClick={this.goBack}></Icon>
          </ToolbarButton>
        </div>
        <div className='center'>
          Test
        </div>
      </Toolbar>
    );
  }

  render() {
  	let content;

  	if(this.state.lead){
  		content = <TextMessageModule data={this.state.lead}/>
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
