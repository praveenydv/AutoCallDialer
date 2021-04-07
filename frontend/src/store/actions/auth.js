import axios from 'axios';
import { HOST_URL } from '../../settings';
import * as actionTypes from './actionTypes';
import Cookie from "js-cookie"
import CryptoJS from 'crypto-js'
import { Redirect, useHistory } from "react-router-dom";


export const setLoggedInUser=(user)=>{
    return{
        type:actionTypes.SET_LOGGEDIN_USER,
        user:user
    }
}
export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    }
}

export const authSuccess = (username, token) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        token: token,
        username: username
    }
}

export const authFail = error => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    }
}

export const registerAuthSuccess=()=>{
   return {
       type:actionTypes.REGISTER_AUTH_SUCCESS
}
}

export const logout = () => {
 
   axios.post(`${HOST_URL}/api/auth/logout/`)
   .then(res => {
    localStorage.clear()
    var allCookies = document.cookie.split(';'); 

   for (var i = 0; i < allCookies.length; i++){
        document.cookie = allCookies[i] +"=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
   }

  })
   .catch(err => {
   });



    return {
        type: actionTypes.AUTH_LOGOUT
    };
}

export const checkAuthTimeout = expirationTime => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout());
        }, expirationTime * 1000)
    }
}

function getuserData(email,token){
    return dispatch =>{ axios.defaults.headers = {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`
      };
    axios.get(`${HOST_URL}/api/users/?email=${email}`)
            .then(res => {
                dispatch(authSuccess(res.data[0].username, token));
                localStorage.setItem('username', res.data[0].username);

           })
            .catch(err => {
                // console.log(err)
                dispatch(authFail(err));
            });

        }
}

export const authLogin = (username, password) => {
        return dispatch => {
            dispatch(authStart());
            axios.post(`${HOST_URL}/api/auth/login/`, {
                email: username,
                password: password
            })
            .then(res => {
                const token = res.data.key;

                var ciphertoken = CryptoJS.AES.encrypt(JSON.stringify(token), 'fdaGj578JHh7Hmdf?d&%sdf?ds7').toString();
                Cookie.set("u_at", ciphertoken);
                Cookie.set("u_id", res.data.username);

                dispatch(authSuccess(res.data.username, token));
                dispatch(checkAuthTimeout(3600));                
            })
            .catch(err => {
                dispatch(authFail(err));
            });
        };
};

export const authSignup = ( email, password1, password2,first_name,last_name,dob) => {
    return dispatch => {
        dispatch(authStart());
        
        axios.post(`${HOST_URL}/api/auth/registration/`, {
            first_name: first_name,
            last_name: last_name,
            dob: dob,
            email: email,
            password1: password1,
            password2: password2
        })
        .then(res => {
            alert("You have successfully registered! Redirecting to login page!")
            dispatch(registerAuthSuccess())
    
      
    })
    .catch(error => {
        if (error.response) {
            dispatch(authFail(error.response.data));

          } else if (error.request) {
            dispatch(authFail(error.request));
          } else {
            dispatch(authFail(error.message));
          }
        // dispatch(authFail(error));
    });
}
}

export const authCheckState = () => {
    return dispatch => {
        const ciphertoken =  Cookie.get("u_at") ? Cookie.get("u_at") : null;
        var token=Cookie.get("u_at") ? Cookie.get("u_at") : null;
        if(ciphertoken!==null && ciphertoken!==undefined){
        var bytes = CryptoJS.AES.decrypt(ciphertoken, 'fdaGj578JHh7Hmdf?d&%sdf?ds7');
         token = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        }
        // const token = localStorage.getItem('token');
        // const username = localStorage.getItem('username');
        const username= Cookie.get('u_id')
        if (token === undefined || token===null) {
            dispatch(logout());
        } else {
            // const expirationDate = new Date(localStorage.getItem('expirationDate'));
            // if ( expirationDate <= new Date() ) {
            //     dispatch(logout());
            // } else {
                dispatch(authSuccess(username, token));
                // dispatch(checkAuthTimeout( (expirationDate.getTime() - new Date().getTime()) / 1000) );
            // }
        }
    }
}