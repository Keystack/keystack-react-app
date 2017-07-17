import React from 'react';
import { Router , HashRouter } from 'react-router-dom';
import { hashHistory, Route, IndexRoute } from 'react-router';
import {requireAuth,routeSignUp} from  './utils/route-validations';
import { ThemeProvider } from 'react-css-themr';
import theme from './theme/themes';

import Main from './views/Main';


const App = () => (
  <div>
    <Main />
  </div>
);

export default class WebContainer extends React.Component {

  constructor(props, context){
    super(props);
  }

  componentDidMount(){
  }

  render() {

    return (
      <HashRouter >
        <ThemeProvider theme={theme} >
        <App />
        </ThemeProvider>
      </HashRouter>
    );
  }

}