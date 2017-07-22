import React from 'react';
import Avatar from 'react-toolbox/lib/avatar';
import Chip from 'react-toolbox/lib/chip';
import PropTypes from 'prop-types';


const style ={
	small : {
		textTransform : 'uppercase',
		fontWeight: 'bold',
		margin: '0 5px'
	}
}

export default class Selectables extends React.Component {
  
  static propTypes = {
    data: PropTypes.array.isRequired,
    selected : PropTypes.array.isRequired,
    onTap: PropTypes.func.isRequired
  }

  isSelected = (item) => {
  	return ( _.find(this.props.selected,{id:item.id}) ) ? true : false
  }

  generateSelectables = (item,index) => {

  	let selected = this.isSelected(item);

  	//console.log(selected)

  	return (
	  	<Chip id={item.id} key={index} className={(selected)?'selected chip':'chip'}  onClick={this.props.onTap}>
	      <small id={item.id}  style={style.small}>{item.category}</small>
	      <span id={item.id}>{item.name}</span>
		</Chip>
	)
  }

  render() {
    return (
      <div>
      	{this.props.data.map(this.generateSelectables)}
      </div>
    )
  }

}