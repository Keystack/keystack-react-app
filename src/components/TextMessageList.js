import React from 'react';
import ListGroup from 'react-bootstrap/lib/ListGroup';
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem';
import {Link} from 'react-router-dom';

import BeatLoader from 'respinner/lib/BeatLoader';

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
	}
};

const beatLoaderInstance  = (
  <div style={{position:'absolute',top:"50%",left:"50%",marginLeft:"-68px",marginTop:"-20px"}}>
    <BeatLoader className="col-md-12" fill="#333" count={8} />
  </div>
);

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

	const UnreadItem = (leadObj)=> (

		<ListGroupItem  id={leadObj.data.id} className="unread" style={styles.listItemActive} onClick={this.props.onItemTap}>
			
				<div id={leadObj.data.id}>
					<div id={leadObj.data.id}>
						{(leadObj.data.outgoing_number && !leadObj.data.first_name)?leadObj.data.outgoing_number:leadObj.data.incoming_number}	
					</div>
					<div id={leadObj.data.id} >
					{(leadObj.data.first_name)?`${leadObj.data.first_name +" "+ leadObj.data.last_name}`:leadObj.data.formatted_phone}
					</div>
					<div id={leadObj.data.id} style={styles.message_text}>
					{leadObj.data.message_text}
					</div>			
				</div>
			
		</ListGroupItem>
	);

	const ActiveItem = (leadObj)=> (

		<ListGroupItem  id={leadObj.data.id} className="unread active" style={styles.listItemActive} onClick={this.props.onItemTap}>
			
				<div id={leadObj.data.id}>
					<div id={leadObj.data.id}>
						{(leadObj.data.outgoing_number && !leadObj.data.first_name)?leadObj.data.outgoing_number:leadObj.data.incoming_number}	
					</div>
					<div id={leadObj.data.id} >
					{(leadObj.data.first_name)?`${leadObj.data.first_name +" "+ leadObj.data.last_name}`:leadObj.data.formatted_phone}
					</div>
					<div id={leadObj.data.id} style={styles.message_text}>
					{leadObj.data.message_text}
					</div>
				</div>
			
		</ListGroupItem>
	);


  	let selected = (this.props.activeMessage === x)?true:false;

  	if( selected ){
  		return(
  			<ActiveItem data={item} key={x} />
  		);
  	}else if( item.unread ){
  		return(
  			<UnreadItem data={item} key={x} />
  		);
  	}else if( !item.unread ){
  		return(
  			<UnreadItem data={item}  key={x} />
  		);
  	}

  }

 
  render() {

  	let messageOverivew = this.props.data.map(this.buildMessagesList);
  	
  	if( this.props.loading ){
  		return(
  			<div style={_.extend(styles.leadList,{height:this.state.height})} className="lead-list layout-column flex">		
		  		{beatLoaderInstance}
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
	  		<ListGroup className="flex">	
		      <ListGroupItem id="blank" style={styles.listItem} onClick={this.props.onItemTap}>
				<div id="blank">
					<div id="blank" className="avatar pull-left" style={styles.listAvatarDefault}>$</div>
					<div id="blank" className="pull-right" style={{lineHeight:"60px",marginRight:"30px"}}>Get to work. No Leads yet!</div>
				</div>
			  </ListGroupItem>
		  	</ListGroup>
	  	</div>
	);
    
  }
}


TextMessageList.propTypes = {
	data: React.PropTypes.array.isRequired,
   	onItemTap: React.PropTypes.func.isRequired
};
