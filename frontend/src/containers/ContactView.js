import React from 'react';
import { connect } from 'react-redux';
import Contact from '../components/Contact';
import CallRecord from '../components/CallRecord';
import * as authActions from '../store/actions/auth';
import * as navActions from '../store/actions/nav';
import * as messageActions from '../store/actions/message';
import { withRouter ,Redirect} from 'react-router-dom';
import ContactCreateDialog from './dialogs/contactCreate'
import axios from 'axios'
import { HOST_URL } from "../settings";
import NavBar from './navbar'
import update from 'react-addons-update';

class ContactView extends React.Component {

    constructor(props){
    super(props)
    this.getContactsData(this.props.token)
    this.getCallRecordssData(this.props.token)

    this.state={
        contacts:[],
        callrecords:[],
        contactCreateDialogVisiblity:false
 
      }


}

getContactsData=(token)=>{
       axios.defaults.headers = {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`
          };

        
        axios.get(`${HOST_URL}/api/contact/`)
                .then(res => {
                    this.setState({contacts:res.data})
    
               })
                .catch(err => {
                });
    
            
    }

    getCallRecordssData=(token)=>{
        axios.defaults.headers = {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`
          };

        
        axios.get(`${HOST_URL}/api/callrecord/`)
                .then(res => {
                    this.setState({callrecords:res.data})
    
               })
                .catch(err => {
                });
    
    }




    createnewContact=(id)=>{
        this.setState({contactCreateDialogVisiblity:true})

    }


    onContactCreateDialogClose=()=>{
        this.setState({contactCreateDialogVisiblity:false})

    }
    onContactCreateFormSubmit=(e)=>{
        console.log('form submitted',this.props.id)
        e.preventDefault();
            
            
        const config = {
            headers: {
                  'content-type': 'application/json',
                    Authorization: `Token ${this.props.token}`
    
            }
        };
       const  data={
        'fname':e.target.fname.value,
        'lname':e.target.lname.value,
        'city':e.target.city.value,
        'pnumber':e.target.pnumber.value
    }
        axios.post(`${HOST_URL}/api/contact/create/`,data,config)
            .then((res) => {
                this.setState({contacts:[...this.state.contacts,res.data]})

                alert("The contact is successfully created");
            }).catch((error) => {
                console.log(error)
        });
    }

contactDeleted=(id)=>{
        this.setState(prevState => ({
            contacts: prevState.contacts.filter(el => el.id != id )
        }));
    }
                 
contactUpdated=(data)=>{
    const idx = this.state.contacts.findIndex(x => x.id ===data.id);
    this.setState(update(this.state, {
        contacts: {
            [idx]: {
                $set: data
            }
        }
    
            }));
    
}


render() {  
    if (!this.props.isAuthenticated ){
        return <Redirect to="/login"/>
  }
            const contacts=this.state.contacts.map(c=>{
                return (
                    <Contact
                    key={c.id}
                    fname={c.fname}
                    lname={c.lname}
                    city={c.city}
                    pnumber={c.pnumber}
                    id={c.id}
                    pb_id={this.props.match.params.pb_id}
                    contactDeleted={this.contactDeleted}
                    contactUpdated={this.contactUpdated}
                    />
                )
                    
            })

            const callrecords=this.state.callrecords.map(c=>{
                return (
                    <CallRecord
                    key={c.id}
                    contact={c.contact}
                    callstarttime={c.callstarttime}
                    callduration={c.callduration}
                    callcost={c.callcost}
                    callstatus={c.callstatus}
                    />
                )
                    
            })
        
        return (
           <div>
               <NavBar/>

        <ContactCreateDialog
                 visiblity={this.state.contactCreateDialogVisiblity}
                 onClose={this.onContactCreateDialogClose}
                 onSubmit={this.onContactCreateFormSubmit}
                />



                <div className='contactListView'>
                    <div style={{'overflowY': 'scroll'}} className='contactContainer'>
                    
                        <div className='contactTitle' >

                            <button className="waves-effect waves-light btn" onClick={()=>this.createnewContact()}>Add new Contact</button>
                        </div>

                        <div className='phonebooks' style={{'width':'100%','height':'100px'}}>
                            {contacts}
                        </div>
                    </div>
                    <div style={{'overflowY': 'scroll'}} className='contactContainer'>
                            <div className='contactTitle'>
                            <p> Callrecords</p>
                            </div>
                            <div className='phonebooks' style={{'width':'100%','height':'100px'}}>
                                  {callrecords}
                             </div>
                    </div>
                </div>
            </div>  

           
        )
    };
}

const mapStateToProps = state => {    
    return {
        isAuthenticated: state.auth.token !== null,
        loading: state.auth.loading,
        token:state.auth.token,
        username:state.auth.username,
        loggedInUser:state.auth.loggedInUser,

    }
}

const mapDispatchToProps = dispatch => {
    return {
        getUserChats:(username,token)=>dispatch(messageActions.getUserChats(username,token)),
        setLoggedInUser:(user)=>dispatch(authActions.setLoggedInUser(user)),
        login: (userName, password) => dispatch(authActions.authLogin(userName, password)),
        logout: () => dispatch(authActions.logout()),
        signup: (username, email, password1, password2) => dispatch(authActions.authSignup(username, email, password1, password2)),
        addChat:()=>dispatch(navActions.openAddChatPopup()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ContactView);

