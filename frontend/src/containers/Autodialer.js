import React from 'react';
import { connect } from 'react-redux';
import Contact from '../components/PhonebookContact';
import * as authActions from '../store/actions/auth';
import * as navActions from '../store/actions/nav';
import * as messageActions from '../store/actions/message';
import { withRouter ,Redirect} from 'react-router-dom';

import axios from 'axios'
import { HOST_URL } from "../settings";
import NavBar from './navbar'

class Autodialer extends React.Component {

constructor(props){
    super(props)
    this.state={
        phonebooks:[]
    }
    this.getPhonebookData(this.props.token)
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


makecall=(e)=>{
    e.preventDefault();
    axios.defaults.headers = {
         "Content-Type": "application/json",
         Authorization: `Token ${this.props.token}`
       };
     const data={
         'pb_id':e.target.phonebook.value,
         'text':e.target.calltext.value
             }
            console.log("data",data)
     
     axios.post(`${HOST_URL}/api/makecall/`,data)
             .then(res => {
                
                alert("The phonebook is successfully Called");

            })
             .catch(err => {
             });
 
         
 

}

render() { 

    if (!this.props.isAuthenticated ){
        return <Redirect to="/login"/>
  }
  
    const options=this.state.phonebooks.map(c=>{
        return(
            <option key={c.id} value={c.id}>{c.pbname}</option>


        )

    })         
        
        return (
            <div >
             <NavBar/>

                <form style={{'justifyContent':'center', 'width':'50%','margin':'auto'}} className="col s12" method="POST" onSubmit={(e) => {this.makecall(e);}}>
                
                    <div className="input-field col s12">
                    <select className="browser-default" name='phonebook' required='required'>
                    <option value="" disabled selected>Choose your Phonebook</option>
                        {options}
                    </select>
                    </div>
                    <p>Allowed variables : [first_name, last_name, city, phone_number]</p>
                    <div className="row"  style={{'width':'200%'}}>
                    <div className="input-field col s6">
                        <i className="material-icons prefix">mode_edit</i>
                        <textarea name='calltext' required='required' id="icon_prefix2" className="materialize-textarea" placeholder="Message"></textarea>
                    </div>
                    </div>
                    <button  type='submit' className="btn waves-effect waves-light" type="submit" name="action">MakeCall
                    <i className="material-icons right">send</i>
                    </button>
                
                </form>
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
        chats:state.message.chats,

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

export default connect(mapStateToProps, mapDispatchToProps)(Autodialer);

// export default withRouter(connect(mapStateToProps)(MyComponent))



// "devDependencies": {
//     "@babel/core": "^7.12.13",
//     "@babel/preset-react": "^7.12.13"
//   },