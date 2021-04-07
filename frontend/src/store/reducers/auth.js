import * as actionTypes from '../actions/actionTypes';
import { registerAuthSuccess } from '../actions/auth';
import { updateObject } from '../utility';

const initialState = {
    token: null,
    username: null,
    error: null, 
    loading: false,
    loggedInUser:null,
    haveRegistered:false,
}

const loggedInUser = (state, action) => {
    return updateObject(state, {
        loggedInUser: action.user,
    });
}


const authStart = (state, action) => {
    return updateObject(state, {
        error: null,
        loading: true
    });
}



const authSuccess = (state, action) => {
    return updateObject(state, {
        token: action.token,
        username: action.username,
        error: null,
        loading: false
    });
}

const authFail = (state, action) => {
    return updateObject(state, {
        error: action.error,
        loading: false
    });
}

const authLogout = (state, action) => {
    return updateObject(state, {
        token: null,
        username: null
        });
}

const registerSuccess=(state,action)=>{
        if(state.haveRegistered){
            return updateObject(state,{
                loading: false,

            haveRegistered:false
        });}
        else{
            return updateObject(state,{
                loading: false,

                haveRegistered:true
            });}

}

const reducer = (state=initialState, action) => {
    switch (action.type) {
        case actionTypes.AUTH_START: return authStart(state, action);
        case actionTypes.AUTH_SUCCESS: return authSuccess(state, action);
        case actionTypes.AUTH_FAIL: return authFail(state, action);
        case actionTypes.AUTH_LOGOUT: return authLogout(state, action);
        case actionTypes.SET_LOGGEDIN_USER: return loggedInUser(state, action);
        case actionTypes.REGISTER_AUTH_SUCCESS: return registerSuccess(state, action);
        default:
            return state;
    }
}

export default reducer; 