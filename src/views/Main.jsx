import React from 'react';
import ons from 'onsenui';
import { Page, Button,Tabbar,Tab,Toolbar, ToolbarButton, Select, 
    Icon, Splitter, SplitterContent, SplitterSide, List} from 'react-onsenui';

import Dialer from './Dialer';
import TextOverview from './TextOverview';
import NumberSelectModule from '../components/NumberSelectModule';

import UserStore from '../stores/UserStore';
import LeadsStore from '../stores/LeadsStore';
import NumbersStore from '../stores/NumbersStore';

import UserActions from '../actions/UserActions';
import LeadsActions from '../actions/LeadsActions';
import NumbersActions from '../actions/NumbersActions';
import $ from 'jquery'


const MyTab = (props) => {
  return (
      <Page>
        <section style={{margin: '16px'}}>
          <p>
            {props.content}.
          </p>
        </section>
      </Page>
    );
};

export default class Main extends React.Component {
  
  state = { 
    index: 1,
    showPullOutMenu: false, 
    isOpen:false, 
    selectNumber:false, 
    activeLine: NumbersStore.getActiveLine() 
  }

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    NumbersStore.onChange(this.onNumberChange);
    $(window).on('resize',this.onResize);
  }

  componentDidMount() {
    // Fetch Required info from server
    LeadsActions.get();
    NumbersActions.get();

  }

  componentWillUnmount() {
    NumbersStore.offChange(this.onNumberChange);
    $(window).off('resize',this.onResize);
  }

  onResize=()=>{
    this.forceUpdate();
    console.log('resize')
  }

  onNumberChange=(evt)=>{

    let { data } = evt;
    let activeLine = data.activeLine;

    this.setState({
      activeLine : activeLine
    });

  }

  onSMSTap=(conversation)=>{

    console.log(conversation)

    if(conversation)
      this.props.history.push('conversation/'+conversation.lead_id);
  }

  onPhoneSelectTap=()=>{
    this.setState({
       selectNumber : !this.state.selectNumber
    });
  }

  onNumberSelect=(number)=>{
    this.hide();
  }

  onOverlayClose=()=>{
    this.hide();
  }

  onMenuTap=()=>{    
    this.setState({
       isOpen : !this.state.isOpen
    });
  }

  goBack=()=>{
     this.props.history.pop();
  }

  hide=()=>{
    this.setState({isOpen: false, selectNumber:false});
  }

  show=()=>{
    this.setState({isOpen: true});
  }


  renderToolbar = () => {
    const titles = ['Messages', 'Calucro','Calucro Settings'];

    let leftButton= null , rightButton = null;
    let activeLine = NumbersStore.getActiveLine();

    if( this.state.index > 0 ){       
        leftButton = (
            <ToolbarButton  ripple modifier="material" onClick={this.onMenuTap}>
              <Icon icon='ion-android-menu'></Icon>
            </ToolbarButton>
        );
    }

    if( activeLine )
      rightButton = (
       <Button ripple modifier="quiet" onClick={this.onPhoneSelectTap}>
          <span style={{color:"white"}}>{activeLine.national_number}</span>
        </Button>
      );

    return (
      <Toolbar modifier="material">
        <div className='left'>
          {leftButton}
        </div>
        <div className='center'>
          {titles[this.state.index]}
        </div>
        <div className='right' style={{marginRight:"15px"}}>
          {rightButton}
        </div>
      </Toolbar>
    );
  }

  renderTabs=()=>{
    return [
      {
        content: <TextOverview key={0}  onSMSTap={this.onSMSTap}  />,
        tab: <Tab key={0} label='Text' badge={1} icon='ion-android-textsms' />
      },
      {
        content: <Dialer key={1}/>,
        tab: <Tab key={1} label='Dial' icon='md-dialpad'/>
      },
      {
        content: <MyTab key={2}   content="Change the settings" />,
        tab: <Tab key={2} label='Settings' icon='ion-settings' />
      }
    ];
  }

  render() {

    console.log('Main.render()')

    const titles = ['Text', 'Dial','Settings'];

    return (
      <Splitter>   
        <SplitterSide
          style={{
              boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)'
          }}
          side='left'
          width={200}
          collapse={true}
          isSwipeable={true}
          isOpen={this.state.isOpen}
          onClose={this.onOverlayClose}>
          <Page>
          </Page>
        </SplitterSide>
        <SplitterContent>
          <Page modifier="material" renderToolbar={this.renderToolbar}>
            
            <NumberSelectModule 
              onSelect={this.onNumberSelect}
              isOpen={this.state.selectNumber} 
              onCancel={this.onOverlayClose} />

            <Tabbar
              modifier="material"
              position='bottom'
              active
              index={this.state.index}
              onPreChange={ (event) => {
                  if (event.index !== this.state.index) {
                    this.setState({index: event.index});
                  }
                }
              }
              renderTabs={this.renderTabs} />

          </Page>
        </SplitterContent>
      </Splitter>           
    );
  } 
};

Main.propTypes = {
  data : React.PropTypes.object,
  goBack : React.PropTypes.func
};
