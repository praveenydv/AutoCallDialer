import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";
const initialState = {
  messages: [],
  chats: [],
  CurrMsgID:NaN,
  activeuser:{chatroom:undefined},
  getnewMessage:true
};

// setVisibility=()=>{

//   axios.defaults.headers = {
//     "Content-Type": "application/json",
//     Authorization: `Token ${this.props.token}`
//   };
// axios.patch(`${HOST_URL}/api/conversation/update/?username=${this.props.activeuser.username}`,{
//     // isVisible:ture

// })
// .then(res => {

//     alert("Chat Deleted")
//     this.props.history.push('/');

//     this.props.getUserChats(this.props.username,this.props.token);
  
// })
// .catch(err => {
//     console.log(err)
// })
// }
const addMessage = (state, action) => {
  if (state.CurrMsgID===action.message.id){
      return updateObject(state, {

      messages: [...state.messages],
    });
  }

  state.CurrMsgID=action.message.id;

  var chat = state.chats.filter( i => String(i.chatroom.id)===action.message.room );
  if(chat['isVisible']===false){
    chat['isVisible']=true 
    //  this.setVisibility();
    
  
  }
  chat[0]['lastMessage']=action.message.content;
  var newChats = state.chats.filter( i => String(i.chatroom.id)!==action.message.room );
  
  // console.log(chat)
  if(action.message.chatroom!==state.activeuser.room){
    return updateObject(state, {
      chats:[chat[0],...newChats],
      messages: [...state.messages],
    });
  }

  return updateObject(state, {
    getnewMessage:true,
    chats:[chat[0],...newChats],

    messages: [...state.messages, action.message]
  });
};

const setMessages = (state, action) => {
  return updateObject(state, {
    messages: action.messages.reverse(),
    getnewMessage:false

  });
};

const setChats = (state, action) => {
  return updateObject(state, {
    chats: [action.chat,...state.chats]
  });
};



const clearAllChats = (state, action) => {
  return updateObject(state, {
    messages: [],
    chats: [],
    CurrMsgID:NaN
  });
};

const setActiveUser=(state,action)=>{
  return updateObject(state,{
    activeuser:action.activeuser
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_MESSAGE:
      return addMessage(state, action);
    case actionTypes.SET_MESSAGES:
      return setMessages(state, action);
    case actionTypes.GET_CHATS_SUCCESS:
      return setChats(state, action);
    case actionTypes.CLEAR_ALL_CHATS:
      return clearAllChats();
    case actionTypes.SET_NEW_ACTIVE_USER:
      return setActiveUser(state,action);
    default:
      return state;
  }
};

export default reducer;