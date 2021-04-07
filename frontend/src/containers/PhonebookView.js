import React from 'react';
import { connect } from 'react-redux';
import Phonebook from '../components/Phonebook';
import * as authActions from '../store/actions/auth';
import * as navActions from '../store/actions/nav';
import * as messageActions from '../store/actions/message';
import { withRouter ,Redirect} from 'react-router-dom';
import PhonebookCreateDialog from './dialogs/phonebookCreate'
import axios from 'axios'
import { HOST_URL } from "../settings";
import NavBar from './navbar'
import update from 'react-addons-update';

class PhonebookView extends React.Component {

    constructor(props){
    super(props)
    this.getPhonebookData(this.props.token)

    this.state={
        phonebooks:[],
        phonebookCreateDialogVisiblity:false,
      }



    }
                
 
    

getPhonebookData=(token)=>{
       axios.defaults.headers = {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`
          };
        axios.get(`${HOST_URL}/api/phonebook/`)
                .then(res => {
                    this.setState({phonebooks:res.data})
    
               })
                .catch(err => {
                });
    
            
    }






    createPhonebook=(id)=>{
        this.setState({phonebookCreateDialogVisiblity:true})

    }


    onphonebookCreateDialogClose=()=>{
        this.setState({phonebookCreateDialogVisiblity:false})

    }
    onPhonebookCreateFormSubmit=(e)=>{
        console.log('form submitted',this.props.id)
        e.preventDefault();
        console.log(e.target.pbname.value)
            
            
                const config = {
                    headers: {
                          'content-type': 'application/json',
                            Authorization: `Token ${this.props.token}`
            
                    }
                };
               const  data={
                    'pbname':e.target.pbname.value
                }
                axios.post(`${HOST_URL}/api/phonebook/create/`,data,config)
                    .then((res) => {
                        this.setState({phonebooks:[...this.state.phonebooks,res.data]})
                        alert("The phonebook is successfully Created");
                    }).catch((error) => {
                        console.log(error)
                });
            }
  

phonebookDeleted=(id)=>{
    this.setState(prevState => ({
        phonebooks: prevState.phonebooks.filter(el => el.id != id )
    }));

            }
phonebookUpdated=(data)=>{
    // console.log(data)
    const idx = this.state.phonebooks.findIndex(x => x.id ===data.id);
    this.setState(update(this.state, {
        phonebooks: {
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
            const phonebooks=this.state.phonebooks.map(c=>{
                return (
                    <Phonebook
                    key={c.id}
                    name={c.pbname}
                    toURL={`/phonebook/${c.id}`}
                    id={c.id}
                    phonebookDeleted={this.phonebookDeleted}
                    phonebookUpdated={this.phonebookUpdated}/>
                )
                    
            })
        
        return (
           <div>
               <NavBar/>
        <PhonebookCreateDialog
                 visiblity={this.state.phonebookCreateDialogVisiblity}
                 onClose={this.onphonebookCreateDialogClose}
                 onSubmit={this.onPhonebookCreateFormSubmit}
                />
            
            
            <div className='phonebookAddbutton'>

                <button className="waves-effect waves-light btn"
                 onClick={()=>this.createPhonebook()}>
                     Create New Phonebook</button>
                </div>


            <div className='phonebooks' style={{'width':'100%','height':'100px'}}>
                {phonebooks}
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

export default connect(mapStateToProps, mapDispatchToProps)(PhonebookView);
