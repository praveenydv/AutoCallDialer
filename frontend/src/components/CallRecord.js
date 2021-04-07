import React from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios'
import { connect } from 'react-redux';
import Moment from 'moment';



class  CallRecord extends React.Component{

    constructor(props){
        super(props)

    }

     
            
            
          

render(){
    // console.log(this.props)
    return(  
        <div className='newcontactstyle'>

	    	<div style={{'width':'100%','paddingRight':'10px'}}>
                
				         <span>{this.props.contact.fname} {this.props.contact.lname}</span>	
                        <span style={{'float':'right'}}>{this.props.callstatus}: {this.props.callduration} sec/ Cost:{this.props.callcost}</span>
                <br/>
                    <span>{this.props.contact.pnumber}, </span>	
                    <span className='contactCity'>{this.props.contact.city}, </span>	
                    <span style={{'float':'right'}}>{Moment(this.props.callstarttime).format('DD/MM/YYYY HH:MM:SS')}</span>	

		</div>
		

    </div>
        


//                 <span>{this.props.callstarttime}</span>

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



export default connect(mapStateToProps,null)(CallRecord);



