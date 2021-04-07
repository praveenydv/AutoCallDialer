import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function PhonebookUpdateDialog({visiblity,onClose,onSubmit}) {
    const [open, setOpen] = React.useState(false);
  

    return (
      <div>

        <Dialog open={visiblity} onClose={onClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Phonebook Update</DialogTitle>
          <DialogContent>

        <form className="login100-form validate-form" method="POST" onSubmit={(e) => {onSubmit(e); onClose() }}>
                  
                    <div className="wrap-input100 validate-input m-b-10" data-validate="Group name is required">
                      <input className="input100" type="text" name="pbname" placeholder="Phonebook Name" required='required'/>
                      <span className="focus-input100" />
                      <span className="symbol-input100">
                        <i className="fa fa-card" />
                      </span>
                    </div>

                    <div className="container-login100-form-btn p-t-10">
                      <button className="login100-form-btn" type="submit">
                        Update
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




  