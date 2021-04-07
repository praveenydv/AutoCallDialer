import React from 'react';
import { Spin, Icon } from 'antd';
import { connect } from 'react-redux';
import Contact from '../components/PhonebookContact';
import * as authActions from '../store/actions/auth';
import * as navActions from '../store/actions/nav';
import * as messageActions from '../store/actions/message';
import { Redirect } from 'react-router';
import Logo from '../assets/logo/logo.png'
// import  '../assets/css/style.css'
// import  '../assets/css/main.css'
// import  '../assets/css/util.css'
// import  '../assets/fonts/font-awesome-4.7.0/css/font-awesome.min.css'

const antIcon=Spin;
class Register  extends React.Component {


constructor(props){
  super(props);
  this.state={
    passwordMatch:true,
    passwordLength:true
  }
}

waitForAuthDetails(){
  const component =this;
  setTimeout(function(){
      if(
          component.props.token===null ||
          component.props.token===undefined 
      ){
        component.waitForAuthDetails();

          return;
      }
  },100)
}




authenticate = (e) => {
  e.preventDefault();
  if(e.target.password1.value!==e.target.password2.value){
    this.setState({passwordMatch:false})
    return;
  }
  if(e.target.password1.value.length<8){
    this.setState({passwordLength:false})
    return;

  }
  this.setState({passwordMatch:true})
  this.setState({passwordLength:true})

  this.props.signup(
                // e.target.username.value, 
                e.target.email.value, 
                e.target.password1.value, 
                e.target.password2.value,
                e.target.first_name.value,
                e.target.last_name.value,
                e.target.dob.value
            );
    
  
  }

  handleHead=()=>{
    document.getElementById("favicon").href=Logo;
    document.title='CallDialer | Register';
}

  render() {
    if (this.props.isAuthenticated ){
      return <Redirect to="/login"/>
}
if (this.props.registerstatus ){
  return <Redirect to="/login"/>
}
    this.handleHead();

      return (
        
        <div>
            <div className="limiter">
            <div className="container-login100" style={{backgroundImage: 'url("../assets/login/images/img-01.jpg")'}}>
            <div className="wrap-login100 ">
              <div className="login100-form-avatar">

                <img src={Logo} alt=""/>

              </div>
                  <span className="login100-form-title p-t-20 p-b-45">
                     Let's Start Calling
                  </span>
                  <div class="row">
                    
         <form className="col s12"method="POST" onSubmit={this.authenticate}>
       
      <div class="row">
        <div class="input-field col s6">
          <input id="first_name" name="first_name" type="text" class="validate" required="required"/>
          <label for="first_name">First Name</label>
        </div>
        <div class="input-field col s6">
          <input id="last_name" name="last_name"type="text" class="validate" required="required"/>
          <label for="last_name">Last Name</label>
        </div>
      </div>
      <div class="row">
        <div class="input-field col s12">
          <input id="email" name="email" type="email" class="validate" required="required"/>
          <label for="email">Email</label>
        </div>
      </div>
      <div class="row">
        <div class="input-field col s12">
          <input id="dob" name="dob" type="date" class="validate" required="required"/>
          <label for="dob">DOB</label>
        </div>
      </div>
      <div class="row">
        <div class="input-field col s12">
          <input id="password" name="password1" type="password" class="validate" required="required"/>
          <label for="password">Password</label>
        </div>
      </div>
      <div class="row">
        <div class="input-field col s12">
          <input id="password2" name="password2" type="password" class="validate" required="required"/>
          <label for="password2">Confirm Password</label>
        </div>
      </div>
      <div className="container-login100-form-btn p-t-10">
                   {!this.props.loading && <button className="login100-form-btn" type="submit">
                      Register
                    </button>}

                    { this.props.loading && <div  className="send-resetemail-btn"><Spin/></div>}
                  
                    {this.props.error !=undefined && <p style={{'color':'red','fontSize':'20px','textAlign':'center'}}>{JSON.stringify(this.props.error)}</p> }
                    { !this.state.passwordMatch && <p style={{'color':'red','fontSize':'20px','textAlign':'center'}}>Password are not same!</p> }
                    { !this.state.passwordLength && <p style={{'color':'red','fontSize':'20px','textAlign':'center'}}>Password length should be greater or equal to 8!</p> }

                  </div>

          
            <div className="text-center w-full set-position">
              <a className="txt1" href="/login">
                Login 
              </a>
            </div>
    </form>
  </div>
  </div> 
             </div>
         </div>
         </div> 
       
      );
    }
  }



  const mapStateToProps = state => {
 
    
    return {
      isAuthenticated: state.auth.token !== null && state.auth.token!==undefined,
      token:state.auth.token,
      error:state.auth.error,
      loading:state.auth.loading,
      registerstatus:state.auth.haveRegistered

    }
}

const mapDispatchToProps = dispatch => {
    return {
        signup: (email, password1, password2,first_name,last_name,dob) => dispatch(authActions.authSignup( email, password1, password2,first_name,last_name,dob)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Register);
