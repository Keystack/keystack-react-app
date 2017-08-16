import React from 'react';
import DialPad from '../components/DialPad';
import {Page,Button,Toolbar,ToolbarButton,Icon} from 'react-onsenui';

import NumbersStore from '../stores/NumbersStore'

export default class Dialer extends React.Component {
  static propTypes = {
    onMenuTap: React.PropTypes.func.isRequired,
    onPhoneSelectTap: React.PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
  }

  renderToolbar = () => {

    let leftButton= null , rightButton = null;
    let activeLine = NumbersStore.getActiveLine();

    leftButton = (
        <ToolbarButton  ripple modifier="material" onClick={this.props.onMenuTap}>
          <Icon icon='ion-android-menu'></Icon>
        </ToolbarButton>
    );

    if( activeLine ){
      rightButton = (
       <Button ripple modifier="quiet" onClick={this.props.onPhoneSelectTap}>
          <span style={{color:"white"}}>{activeLine.national_number}</span>
        </Button>
      );
    }

    return (
      <Toolbar modifier="material">
        <div className='left'>
          {leftButton}
        </div>
        <div className='center'>
          Calucro
        </div>
        <div className='right' style={{marginRight:"15px"}}>
          {rightButton}
        </div>
      </Toolbar>
    );
  }


  render() {
    return (
      <Page renderToolbar={this.renderToolbar}>
      	<DialPad />
      </Page>
    );
  }
}
