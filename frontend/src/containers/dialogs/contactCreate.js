import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function ContactCreateDialog({visiblity,onClose,onSubmit}) {
    const [open, setOpen] = React.useState(false);
  

    return (
      <div>

        <Dialog open={visiblity} onClose={onClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Contact Create</DialogTitle>
          <DialogContent>

        <form className="login100-form validate-form" method="POST" onSubmit={(e) => {onSubmit(e); onClose() }}>
                  
                    <div className="wrap-input100 validate-input m-b-10" data-validate="First name is required">
                      <input className="input100" type="text" name="fname" placeholder="First Name" required='required'/>
                      <span className="focus-input100" />
                      <span className="symbol-input100">
                        <i className="fa-id-card" />
                      </span>
                    </div>

                    <div className="wrap-input100 validate-input m-b-10" data-validate="Last name is required">
                      <input className="input100" type="text" name="lname" placeholder="Last Name" required='required'/>
                      <span className="focus-input100" />
                      <span className="symbol-input100">
                        <i className="fa-id-card" />
                      </span>
                    </div>

                    <div className="wrap-input100 validate-input m-b-10" data-validate="City name is required">
                      <input className="input100" type="text" name="city" placeholder="City Name" required='required'/>
                      <span className="focus-input100" />
                      <span className="symbol-input100">
                        <i className="fas fa-city" />
                      </span>
                    </div>

                    <div className="wrap-input100 validate-input m-b-10" data-validate="Phone name is required">
                      <input className="input100" type="text" name="pnumber" placeholder="Phone Name" required='required'/>
                      <span className="focus-input100" />
                      <span className="symbol-input100">
                        <i className="fa-mobile" />
                      </span>
                    </div>

                    <div className="container-login100-form-btn p-t-10">
                      <button className="login100-form-btn" type="submit">
                        Create
                      </button>
                  </div>
            
                  
                </form>
 
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} color="primary">
              Cancel
            </Button>
  
          </DialogActions>
        </Dialog>
      </div>
    );
  }




  