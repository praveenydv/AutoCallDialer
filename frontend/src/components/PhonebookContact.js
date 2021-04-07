import React from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios'
import { connect } from 'react-redux';
import {HOST_URL} from '../settings'
import ContactUpdateDialog from '../containers/dialogs/contactUpdate'


class  PhonebookContact extends React.Component{

    constructor(props){
        super(props)
        this.state={
            contactUpdateDialogVisiblity:false
        }
    }

    removeContact=(contactId,phonebookId)=>{
   
        const config = {
            headers: {
                  'content-type': 'application/json',
                    Authorization: `Token ${this.props.token}`
    
            }
        };
		const data={
			contacts:[contactId]
		}

        axios.patch(`${HOST_URL}/api/phonebook/${phonebookId}/contact/remove/`,data,config)
            .then((res) => {
                this.props.phonebookContactDeleted(this.props.id)
                alert("The contact is successfully removed");
            }).catch((error) => {
                console.log(error)
        });


    }

    updateContact=(id)=>{
        this.setState({contactUpdateDialogVisiblity:true})

    }


    onContactUpdateDialogClose=()=>{
        this.setState({contactUpdateDialogVisiblity:false})

    }
    onContactUpdateFormSubmit=(e)=>{
        // console.log('form submitted',this.props.id)
        e.preventDefault();
            
            
                const config = {
                    headers: {
                          'content-type': 'application/json',
                            Authorization: `Token ${this.props.token}`
            
                    }
                };
               const  data={
				'fname':e.target.fname.value,
				'lname':e.target.lname.value,
				'city':e.target.city.value,
				'pnumber':e.target.pnumber.value
			}
                axios.patch(`${HOST_URL}/api/contact/${this.props.id}/update/`,data,config)
                    .then((res) => {
                        this.props.phonebookContactUpdated(res.data)
                        alert("The contact is successfully updated");
                    }).catch((error) => {
                        console.log(error)
                });
            }
  
                 
            
            
          

render(){
    return(  
        
        
	<div className='contactstyle'>

<ContactUpdateDialog
                 visiblity={this.state.contactUpdateDialogVisiblity}
                 onClose={this.onContactUpdateDialogClose}
                 onSubmit={this.onContactUpdateFormSubmit}
                />
		<div >
				<span>{this.props.fname} {this.props.lname}</span>	
                <span>{this.props.city}</span>	
				<span>{this.props.pnumber}</span>	

		</div>
		<div className="phonebookContactButton">
		<div><button onClick={() => this.updateContact(this.props.id)}>Update</button></div>

  		<div><button onClick={() => this.removeContact(this.props.id,this.props.pb_id)}>Remove</button></div>
  </div>
  </div>
    )}
}

const mapStateToProps = state => {    
    return {
        isAuthenticated: state.auth.token !== null,
        loading: state.auth.loading,
        token:state.auth.token,
        username:state.auth.username,
        loggedInUser:state.auth.loggedInUser,

    }
}



export default connect(mapStateToProps,null)(PhonebookContact);



