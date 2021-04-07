import React from 'react';
import { Spin, Icon } from 'antd';
import axios from 'axios'
import Logo from '../assets/logo/logo.png'
import { HOST_URL } from '../settings';
// import  '../assets/css/style.css'
// import  '../assets/css/main.css'
// import  '../assets/css/util.css'
// import  '../assets/fonts/font-awesome-4.7.0/css/font-awesome.min.css'

const antIcon=Spin;

class ForgotPassword  extends React.Component {

  state = { 
    isSending: false,
    emailSent:false
}




resetpassword = (e) => {
    this.setState({isSending:true})
  e.preventDefault();
  axios.post(`${HOST_URL}/api/auth/password/reset/`, {
    email: e.target.email.value,
})
.then(res => {

    this.setState({emailSent:true})

})
.catch(err => {
});
  
  }

  handleHead=()=>{
    document.getElementById("favicon").href=Logo;
    document.title='CallDialer | Forgot';
}

  render() {
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
                    Forgot Password
                  </span>
               {!this.state.emailSent && <form className="col s12"method="POST" onSubmit={this.resetpassword}>
                
      
       
       <div class="row">
      <div class="input-field col s12">
        <input id="email"  name='email' type="email" class="validate" required="required"/>
        <label for="email">Email</label>
      </div>
    </div>


               <div className="container-login100-form-btn p-t-10">
                 {    !this.state.isSending &&  <button className="login100-form-btn" type="submit">
                      Send Email
                    </button>}
                    
                    {   this.state.isSending && <div  className="send-resetemail-btn"><Spin/></div>}
               
                  </div>

                </form> }

            { this.state.emailSent && <p style={{'color':'#000000','fontSize':'20px','textAlign':'center'}}>If this email is registered then password reset link has been sent to the email.</p>}
      
                  <div className="text-center w-full">
                    <a href="/login" className="txt1">
                      Login </a>
                  </div>
                  <div className="text-center w-full set-position">
                    <a className="txt1" href="register">
                      Create new account
                      {/* <i className="fa fa-long-arrow-right" />						 */}
                    </a>
                  </div>
               
      </div>
            </div>
          </div>
        </div>
      );
    }
  }





export default ForgotPassword;
