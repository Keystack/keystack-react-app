import React from 'react';
import ReactDOM from 'react-dom';
import WebContainer     from './WebContainer';
import CordovaContainer from './CordovaContainer';

import { AppContainer } from 'react-hot-loader'

// const container = (window.location.host.indexOf("localhost") >= 0 ) 
// 	? (<WebContainer  />) 
// 	: (<WebContainer />);

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