import React from 'react';

import Button from 'react-bootstrap/lib/Button';
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';

const styles = {
	saveBar : {
		padding:"10px",
		width:"100%",
		zIndex:9999,
		backgroundColor:"#ececec"
	}
};


export default class MessageToolBar extends React.Component {
 
  constructor(props) {
    super(props);

    this.state = {
    	dirty : props.dirty
    }
  }

  componentWillReceiveProps(nextProps) {
  	this.setState(nextProps);
  }

  render() {

    let saveContents = ( !this.state.dirty ) ? <Glyphicon glyph="check" /> : "SAVE";
    let {events} = this.props;

    console.log("events",events);

    return (
      <div style={styles.saveBar}>
		<ButtonToolbar>
			<Button 
		      	//onClick={events.onEditTap}
		      	style={{outline:"none"}} 
		      	className="pull-left">
    			<Glyphicon glyph="picture" /> 
    			<span style={{padding:"0 10px"}}>Add Image</span>
    		</Button>
			
			<Button 
		      	//onClick={events.onMessageTap}
		      	style={{outline:"none"}}
		      	className="pull-left">
    			<Glyphicon glyph="modal-window" />
    			<span style={{padding:"0 10px"}}>Attach vCard</span>
    		</Button>

	    </ButtonToolbar>
	  </div>
    );
  }
}

MessageToolBar.PropTypes = {
	events: React.PropTypes.object.isRequired
};
