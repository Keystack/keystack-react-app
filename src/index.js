import React from 'react';
import ReactDOM from 'react-dom';
import WebContainer     from './WebContainer';
import CordovaContainer from './CordovaContainer';

const container = (window.location.host.indexOf("localhost") >= 0 ) 
	? (<WebContainer  />) 
	: (<CordovaContainer />);

ReactDOM.render(container,document.getElementById('app'))
