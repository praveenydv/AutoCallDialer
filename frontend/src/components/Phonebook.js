import React from 'react';
import { NavLink } from 'react-router-dom';
import PhonebookUpdateDialog from '../containers/dialogs/phonebookUpdate'
import axios from 'axios'
import { connect } from 'react-redux';
import {HOST_URL} from '../settings'

class  Phonebook extends React.Component{

    constructor(props){
        super(props)
        this.state={
            phonebookUpdateDialogVisiblity:false
        }
    }

    deletePhonebook=(id)=>{
   
        const config = {
            headers: {
                  'content-type': 'application/json',
                    Authorization: `Token ${this.props.token}`
    
            }
        };

        axios.delete(`${HOST_URL}/api/phonebook/${this.props.id}/delete/`,config)
            .then((res) => {
                this.props.phonebookDeleted(this.props.id)
                alert("The phonebook is successfully deleted");
            }).catch((error) => {
                console.log(error)
        });


    }

    updatePhonebook=(id)=>{
        this.setState({phonebookUpdateDialogVisiblity:true})

    }


    onphonebookUpdateDialogClose=()=>{
        this.setState({phonebookUpdateDialogVisiblity:false})

    }
    onPhonebookUpdateFormSubmit=(e)=>{
        e.preventDefault();
            
            
                const config = {
                    headers: {
                          'content-type': 'application/json',
                            Authorization: `Token ${this.props.token}`
            
                    }
                };
               const  data={
                    'pbname':e.target.pbname.value
                }
                axios.patch(`${HOST_URL}/api/phonebook/${this.props.id}/update/`,data,config)
                    .then((res) => {

                        this.props.phonebookUpdated(res.data)

                        alert("The phonebook is successfully updated");
                    }).catch((error) => {
                        console.log(error)
                });
            }
  
                 
            
            
          

render(){
    return(  
        
        
        <div className='phonebook'>

             <PhonebookUpdateDialog
                 visiblity={this.state.phonebookUpdateDialogVisiblity}
                 onClose={this.onphonebookUpdateDialogClose}
                 onSubmit={this.onPhonebookUpdateFormSubmit}
                />
            <div style={{'width':'80%'}}>
        <NavLink to={this.props.toURL} style={{"color":"#fff"}} activeClassName="navactiveclass">
                <li className='phonebookList'>
                    <div>
                        <p >{this.props.name}</p>
                    </div>
                </li>

        </NavLink>
        </div>
        <div>
        <button onClick={() => this.updatePhonebook(this.props.id)}>Update</button></div>
        <div>
        <button onClick={() => this.deletePhonebook(this.props.id)}>Delete</button></div>
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



export default connect(mapStateToProps,null)(Phonebook);

