import axios from "axios";
import * as actionTypes from "./actionTypes";
import {HOST_URL} from '../../settings'
export const addMessage = message => {
  return {
    type: actionTypes.ADD_MESSAGE,
    message: message
  };
};

export const setMessages = messages => {
  return {
    type: actionTypes.SET_MESSAGES,
    messages: messages
  };
};


export const getUserChatsSuccess = chat => {
//  console.log("chatv",chat)

  return {
    type: actionTypes.GET_CHATS_SUCCESS,
    chat: chat
  };
};

export const clearAllChats = () => {
 
  return {
    type: actionTypes.CLEAR_ALL_CHATS,
  };
};

export const setActiveUser = activeuser => {
  return {
    type: actionTypes.SET_NEW_ACTIVE_USER,
    activeuser: activeuser
  };
};



export const getUserChats = (username, token) => {
  


  return dispatch => {
    dispatch(clearAllChats())
    axios.defaults.headers = {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`
    };
    axios.get(`${HOST_URL}/api/userchat/`)
      .then(res => {
        var chats=res.data
        chats.map(chat=>{
              dispatch(getUserChatsSuccess(chat))

        });
      })
      .catch(err => {
                      console.log(err)
                  });
                

                }
              }
        //   if(!c['isGroup']){ 
        //       const participants=c['participants']
        //       var otheruser=participants[0]===username?participants[1]:participants[0];
         
        //       axios.get(`${HOST_URL}/api/users/?username=${otheruser}`)
        //           .then(res => {
        //            var chat={
        //               chatID:c.id,
        //               user:res.data[0].username,
        //               chat_name:res.data[0].first_name,
        //               chat_profile:res.data[0].profile_image,
        //               lastMessage:"",
        //               lastAciveTime:"2:00pm",
        //               room:String(c.id),
        //               isGroup:false,
        //               isFriend:true
                      
                  
        //             }
        //             // console.log('chat',chat.chat_profile)
        //               dispatch(getUserChatsSuccess(chat))
        //           })
        //           .catch(err => {
        //               console.log(err)
        //           })
        //     }
        //     else{
        //       axios.get(`${HOST_URL}/api/groups/?groupId=${c.group.groupId}`)
        //           .then(res => {
        //            var chat={
        //               chatID:c.id,
        //               user:res.data[0].groupId,
        //               chat_name:res.data[0].groupname,
        //               chat_profile:res.data[0].group_profile,
        //               lastMessage:"",
        //               lastAciveTime:"2:00pm",
        //               room:String(c.id),
        //               isGroup:true,
        //               isFriend:true
                      
                  
        //             }
        //               dispatch(getUserChatsSuccess(chat))
        //           })
        //           .catch(err => {
        //               console.log(err)
        //           })
                
  
            
              

  //           }
  //       })

  //     });
  // };
// };