import React from 'react';
import UserActions from '../actions/UserActions';


export default class AvatarUpload extends React.Component {
  
  constructor(props) {
  	super(props);

  	this.onFileSelect = this.onFileSelect.bind(this);

  }

  onFileSelect = () =>{

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

    UserActions.uploadUserAvatar(this.props.user,formData);	
  }

  render() {

  	let defaultAvatar = (<div className="inner" 
     	style={{
     		height:`${this.props.size}px`,
  			width:`${this.props.size}px`,
     		backgroundImage:`url(${require('../assets/keystack-dark-logo.jpg')})`
     	}}>
     </div>);

  	let avatar = (<div className="inner" 
     	style={{
     		height:`${this.props.size}px`,
  			width:`${this.props.size}px`,
     		backgroundImage: `url(${this.props.user.avatar_image})`
     	}}>
     </div>);

  	let avatarContent = (this.props.user.avatar_image) ? avatar : defaultAvatar;

  	return (
	    <div
          onMouseDown={this.props.onMouseDown||function(){return false;}}
          onTouchStart={this.props.onTouchStart||function(){return false;}}
          className='bubble-secondary' style={{
          	position:"relative",
          	margin:"10px auto",
          	height:`${this.props.size}px`,
          	width:`${this.props.size}px`
          }}> 
          <input ref="select" onChange={this.onFileSelect} type="file" id="file-select" name="avatar_image" 
          	style={{
      			zIndex:99999,
      			position:"absolute",
      			left:"0px",
      			top:"0px",
      			outline:"none",
      			overflow:"hidden",
      			borderRadius:"9999px",
      			height:`${this.props.size+8}px`,
      			width:`${this.props.size+8}px`,
      			opacity:0}} 
      		/>
          	
	        <img style={{zIndex:9999,position:"absolute",left:(this.props.size/2) - 10 + "px",bottom: "20px",height:"36px",opacity:0.5}} src={require('../assets/photo-camera.png')} />
	    	{avatarContent}
	    </div>
	 );
  }
} 


AvatarUpload.propTypes = {
	user : React.PropTypes.object.isRequired,
	size: React.PropTypes.number.isRequired,
	handleMouseDown : React.PropTypes.func,
	handleTouchStart : React.PropTypes.func,
	pressed : React.PropTypes.bool,
	visualPosition : React.PropTypes.number
};