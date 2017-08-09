import React from 'react';
import Modal from 'react-bootstrap/lib/Modal';
import Button from 'react-bootstrap/lib/Button';


import Panel from 'react-bootstrap/lib/Panel';
import ListGroup from 'react-bootstrap/lib/ListGroup';
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem';


export default class ContactCardModal extends React.Component {
  
  constructor(props) {
    super(props);

    this.renderVcardList = this.renderVcardList.bind(this);
    this.onSelect = this.onSelect.bind(this);

  }

  renderVcardList(vcard,x){
    return(
      <ListGroupItem key={x} id={vcard.id} onClick={this.onSelect} >
        <div id={vcard.id}  style={{display:"inline-block"}}>{vcard.vcard_name}</div>
      </ListGroupItem>
    );
  } 

  onSelect(e){

  	let vCardID = e.target.id;

  	if(vCardID)
  		this.props.onSave(e,vCardID);

  }


  render() {
  	console.log(this.props);
    return (
      <Modal show={this.props.show} onHide={this.props.onClose}>          
	      <Modal.Header closeButton>
	        <Modal.Title>Select a Contact Card</Modal.Title>
	      </Modal.Header>

	      <Modal.Body>
	      	<Panel collapsible defaultExpanded > 
		      	<ListGroup fill>
	              {this.props.data.map(this.renderVcardList)}
	            </ListGroup>
	         </Panel>  
	      </Modal.Body>

	            
      </Modal>
    );
  }
}

ContactCardModal.propTypes = {
	show : React.PropTypes.bool.isRequired,
	onClose : React.PropTypes.func.isRequired,
	onSave : React.PropTypes.func.isRequired,
	data : React.PropTypes.array.isRequired
}
