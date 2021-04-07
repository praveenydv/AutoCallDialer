import React from 'react';
import { connect } from 'react-redux';
import Phonebook from '../components/Phonebook';
import * as authActions from '../store/actions/auth';
import * as navActions from '../store/actions/nav';
import * as messageActions from '../store/actions/message';
import { withRouter ,Redirect, NavLink} from 'react-router-dom';
import PhonebookCreateDialog from './dialogs/phonebookCreate'
import axios from 'axios'
import { HOST_URL } from "../settings";
import Logo from '../assets/logo/logo.png'

class NavBar extends React.Component {

    constructor(props){
    super(props)

}
            





logout=()=>{
    this.props.logout()
}

handleHead=()=>{
    document.getElementById("favicon").href=Logo;
    document.title='CallDialer';
}


render() {  
        this.handleHead()
   
        return (
           <div >

            <nav>

                <div className="nav-wrapper">
                <a href="/" className="brand-logo right">CallDialer</a>

                <ul id="nav-mobile" className="left hide-on-med-and-down">
                    <li><NavLink to="/phonebook">Phonebooks</NavLink></li>
                    <li><NavLink to="/autodialer">Make Calls</NavLink></li>
                    <li><NavLink to="/contacts">Contacts</NavLink></li>
                    <li><NavLink to="/contacts">Callrecords</NavLink></li>
                    <li><NavLink to="">  <span onClick={this.logout}>Logout</span></NavLink></li>
                </ul>
                </div>
            </nav>

            

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

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
