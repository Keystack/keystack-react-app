import React from 'react';
import ReactDOM from 'react-dom';
import WebContainer     from './WebContainer';
import CordovaContainer from './CordovaContainer';

import { AppContainer } from 'react-hot-loader'

String.prototype.replaceAll = function (find, replace) {
    let str = this;
    return str.replace(new RegExp(find, 'g'), replace);
};

const render = Component =>{
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('app')
  );
} 

render(CordovaContainer);

if (module.hot) {
  module.hot.accept('./CordovaContainer', () => { render(CordovaContainer) })
}