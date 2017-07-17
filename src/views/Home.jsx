import React from 'react';

export default class Home extends React.Component {
    
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div>
        <h1>Welcome, let's get started.</h1>
      </div>      
    );
  }
  
};

Home.propTypes = {
  data : React.PropTypes.object
};
