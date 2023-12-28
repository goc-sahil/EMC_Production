import { LightningElement, api } from 'lwc';
import { events } from 'c/utils';
import driverDetails from '@salesforce/apex/NewAccountDriverController.getContactDetail';
import updateContactDetail from '@salesforce/apex/NewAccountDriverController.updateContactDetail';
export default class MBurseWelcomeAccount extends LightningElement {
    host;
    protocol;
    pathname;
    search;
    showWelcomeVideo = false;
    renderInitialized = false;
    renderBtnText = 'Go to step 1';
    @api customSetting;
    @api contactId;
    proxyToObject(e) {
        return JSON.parse(e)
    }
    
    redirectToInsurance(){
        events(this,'Next Welcome Insurance');
    }

    redirectToStep(event) {
        this.showWelcomeVideo = false;
        driverDetails({
            contactId: this.contactId
        })
        .then((data) => {
            let dataList;
            if (data) {
                dataList = this.proxyToObject(data);
                dataList[0].planPreviewOnBoarding = event.detail
                updateContactDetail({
                    contactData: JSON.stringify(dataList),
                    driverPacket: true
                }).then().catch(error=>{
                    console.log("error updateContactDetail", JSON.parse(JSON.stringify(error)))
                })
            }
        }).catch((error) => {
                console.log("error driverDetails", JSON.parse(JSON.stringify(error)))
        })
    }

    renderedCallback(){
        if (this.renderInitialized) {
              return;
        }
        this.renderInitialized = true;
        driverDetails({
            contactId: this.contactId
        })
        .then((data) => {
            let dataList;
            if (data) {
                dataList = this.proxyToObject(data);
                this.planPreviewOnBoarding = dataList[0].planPreviewOnBoarding;
                if(dataList[0].planPreviewOnBoarding){
                    this.showWelcomeVideo = false;
                }else{
                    this.showWelcomeVideo = true;
                }
                this.renderBtnText = (!dataList[0].watchMeetingOnBoarding) ? 'Go to step 1' : (dataList[0].insuranceStatus !== 'Uploaded') ? 'Go to step 2' : (dataList[0].driverPacketStatus !== 'Uploaded')
                ? 'Go to step 3' : (!dataList[0].mlogApp) ? 'Go to step 4' : this.renderBtnText
            }
        }).catch((error) => {
                console.log("error driverDetails", JSON.parse(JSON.stringify(error)))
        })
    }

}