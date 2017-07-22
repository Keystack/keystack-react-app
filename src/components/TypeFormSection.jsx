import React from 'react';
import {Motion, spring} from 'react-motion';

export default class TypeFormSection extends React.Component {
  static propTypes = {
   // active: React.PropTypes.bool.isRequired,
  }

  state = { active: this.props.active , completed: false,  opacity : 0 }

  getCurrentState = () => {

  	if( this.props.completed )
  		return {
  			top : -this.props.hideDistance,
  			opacity : 0.3
  		}

  	if( this.props.active  )
  		return {
  			top : 0,
  			opacity : 1
  		}

  	return {
		top : this.props.hideDistance,
		opacity : 0.3
	}
  }

  render() {

  	let state = this.getCurrentState();

    return (
 		<div style={{padding:"10px"}}>
	    	<Motion 
	    		defaultStyle={state} 
	    		style={{opacity: state.opacity, top: spring(state.top)}}>
			  { ( interpolatingStyle ) => 
			  	<section className={this.props.className} style={interpolatingStyle}>	      
			       {this.props.children}
			    </section>
				}
			</Motion>
		</div>
    );
  }
}
