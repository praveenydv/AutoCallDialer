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

class ResetPassword  extends React.Component {

  state = { 
    isSending: false,
    passwordSent:false,
    error:false,
    errormsg:false,
    passwordMatch:true,
    passwordLength:true
    

}




resetpassword = (e) => {
    e.preventDefault();

    if(e.target.password1.value!==e.target.password2.value){

        this.setState({passwordMatch:false})
        return;
      }
      this.setState({passwordMatch:true})
    if(e.target.password1.value.length<8){
      this.setState({passwordLength:false})
        return;
    }
    this.setState({passwordLength:true})

    
    this.setState({isSending:true})
  // console.log(e.target.password1.value,e.target.password2.value,this.props.match.params.uid,this.props.match.params.key)
  axios.post(`${HOST_URL}/api/auth/password/reset/confirm/`, {
    new_password1: e.target.password1.value,
    new_password2: e.target.password2.value,
    uid:this.props.match.params.uid,
    token:this.props.match.params.key
})
.then(res => {

    this.setState({passwordSent:true})

})
.catch(err => {
  this.setState({error:true})
  this.setState({errormsg:err.response.data})
});
  
  }

  
  handleHead=()=>{
    document.getElementById("favicon").href=Logo;
    document.title='CallDialer | ResetPassword';
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
                     Reset my Password
                  </span>
               {!this.state.error && !this.state.passwordSent && <form className="col s12" method="POST" onSubmit={this.resetpassword}>
                
               <div class="row">
        <div class="input-field col s12">
          <input id="password1"  name='password1' type="password" class="validate" required="required"/>
          <label for="password1">Password1</label>
        </div>
      </div>

      <div class="row">
        <div class="input-field col s12">
          <input id="password2"  name='password2' type="password" class="validate" required="required"/>
          <label for="password2">Password2</label>
        </div>
      </div>

               <div className="container-login100-form-btn p-t-10">
                 {    !this.state.isSending &&  <button className="login100-form-btn" type="submit">
                      Reset Password
                    </button>}
                    {this.state.isSending && <div  className="send-resetemail-btn"><Spin/></div>}


                  </div>

                </form> }

            { !this.state.passwordMatch && <p style={{'color':'red','fontSize':'20px','textAlign':'center'}}>Password are not same!</p> }
            { !this.state.passwordLength && <p style={{'color':'red','fontSize':'20px','textAlign':'center'}}>Password length is less than 8!</p> }
            { this.state.passwordSent && <p style={{'color':'#000000','fontSize':'20px','textAlign':'center'}}>Password has been changed with new password.</p>}
            { this.state.error && <p style={{'color':'red','fontSize':'20px','textAlign':'center'}}>Link is invalid or expired!</p>}

                  <div className="text-center w-full ">
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





export default ResetPassword;
