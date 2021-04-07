import React from 'react';
import { Spin } from 'antd';
import { connect } from 'react-redux';
import * as authActions from '../store/actions/auth';
import * as navActions from '../store/actions/nav';
import { Redirect,withRouter } from 'react-router-dom';
import Logo from '../assets/logo/logo.png'


class Login  extends React.Component {

  state = { 
    loginForm: true,
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
componentDidMount(){
  // if(this.props.token!==null && this.props.username!==null){
  //     this.getUserChats(this.props.token,this.props.username)
  // }  
  this.props.onTryAutoSignup();
  this.props.setRegisterStatus()

  this.waitForAuthDetails()

}

// componentWillReceiveProps(newProps){
//         if(newProps.token!==null && newProps.username!==null){
//           this.props.onTryAutoSignup();
//         }

//     }

login = (e) => {
  e.preventDefault();
      this.props.login(
          e.target.email.value, 
          e.target.password.value
      );
  
  }

  handleHead=()=>{
    document.getElementById("favicon").href=Logo;
    document.title='CallDialer | Login';
}

  render() {

    if (this.props.isAuthenticated ){
      return <Redirect to="/phonebook"/>
}
      this.handleHead()
      return (
       






 
        <div>
            <div className="limiter">
            <div className="container-login100" style={{backgroundImage: 'url("../assets/login/images/img-01.jpg")'}}>
            <div className="wrap-login100 ">
              <div className="login100-form-avatar">

                <img src={Logo} alt=""/>

              </div>
                  <span className="login100-form-title p-t-20 p-b-45">
                     Let's Call
                  </span>
                  <div class="row">
         <form className="col s12"method="POST" onSubmit={this.login}>
       
         <div class="row">
        <div class="input-field col s12">
          <input id="email"  name='email' type="email" class="validate" required="required"/>
          <label for="email">Email</label>
        </div>
      </div>
      <div class="row">
        <div class="input-field col s12">
          <input id="password" name='password' type="password" class="validate" required="required"/>
          <label for="password">Password</label>
        </div>
      </div>
      <div className="container-login100-form-btn p-t-10">
                   {!this.props.loading && <button className="login100-form-btn" type="submit">
                      Login
                    </button>}

                    {   this.props.loading && <div  className="send-resetemail-btn"><Spin/></div>}
                  
                    {this.props.error && <p style={{'color':'red','fontSize':'20px','textAlign':'center'}}>Email or password is Incorrect!</p> }

                  </div>

                  <div className="text-center w-full ">
                    <a href="/forgot" className="txt1">
                      Forgot Username / Password?
                    </a>
                  </div>
                  <div className="text-center w-full set-position">
                    <a className="txt1" href="/register">
                      Create new account
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
        loading: state.auth.loading,
        token:state.auth.token,
        error:state.auth.error,

    }
}

const mapDispatchToProps = dispatch => {
    return {
        login: (email, password) => dispatch(authActions.authLogin(email, password)),
        logout: () => dispatch(authActions.logout()),
        addChat:()=>dispatch(navActions.openAddChatPopup()),
        // getUserChats:(username,token)=>dispatch(messageActions.getUserChats(username,token)),
        onTryAutoSignup: () => dispatch(authActions.authCheckState()),
        setRegisterStatus:()=>dispatch(authActions.registerAuthSuccess())
      }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));
