import React from 'react';
import DialPad from '../components/DialPad';
import {Page,Button} from 'react-onsenui';

export default class Dialer extends React.Component {
  static propTypes = {
    name: React.PropTypes.string,
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Page>
      	<DialPad />
      </Page>
    );
  }
}
