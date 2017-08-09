import React from 'react';
import Modal from 'react-bootstrap/lib/Modal';
import Button from 'react-bootstrap/lib/Button'

import UserActions from '../actions/UserActions';

const BASEURL = "http://calucro-app.herokuapp.com/api/interactions/";

export default class ImageUploadModal extends React.Component {
  
  constructor(props) {
    super(props);
  }

  onFileSelect = () => {

    let files = this.refs.select.files;

    // Create a new FormData object.
    let formData = new FormData();

    // Loop through each of the selected files.
    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      // Check the file type.
      if (!file.type.match('image.*')) {
        continue;
      }
      // Add the file to the request.
      formData.append('avatar_image', file, file.name);
    }

    // TODO : Convert user passing to context
    UserActions.uploadUserAvatar(this.props.user,formData);
  }

  render() {

    return (
      <Modal show={this.props.show} onHide={this.props.onClose}>
          
        <Modal.Header closeButton>
          <Modal.Title>Attach an Image</Modal.Title>
        </Modal.Header>

        <Modal.Body>

          <div style={{position:"relative",width:"250px",height:"250px"}}>

            <img src={require('../assets/placeholder-image.png')} 
              style={{ position:"relative", width:"250px", height:"250px"}} />

            <input ref="select" 
                onChange={this.onFileSelect} 
                type="file" 
                id="file-select" 
                name="avatar_image" 
                style={{
                  zIndex: 99999,
                  position: "absolute",
                  left: "0px",
                  top: "0px",
                  outline: "none",
                  overflow: "hidden",
                  borderRadius: "9999px",
                  height: "100%",
                  width: "100%",
                  opacity: 0}} 
            />
          </div>

        </Modal.Body>
      </Modal>
    );
  }
}

ImageUploadModal.propTypes = {
	show : React.PropTypes.bool.isRequired,
	onClose : React.PropTypes.func.isRequired
}
