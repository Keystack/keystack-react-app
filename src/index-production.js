require('onsenui/css/onsenui.css');
require('onsenui/css/onsen-css-components.css');
require('../wwwDev/onsen-css-components.css');

import React 	from 'react';
import ReactDOM from 'react-dom';
import ons 		from 'onsenui';

import CordovaContainer from './CordovaContainer';

String.prototype.replaceAll = function (find, replace) {
    let str = this;
    return str.replace(new RegExp(find, 'g'), replace);
};

// Select Platform
ons.platform.select('android')

// Uncomment this for Production
ReactDOM.render(<CordovaContainer />, document.getElementById('app'));

