require('onsenui/css/onsenui.css');
require('onsenui/css/onsen-css-components.css');
require('../wwwDev/onsen-css-components.css');

import React 	from 'react';
import ReactDOM from 'react-dom';
import ons 		from 'onsenui';

import KeystackUtils 	from './utils/keystack-utils';
import CordovaContainer from './CordovaContainer';
import WebContainer 	from './WebContainer';

String.prototype.replaceAll = function (find, replace) {
    let str = this;
    return str.replace(new RegExp(find, 'g'), replace);
};

// Select Platform
ons.platform.select('android')

const render = Component =>{
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('app') 
  );
}

render(WebContainer);

if (module.hot) {
  module.hot.accept('./WebContainer', () => { render(WebContainer) })
}

// Uncomment this for Production
// ReactDOM.render(<CordovaContainer />, document.getElementById('app'));

