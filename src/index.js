require('onsenui/css/onsenui.css');
require('onsenui/css/onsen-css-components.css');

import React from 'react';
import ReactDOM from 'react-dom';
import ons from 'onsenui';

import CordovaContainer from './CordovaContainer';

// import { AppContainer } from 'react-hot-loader'
import WebContainer from './WebContainer';

String.prototype.replaceAll = function (find, replace) {
    let str = this;
    return str.replace(new RegExp(find, 'g'), replace);
};

ons.platform.select('android');
ReactDOM.render(<CordovaContainer />, document.getElementById('app'));

// const render = Component =>{
//   ReactDOM.render(
//     <AppContainer>
//       <Component />
//     </AppContainer>,
//     document.getElementById('app') 
//   );
// } 

// render(WebContainer);

// if (module.hot) {
//   module.hot.accept('./WebContainer', () => { render(WebContainer) })
// }

