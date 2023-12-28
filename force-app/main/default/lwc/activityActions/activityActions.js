import { LightningElement, api } from 'lwc';
import editInlineNewEmployee from '@salesforce/apex/RosterController.editInlineNewEmployee';
import massFreeze from '@salesforce/apex/RosterController.massFreeze';
import putHTTPConcurConnect from '@salesforce/apex/RosterController.putHTTPConcurConnect';
import massResetPassword from '@salesforce/apex/RosterController.massResetPassword';
import massEnableUser from '@salesforce/apex/RosterController.massEnableUser';
import putHTTPMassWlcmMail from '@salesforce/apex/RosterController.putHTTPMassWlcmMail';
import {
    toastEvents, modalEvents
} from 'c/utils';


export default class ActivityActions extends LightningElement {

    @api activityList;

    @api 
    handleActivity(activity, data, accId, contactid) {
        switch (activity) {
            case 'Freeze':
                this.freezeUnFreeze(data, true);
                break;
            case 'UnFreeze':
                this.freezeUnFreeze(data, false);
                break;
            case 'Concur Connect':
                this.concurEmployee(data, accId);
                break;
            case 'Mass Reset Password':
                this.massReset(data);
                break;
            case 'Resend mLog App':
                this.sendMdashAppLink(data, accId);
                break;
            case 'Enable User':
                this.enableUser(data);
                break;
        }
    }


    sendMdashAppLink(data, accId) {
        if(data && data.length) {
            this.spinnerStart();
            putHTTPMassWlcmMail({accountID: accId, empEmail : this.getListOfContactEmails(data) })
            .then(responce => {
                let names = this.getListOfContactName(data);
                console.log("RESPONCE",this.proxyToObject(responce));
                if(JSON.parse(responce) == "OK") {
                    console.log("INSIDE IF", names.join(','));
                    let namesString = names.join(',');
                    let toastSuccess = { type: "success", message: `Email has been send to ${namesString}` };
                    toastEvents(this, toastSuccess);
                }
                this.spinnerStop();
            })
            .catch(err => {
                console.log(this.proxyToObject(err));
                this.spinnerStop();
            })
        }
    }

    massDeactivate(data, accId, contactid){
        if(data && data.length) {
            this.spinnerStart();
            editInlineNewEmployee({listofemployee: JSON.stringify(data), accid: accId, contactid: contactid})
            .then(response => {
                let result = JSON.parse(response);
                this.displayToast(result, `Records updated`);
                this.spinnerStop();
            })
            .catch(err => {
                this.spinnerStop()
                console.log(this.proxyToObject(err)) 
            });
        }
    }

    freezeUnFreeze(data, isFreeze) {
        if(data && data.length) {
            this.spinnerStart();
            massFreeze({listofemployee: this.getListOfContactIds(data), freezeProperty: isFreeze})
            .then(responce => {
                this.spinnerStop();
                let result = JSON.parse(responce);
                let msg = isFreeze ? 'Driver has been frozen' : 'Driver has been unfrozen';
                this.displayToast(result, msg);
            })
            .catch(err => {
                this.spinnerStop()
                console.log(this.proxyToObject(err)); 
            });
        }
    }

    concurEmployee(data, accId) {
        if(data && data.length) {
            this.spinnerStart();
            putHTTPConcurConnect({accountID: accId, empEmail:this.getListOfContactEmails(data)})
            .then(responce => {
                if(this.proxyToObject(responce) == 200) {
                    this.spinnerStop();
                    let toastSuccess = { type: "success", message: "Concur Connect to mLog connection established" };
                    toastEvents(this, toastSuccess);
                } else {
                    this.spinnerStop()
                    let toastError = { type: "error", message: "Something went wrong." };
                    toastEvents(this, toastError);
                }
            })
            .catch(err => {
                this.spinnerStop()
                console.log(this.proxyToObject(err)); 
            });
        }
    }
//Success
    massReset(data) {
        if(data && data.length) {
            this.spinnerStart();
            massResetPassword({contactListID: this.getListOfContactIds(data)})
            .then(responce => {
                if(this.proxyToObject(responce) == "Success") {
                    this.spinnerStop();
                    let toastSuccess = { type: "success", message: "Reset link is successfully send to driver"}
                    toastEvents(this, toastSuccess);
                } else {
                    this.spinnerStop()
                    let toastError = { type: "error", message: "Something went wrong." };
                    toastEvents(this, toastError);
                }
            })
            .catch(err => {
                this.spinnerStop()
                console.log(this.proxyToObject(err)); 
            });
        }
    }
    //Success 
    enableUser(data) {
        if(data && data.length) {
            this.spinnerStart();
            massEnableUser({contactListID: this.getListOfContactIds(data)})
            .then(responce => {
                if(this.proxyToObject(responce) == "Success") {
                    this.spinnerStop();
                    let toastSuccess = { type: "success", message: "Enabled user"}
                    toastEvents(this, toastSuccess);
                } else {
                    this.spinnerStop()
                    let toastError = { type: "error", message: "Something went wrong." };
                    toastEvents(this, toastError);
                }
            })
            .catch(err => {
                this.spinnerStop()
                console.log(this.proxyToObject(err)); 
            });
        }
    }

    displayToast(result, updateEmpMessage) {
        if(result?.hasError) {
            this.stopSpinner();
            console.error(result.message);
            let toastError = { type: "error", message: "Something went wrong." };
            toastEvents(this, toastError);
        }
        if(!result?.hasError) {
            this.spinnerStop();
            let toastSuccess = { type: "success", message: updateEmpMessage };
            toastEvents(this, toastSuccess);
        }
    }

    proxyToObject(data) {
        return JSON.parse(JSON.stringify(data));
    }

    spinnerStart() {
        this.dispatchEvent(new CustomEvent("start", {}));
    }

    spinnerStop() {
        this.dispatchEvent(new CustomEvent("stop", {}));
        this.dispatchEvent(new CustomEvent("reset", {}));
    }

    getListOfContactIds(data) {
        return JSON.stringify(data.map(item => item.id));
    }

    getListOfContactEmails(data) {
        return JSON.stringify(data.map(item => item.email));
    }

    getListOfContactName(data) {
        return data.map(item => item.name);
    }
}