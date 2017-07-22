import React from 'react';
import ReactDOM from 'react-dom';
import {Button, IconButton} from 'react-toolbox/lib/button';

/**
 * Typeform component that renders each component of a form
 */
class typeForm extends React.Component {

  /**
   * constructor
   */
  constructor(props) {
    super(props);

    /**
     * Initial State
     */
    this.state = {
      current: 0,
    };

    /**
     * Styles
     */
    this.styles = {
      tfShow: {
        display: 'block',
      },
      tfHide: {
        //display: 'none',
      },
    };

    /**
     * Binding this to methods
     */
    this.incState = this.incState.bind(this);
    this.isLastComponent = this.isLastComponent.bind(this);
  }


  componentDidMount() {
    this.mounted = true;
  }

  componentWillReceiveProps(nextProps) {
    // console.log(nextProps);

    if(nextProps.current)
      this.setState({
        current : nextProps.current
      })
  }

  /**
   * Set className for component to show/hide
   */
  setClass(element, tfProps) {
    return React.cloneElement(element, tfProps);
  }

  /**
   * Get the current component to show on screen
   */
  getCurrentView(children) {
    let allChildren;
    let enterClass = (this.mounted)?'type-form-enter':'type-form-appear'; 

    allChildren = React.Children.map(children, (child, index) => {
      
      let currentChild = 
        this.setClass(child,{ 
            active : false ,
            hideDistance : window.innerHeight*3,
            completed: (index<this.state.current) ? true : false, 
            className:'typeform' 
        });

      if (index === this.state.current) {
        currentChild = 
          this.setClass(child, { 
            active : true,
            completed : (index<this.state.current) ? true : false, 
            hideDistance : window.innerHeight*3, 
            className:'typeform' 
          });
      }

      return currentChild;
    });
    
    /**
     * If all elements are shown then show a review screen
     */
    
    // if (this.isLastComponent()) {
    //   allChildren = React.Children.map(children, (child) =>
    //     (this.setClass(child, {active: true,hideDistance:window.innerHeight}))
    //   );
    // }
    return allChildren;
  }

  /**
   * Increment State counter
   */
  incState() {

    this.props.nextBtnOnClick();
    

    // if (this.props.children.length > this.state.current) {
    //   const current = this.state.current + 1;
    //   this.setState({
    //     current,
    //   });
    // }
  }

  /**
   * Check if last component
   */
  isLastComponent() {
    return this.props.children.length-1 === this.state.current;
  }

  queueTransition(){

  }

  /**
   * render the typeform
   */
  render() {

    let isLast = this.isLastComponent();
    let stepCount = parseInt(this.state.current) + 1;

    return (
      <div className={(isLast)?"type-form-container isLast step"+stepCount:"type-form-container step"+stepCount}> 
        <div style={{position:"relative",width:window.innerWidth,height:window.innerHeight}}>
          {this.getCurrentView(this.props.children)}
          {
          this.isLastComponent() ?
            <Button
              //icon='add'
              accent primary floating
              type="submit"
              onClick={this.props.onSubmit}
              className={this.props.submitBtnClass}
            >
              {this.props.submitBtnText}
            </Button> :
            <Button
              //icon='add'
              accent primary floating
              onClick={this.incState}
              className={this.props.nextBtnClass}>
              {this.props.nextBtnText}
            </Button>
        }
        </div>      
        
      </div>
    );
  }
}

/**
 * Validating propTypes
 */
typeForm.propTypes = {
  children: React.PropTypes.array.isRequired,
  onSubmit: React.PropTypes.func,
  submitBtnText: React.PropTypes.string,
  submitBtnClass: React.PropTypes.string,
  nextBtnText: React.PropTypes.string,
  nextBtnClass: React.PropTypes.string,
  nextBtnOnClick: React.PropTypes.func,
};

/**
 * Default Props
 */
typeForm.defaultProps = {
  nextBtnOnClick: () => {},
  onSubmit: () => {},
  submitBtnText: 'Save',
  nextBtnText: 'Next',
};

/**
 * export the typeform component
 */
export default typeForm;
