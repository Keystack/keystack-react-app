import React from 'react';
import ListGroup from 'react-bootstrap/lib/ListGroup';
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem';
import {Link} from 'react-router-dom';
import {ProgressCircular} from 'react-onsenui';

import ks from '../utils/keystack-utils';

import {throttle,debounce} from 'throttle-debounce';
import _ from "lodash";

const styles = {
	body : {
		background: "#ccc"
	},
	message_text : {
	    textOverflow: "ellipsis",
	    whiteSpace: "nowrap",
	    overflow: "hidden",
	},
	divider:{
		padding:"10px",
		background:"#ececec",
		fontWeight:"bold"
	},
	leadList :{
		borderLeft:"1px solid #ccc",
		borderRight:"1px solid #ccc",
		overflow:"scroll",
		position:"relative"
	},
	listItem:{
		width:"100%",
		height:"80px",
		maxHeight:"80px"
	},
	listItemActive:{
		height:"80px",
		maxHeight:"80px",
		backgroundColor: "#2c3e50 !important"
	},
	listAvatarDefault : {
		background:"#ccc",
		height:"60px",
		width:"60px",
		borderRadius:"100px",
		lineHeight:"60px",
		textAlign:"center",
		fontSize:"1.2em",
		color:"white"
	},
	progressBar : {
		margin:"0 auto", 
		paddingTop:"50%", 
		width:"50%", 
		height:"70px",
		textAlign:"center"
	}
};


const UnreadItem = (leadObj)=> {

	let number = 
		(leadObj.data.outgoing_number && !leadObj.data.first_name)
		? leadObj.data.outgoing_number 
		: leadObj.data.incoming_number;

	if( !number ) return <span />

	if ( number.length < 14)
		number = ks.unPrettyNumber(number);
		return(
		<ListGroupItem  id={leadObj.data.id} className="unread" style={styles.listItemActive} onClick={leadObj.onClick}>
			<div id={leadObj.data.id}>
				<div id={leadObj.data.id}> {number}</div>
				<div id={leadObj.data.id} >
				{(leadObj.data.first_name)?`${leadObj.data.first_name +" "+ leadObj.data.last_name}`:leadObj.data.formatted_phone}
				</div>
				<div id={leadObj.data.id} style={styles.message_text}>
				{leadObj.data.message_text}
				</div>			
			</div>		
		</ListGroupItem>
	)
};

const ActiveItem = (leadObj)=> {

	let number = 
		(leadObj.data.outgoing_number && !leadObj.data.first_name)
		? leadObj.data.outgoing_number 
		: leadObj.data.incoming_number;
	
	if( !number ) return <span />;

	if ( number.length < 14)
		number = ks.unPrettyNumber(number);

	return(
		<ListGroupItem  id={leadObj.data.id} className="unread active" style={styles.listItemActive} onClick={leadObj.onClick}>

			<div id={leadObj.data.id}>
				<div id={leadObj.data.id}>{number}</div>
				<div id={leadObj.data.id} >
				{(leadObj.data.first_name)?`${leadObj.data.first_name +" "+ leadObj.data.last_name}`:leadObj.data.formatted_phone}
				</div>
				<div id={leadObj.data.id} style={styles.message_text}>
				{leadObj.data.message_text}
				</div>
			</div>		
		</ListGroupItem>
	);	
};


export default class TextMessageList extends React.Component {

  constructor(props) {
    super(props);
    this.buildMessagesList = this.buildMessagesList.bind(this);
    this.getNewLeadCount = this.getNewLeadCount.bind(this);
    this.resizeEvent = this.resizeEvent.bind(this);

    this.state = {
    	height: window.innerHeight - 105 + "px",
    	throttledResize:debounce(100,false,this.resizeEvent)
    };
  }

  componentWillMount() {
  	$(window).on('resize',this.state.throttledResize);
  }

  componentWillUnmount() {
  	$(window).off('resize',this.state.throttledResize);
  }

  resizeEvent(){
      this.setState({
        height:window.innerHeight-105 + "px"
      });
  }

  getNewLeadCount(){

  	let count = 0;
  	if(this.props.data){
  		for (let i = this.props.data.length - 1; i >= 0; i--) {
  			if(this.props.data[i].interaction_count===1)
  				count++;
  		}
  	}
  	return count;
  }

  buildMessagesList(item,x){

  	if(item.interaction_count>1){
  		return null;
  	}

  	let selected = (this.props.activeMessage === x)?true:false;

  	if( selected ){
  		return(
  			<ActiveItem data={item} key={x} onClick={this.props.onItemTap}/>
  		);
  	}else if( item.unread ){
  		return(
  			<UnreadItem data={item} key={x} onClick={this.props.onItemTap} />
  		);
  	}else if( !item.unread ){
  		return(
  			<UnreadItem data={item}  key={x} onClick={this.props.onItemTap} />
  		);
  	}

  }

 
  render() {

  	let messageOverivew = this.props.data.map(this.buildMessagesList);
  	
  	if( this.props.loading ){
  		return(
  			<div style={styles.progressBar}>
  				<ProgressCircular indeterminate  />
  			</div>
		);
  	}

  	if( this.props.data.length ){
  		return (
	      <div style={_.extend(styles.leadList,{height:this.state.height})} className="lead-list layout-column flex">		
	  		<ListGroup className="flex">
		  		{messageOverivew}
	  		</ListGroup>
		  </div>
	    );
  	}

  	return (
  		<div style={_.extend(styles.leadList,{height:this.state.height})} className="lead-list layout-column flex">
	  		<h1 style={{color:"#999",lineHeight:this.state.height,textAlign:"center"}}>No Messages</h1>
	  	</div>
	);
    
  }
}


TextMessageList.propTypes = {
	data: React.PropTypes.array.isRequired,
   	onItemTap: React.PropTypes.func.isRequired
};
