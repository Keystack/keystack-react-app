import React from 'react';
import {Ripple} from 'react-onsenui';


const DialRipple=()=>{
  return(
    <Ripple color="rgba(0,0,0,0.2)" background="rgba(0,0,0,0.2)" />
  );
}

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

    let value = (evt.target.value.replaceAll("[- \/\\^$+?.\\(\\)\\[\\]\\{\\}]",""));

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
  	let value = evt.target.id;

    switch(value){
      case "pound":
        value = "#";
      break;

      case "star":
        value = "*";
      break;
    }

    if( this.numberArray.length > 9 ){

      let num = this.numberArray.join("");
      let hasSpecialChar = (num.indexOf("*") > -1 || num.indexOf("#") > -1)


      console.log(num,hasSpecialChar)

      if((value.indexOf("*") ===  -1 && value.indexOf("#") === -1) && !hasSpecialChar)
        return;
    }

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
  	return (this.state.displayText.replaceAll("[- \/\\^$+?.\\(\\)\\[\\]\\{\\}a-z]",""))
	  		.replace(/^(\d{3})(\d)/, '($1) $2')
	  		.replace(/^(\(\d{3}\) \d{3})(\d)/, '$1-$2')
  }

  render() {

    let buttons = [
      <li key={"CALL"} className="call">
        <a href={(this.state.phoneNumber)?'tel:'+this.state.phoneNumber:'#'} disabled>
        <img style={{height:"48px"}} src={require('../assets/phone.png')} /> </a>
      </li>,
      // <li key={"CLEAR"}  onClick={this.onClear} className="clear">Clear</li>
    ];

    return (
      <div className="wrapper">
	      <div className="phone">
	        <div key={1} className="numberDisplay" style={{background:"#cecece"}}>
	          <input onChange={this.onInputChange} type='tel' value={this.prettyNumber()}/>
	        </div>
	        <div key={2} className="dialpad button-3" style={{marginTop:"10px"}}>
	          <ul onClick={this.onDialTap}>
	            <li key={1} id="1" className="first">1 <DialRipple  /></li>
	            <li key={2} id="2">2<DialRipple  /></li>
	            <li key={3} id="3" className="last">3<DialRipple /></li>
	            <li key={4} id="4"className="first">4<DialRipple /></li>
	            <li key={5} id="5">5<DialRipple /></li>
	            <li key={6} id="6"className="last">6<DialRipple /></li>
	            <li key={7} id="7"className="first">7<DialRipple /></li>
	            <li key={8} id="8">8<DialRipple /></li>
	            <li key={9} id="9" className="last">9<DialRipple /></li>
              <li key={"#"} id="pound" className="first">#<DialRipple /></li>
              <li key={0}  id="0" className="zero">0<DialRipple /></li>
              <li key={"*"} id="star" className="last">*<DialRipple /></li>
              {buttons}
	          </ul>
	        </div>
	      </div>
       </div>
    );
  }
}
