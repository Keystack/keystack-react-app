





import { Hackathon } from 'keystack-developer/conferences';
import { attendeeActions } from 'keystack/followers/actions';

export default class KeystackSummerHackathon extends Hackathon {

	state = {
		date : { month : 7,  dates : [ 21, 22, 23] , days : [5,6,7] },
		attendance : 56,
		location: '1722 Routh St, Dallas, TX 75201',
		venue : 'One Arts Plaza',
		inviteOnly: true,
		mentors : [			
			{ name:'Devery Channell', background:'Founder @ Keystack'}, 
			{ name:'Wesley Robinson', background:'Founder @ Keystack'},
			{ name:'Adam Root', background:'Venture Capitalist & Founder @ Root Ventures'},
			{ name:'Nicki Bylinda', background :'Export Yogi & Business Owner'},
			{ name:'Jake Morrow', background :'HR & Talent Acquisiton Specialist'}
			{ name:'Juan Leal', background :'Export Rails Engineer & Machine Learning Specialist'}
		],
		willAttend : this.props.willAttend

	}

	getDate = () => {
		return this.state.date;
	}

	render(){
		<OneArtsDallas>
			<Address />
				`${this.state.venue} ${this.state.location}`
			<Address />
		</OneArtsDallas>
	}
}

const event = <KeystackSummerHackathon willAttend={true}/>

attendeeActions.saveTheDate(event);

