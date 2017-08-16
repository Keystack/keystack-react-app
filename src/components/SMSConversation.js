import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';

import {throttle,debounce} from 'throttle-debounce';
import _ from "lodash";


const style = {
	incoming:{
		backgroundColor:"#4183D7",
		color:"white",
		padding: "15px",
		margin:"10px",
		borderRadius: "10px 20px",
		display:"inline-block"
	},
	incomingMMS:{
		color:"white",
		padding: "15px",
		margin:"10px",
		borderRadius: "10px 20px",
		display:"inline-block"
	},
	outgoing:{
		backgroundColor:"#ccc",
		color:"white",
		padding: "15px",
		margin:"10px",
		borderRadius: "10px 20px",
		display:"inline-block"
	},
	outgoingVCard:{
		borderRadius: "1000px",
		backgroundColor:"#ccc",
		color:"white",
		textAlign:"center",
		margin:"10px",
		height:"75px",
		width:"75px",
		lineHeight:"75px",
		display:"inline-block"
	},
	wrapper:{
		width:"100%",
		overflowY:"scroll"
	}
}

const getFormattedDate = (date) => {
	if(date){
		return moment(date).format("MMMM Do YYYY");
	}

	return "";
}

const getFormattedTime = (date) => {
	if(date){
		return moment(date).format("hh:mm:ss a");
	}
	return "";
}


const IncomingMMSBubble = (props) => {
	//console.log(props.message);
	return (
		<div className="clearfix">
			<li style={style.incomingMMS} className="">
				<img style={{maxWidth:"250px"}} src={props.message.message_media} />
			</li>
		</div>
	);
};

const IncomingMessageBubble = (props) => {
	//console.log(props.message);
	return (
		<div className="clearfix">
			<li style={style.incoming} className="">
			{props.message.message_text}
			</li>
		</div>
	);
};

const OutgoingMessageBubble = (props) => {
	//console.log(props.message);
	return (
		<div className="clearfix">
			<li style={style.outgoing} className="pull-right">
			{props.message.message_text}
			</li>
		</div>
	);
};

const OutgoingVCardBubble = (props) => {
	//console.log(props.message);
	return (
		<div className="clearfix" >
			<li style={style.outgoingVCard} className="pull-right">
			vCard
			</li>
		</div>
	);
};


export default class SMSConversation extends React.Component {
  

  constructor(props) {
    super(props);
    this.buildConversation = this.buildConversation.bind(this);

    this.state = {
    	height: window.innerHeight - 90 + "px",
    	interactions : props.interactions.reverse() || []
    };
  }

  componentWillMount() {
  	$(window).on('resize',debounce(100,false,this.resizeEvent));
  }

  componentWillUnmount() {
  	$(window).off('resize',debounce(100,false,this.resizeEvent));
  }

  resizeEvent=()=>{
  	this.setState({
  		height : window.innerHeight - 90 + "px"
  	});
  }

  componentDidUpdate() {
  	  let el = ReactDOM.findDOMNode(this.refs.wrapper);
	  el.scrollTop = el.scrollHeight;
  }


  buildConversation(interaction,x){
  	if(interaction.incoming_number){
  		if( interaction.message_media )
  			return(<IncomingMMSBubble key={x} message={interaction} />);
  		else
  			return(<IncomingMessageBubble key={x} message={interaction} />);
  	}
  	else if( interaction.outgoing_number && !interaction.message_text){
  		return(<OutgoingVCardBubble key={x} message={interaction} /> );
  	}
  	else 
  		return(<OutgoingMessageBubble key={x} message={interaction} /> );
  }

  componentWillReceiveProps(nextProps) {
  	this.setState({
  		interactions:nextProps.interactions
  	});
  }

  render() {

    return (
      <div ref="wrapper" className="sms-convo" 
      	style={_.extend(style.wrapper,{height:this.state.height})}>
      	<ul style={{padding:"0px",listStyleType:"none"}}>
      	{
      		(this.state.interactions.map(this.buildConversation)).reverse()
      	}
      	</ul>
      </div>
    );
  }

}

SMSConversation.propTypes = {
	interactions: React.PropTypes.array.isRequired,
};
