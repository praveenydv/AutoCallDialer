import React from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios'
import { connect } from 'react-redux';
import {HOST_URL} from '../settings'
import ContactUpdateDialog from '../containers/dialogs/contactUpdate'


class  Contact extends React.Component{

    constructor(props){
        super(props)
        this.state={
            contactUpdateDialogVisiblity:false
        }
    }

    deleteContact=(contactId)=>{
   
        const config = {
            headers: {
                  'content-type': 'application/json',
                    Authorization: `Token ${this.props.token}`
    
            }
        };
		const data={
			contacts:[contactId]
		}

        axios.delete(`${HOST_URL}/api/contact/${contactId}/delete/`,data,config)
            .then((res) => {
                this.props.contactDeleted(this.props.id)
                alert("The contact is successfully deleted");
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
        console.log('form submitted',this.props.id)
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
                        this.props.contactUpdated(res.data)
                        alert("The contact is successfully updated");
                    }).catch((error) => {
                        console.log(error)
                });
            }
  
                 
            
            
          

render(){
    return(  
        
        
	<div className='newcontactstyle'>
        <div>
        <ContactUpdateDialog
                        visiblity={this.state.contactUpdateDialogVisiblity}
                        onClose={this.onContactUpdateDialogClose}
                        onSubmit={this.onContactUpdateFormSubmit}
                      />
        </div>
		<div className='contacts'>
                <div>
				<span>{this.props.fname} {this.props.lname}</span>	
                </div>
                <br/>
                <div>
                    <span>{this.props.pnumber},</span>	
                    <span className='contactCity'>{this.props.city}</span>	

                </div>
		</div>
		
		<div><button onClick={() => this.updateContact(this.props.id)}>Update</button></div>

  		<div><button onClick={() => this.deleteContact(this.props.id)}>Delete</button></div>
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



export default connect(mapStateToProps,null)(Contact);



