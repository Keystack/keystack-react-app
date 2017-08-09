import React from 'react';
import { ActionSheet, ActionSheetButton} from 'react-onsenui';

import NumbersActions from '../actions/NumbersActions';
import NumbersStore from '../stores/NumbersStore';

export default class NumberSelectModule extends React.Component {
  static propTypes = {
    isOpen: React.PropTypes.bool.isRequired,
    onCancel: React.PropTypes.func,
    onSelect: React.PropTypes.func.isRequired
  };

  
  state = { numberSelectIsOpen:this.props.isOpen, numbers: [] }

  componentWillMount() {
  	NumbersStore.onChange(this.onNumbersChange);
  }

  componentDidMount() {
  	NumbersActions.get()
  }

  componentWillUnmount() {
  	NumbersStore.offChange(this.onNumbersChange);
  }

  onSelect=(evt)=>{

    let id = evt.target.id;
    let number = NumbersStore.getNumberById(id);

    NumbersActions.saveActiveLine(number);
    
    // Fire callback if its available
    if( this.props.onSelect )
      this.props.onSelect(number);

  }

  buildNumberList = (number,key) =>{
  	return(
  		<ActionSheetButton id={number.id} key={key} onClick={this.onSelect}>
        {number.name} - <strong id={number.id}>{number.national_number}</strong> 
      </ActionSheetButton>
  	);
  }

  // buildList = (numbers) => {
  // 	let numbersArr = [];

  // 	for(let i=0;i<numbers.length;i++){
  // 		numbersArr.push(
  // 			<ActionSheetButton 
  // 				key={i} 
  // 				onClick={this.handleCancel.bind(this)}>
  // 				{numbers[i].national_number}
  // 			</ActionSheetButton>
  // 		); 
  // 	}
  // 	return numbersArr;
  // }

  onNumbersChange = () =>{
  	let numbers = NumbersStore.getCalucroNumbers();

  	this.setState({
  		numbers : numbers
  	});
  }

  handleCancel = () =>{
    // this.setState({isOpen: false});
  }

  render() {

  	if( this.state.numbers.length ){
  		return (
	      <ActionSheet isOpen={this.props.isOpen} animation='default'
		      onCancel={this.props.onCancel || this.handleCancel }
		      isCancelable={true}
		      title={'<strong>Select a Calucro Number</strong>'}>
		    {this.state.numbers.map(this.buildNumberList)}<ActionSheetButton onClick={this.handleCancel.bind(this)} icon={'md-close'}>Cancel</ActionSheetButton>
	    </ActionSheet>
    	);
  	}else{
  		return(<div />);
  	}
  }
}
