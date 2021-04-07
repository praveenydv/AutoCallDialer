import React from 'react';
import { connect } from 'react-redux';
import PhonebookContact from '../components/PhonebookContact';
import * as authActions from '../store/actions/auth';
import * as navActions from '../store/actions/nav';
import * as messageActions from '../store/actions/message';
import { withRouter ,Redirect} from 'react-router-dom';
import ContactCreateDialog from './dialogs/contactCreate'
import axios from 'axios'
import { HOST_URL } from "../settings";
import NavBar from './navbar'
import M from "materialize-css";
import update from 'react-addons-update';

class PhonebookContactView extends React.Component {

    constructor(props){
    super(props)
    this.state={
        phonebookContacts:[],
        contacts:[],
        contactCreateDialogVisiblity:false,
        isLoading:true
 
      }


    //   this.checkAuthentication();
    }
                
    
    
    
    // checkAuthentication() {
    //     if(this.props.isAuthenticated){
    //         setTimeout(
    //             () => this.setState( {
    //               isLoading: false,
    //             } ),
    //             0
    //           );
    //     }
    //     else{
    //     setTimeout(
    //       () => this.setState( {
    //         isLoading: false,
    //       } ),
    //       500
    //     );
    //     }
    //   }
    

componentDidMount() {
    // Auto initialize all the things!
    M.AutoInit();
    this.getPhonebookContactsData(this.props.token,this.props.match.params.pb_id)
    this.getAllContacts(this.props.token)
}

getAllContacts=(token)=>{
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

getPhonebookContactsData=(token,id)=>{
       axios.defaults.headers = {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`
          };
        const data={
            'pb_id':id
        }
        
        axios.get(`${HOST_URL}/api/phonebook/${id}/contact/`,{
            data
        })
                .then(res => {
                    this.setState({phonebookContacts:res.data})
    
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
        'pb_id':this.props.match.params.pb_id,
        'fname':e.target.fname.value,
        'lname':e.target.lname.value,
        'city':e.target.city.value,
        'pnumber':e.target.pnumber.value
    }
        axios.post(`${HOST_URL}/api/phonebook/contact/create/`,data,config)
            .then((res) => {
                this.setState({phonebookContacts:[...this.state.phonebookContacts,res.data]})

                alert("The contact is successfully created");
            }).catch((error) => {
                console.log(error)
        });
    }
  
    addExistingContact=(e)=>{
        e.preventDefault()
        console.log("values",e.target.contacts.value)

        const config = {
            headers: {
                  'content-type': 'application/json',
                    Authorization: `Token ${this.props.token}`
    
            }
        };
		const data={
			contacts:[e.target.contacts.value]
		}

        axios.patch(`${HOST_URL}/api/phonebook/${this.props.match.params.pb_id}/contact/add/`,data,config)
            .then((res) => {

                alert("The contact is successfully added");
            }).catch((error) => {
                console.log(error)
        });

    }       
    
phonebookContactDeleted=(id)=>{
        console.log('phonebook deleted',id)
        this.setState(prevState => ({
            phonebookContacts: prevState.phonebookContacts.filter(el => el.id != id )
        }));
    }

phonebookContactUpdated=(data)=>{
    const idx = this.state.phonebookContacts.findIndex(x => x.id ===data.id);
    this.setState(update(this.state, {
        phonebookContacts: {
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
            const phonebookContacts=this.state.phonebookContacts.map(c=>{
                return (
                    <PhonebookContact
                    key={c.id}
                    fname={c.fname}
                    lname={c.lname}
                    city={c.city}
                    pnumber={c.pnumber}
                    id={c.id}
                    pb_id={this.props.match.params.pb_id}
                    phonebookContactDeleted={this.phonebookContactDeleted}
                    phonebookContactUpdated={this.phonebookContactUpdated}
                    />
                )
                    
            })
            // console.log(this.state.contacts)
            const contacts=this.state.contacts.map(c=>{
                
                return (
                    <option key={c.id} value={c.id}>{c.fname} {c.lname}, {c.pnumber}</option>
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



                <div className='contactAddbutton'>
                    <div >
                        <button className="waves-effect waves-light btn"
                        onClick={()=>this.createnewContact()}>
                            Add new Contact</button>
                     </div>
                     <div style={{'padding':'0px'}}>
                     <form method="POST" onSubmit={(e) => {this.addExistingContact(e);}}>
                        <div  style={{'height':'41px','float':'left','width':'80%','marginTop':'0px','paddingLeft':'10px'}} className="input-field col s12">
                            <select   name='contacts' className="browser-default" required='required'>
                                <option value="" disabled selected>Select Contact</option>
                                 {contacts}
                            </select>
                            
                        </div>
                        <div style={{'float':'right','margin':'10px'}}>
                            <button type='submit'  className="waves-effect waves-light btn">
                                    Add </button>
                        </div>
                        </form>
                     </div>
                </div>

                <div className='phonebooks' style={{'width':'100%','height':'100px'}}>
                     {phonebookContacts}
                 </div>
           </div>
           
        )
    };
}

const mapStateToProps = state => {    
    return {
        isAuthenticated: state.auth.token !== null && state.auth.token !== undefined,
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

export default connect(mapStateToProps, mapDispatchToProps)(PhonebookContactView);