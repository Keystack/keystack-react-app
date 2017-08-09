import React from 'react';


export default class DialPad extends React.Component {

  state = { displayText :"", phoneNumber: "" }

  numberArray = []

  clearPhoneNumber = () =>{
    this.setState({
    	displayText : "",
    	phoneNumber: "",
    });
  }

  callNumber = () => {
    this.setState({
    	displayText : "Calling...",
    	phoneNumber: "",
    });

    this.activateInCallInterface();
    // Need timer interval to animate . . .
    // Trigger  "Hangup"
    // Trigger  "Call timer"
  }

  // holdNumber = () =>{
  //   window.numberDisplayEl.val('On Hold.');
  //   changeHoldIntoUnhold();
  // }

  // changeHoldIntoUnhold = () => {
  //   window.skipButton.html('Unhold');
  //   window.skipButton.addClass('ready');
  // };

  // changeUnholdIntoHold = () => {
  //   window.skipButton.html('Hold');
  // };

  activateInCallInterface = () =>{
    // changeClearIntoHangUp();
    // changeSkipIntoHold();
    // disableCallButton();
    // disableDialButton();
    // removeReadyFromCall();
    // enableReadOnlyInput();
    this.setState({inCallModeActive: true});
  }

  disableInCallInterface = () =>{
    // removeReadOnlyInput();
    // enableCallButton();
    // changeHoldIntoSkip();
    this.setState({inCallModeActive: false});
  }

  disableCallButton = () => {
    this.setState({
    	callButtonState:'deactive'
    });
  }

  enableCallButton = () =>{
    this.setState({
    	callButtonState:''
    })
  }

  enableDialButton =() =>{
    this.setState({
    	dialPadState:''
    });
  }

  disableDialButton= ()=>{
	this.setState({
		dialPadState:'disabled'
	});
  }

  changeClearIntoHangUp = () =>{
    this.setState({
    	clearBtnText:'Hang Up',
    	clearBtnState: 'hangup'
    });
  }

  changeHangUpIntoClear = () => {
    this.setState({
    	clearBtnText:'Clear',
    	clearBtnState: ''
    });
  }

  enableReadOnlyInput = ()=>{
    this.setState({
    	readOnlyDisplay:true
    })
  }

  removeReadOnlyInput = () =>{
    this.setState({
    	readOnlyDisplay:false
    });
  }

  refreshInputArray = () => {
    let numberArray = this.state.displayText.split('');

    this.setState({
    	numberArray:numberArray
    });

  }

  compilePhoneNumber = () => {
    return this.numberArray.join('');
}

onInputChange = (evt) =>{

	if (evt.target.value.length > 14) {
		console.log('too many digits')
      return;
    }

    let value = (evt.target.value.replaceAll("[- \/\\^$*+?.\\(\\)\\[\\]\\{\\}]",""));

    console.log(value);

    this.numberArray = value.split("");

    this.setState({
    	phoneNumber : value,
    	displayText : value	
    })

}

onClear = () =>{

	this.numberArray = [];

	this.setState({
		phoneNumber : "",
		displayText : "" // Make it pretty here 
	});
}

onCall = () =>{

}

onDialTap  = (evt) => {
  	let value = evt.target.innerHTML;

  	if( this.numberArray.length > 9)
  		return;

  	this.numberArray.push(value);

  	if( this.state.dialPadState !== 'deactive'){
  		
  		// Add number validations here.
  		this.setState({
  			phoneNumber : this.compilePhoneNumber(),
  			displayText : this.compilePhoneNumber() // Make it pretty here 
  		});
  	}
  }

  prettyNumber = () =>{
  	return (this.state.displayText.replaceAll("[- \/\\^$*+?.\\(\\)\\[\\]\\{\\}a-z]",""))
	  		.replace(/^(\d{3})(\d)/, '($1) $2')
	  		.replace(/^(\(\d{3}\) \d{3})(\d)/, '$1-$2')
  }

  render() {

    return (
      <div className="wrapper">
	      <div className="phone">
	        <div key={1} className="numberDisplay" style={{marginTop:"20px"}}>
	          <input onChange={this.onInputChange} type='tel' value={this.prettyNumber()}/>
	        </div>
	        <div key={2} className="dialpad button-3" style={{marginTop:"20px"}}>
	          <ul onClick={this.onDialTap}>
	            <li key={1} className="first">1</li>
	            <li key={2}>2</li>
	            <li key={3} className="last">3</li>
	            <li key={4} className="first">4</li>
	            <li key={5}>5</li>
	            <li key={6} className="last">6</li>
	            <li key={7} className="first">7</li>
	            <li key={8}>8</li>
	            <li key={9} className="last">9</li>
	          </ul>
	        </div>
	        <div key={3} className="actions button-3 deactive">
	          <ul>
	            <li key={0} className="call">
	            	<a href={(this.state.phoneNumber)?'tel:'+this.state.phoneNumber:'#'} disabled>Call</a>
	            </li>
	            <li key={1} href="" className="zero">0</li>
	            <li key={2} href="" onClick={this.onClear} className="clear">Clear</li>
	          </ul>
	        </div>
	      </div>
       </div>
    );
  }
}
