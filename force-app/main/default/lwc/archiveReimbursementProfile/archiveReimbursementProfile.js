import { LightningElement, api } from 'lwc';
import getLast2Years  from '@salesforce/apex/DriverDashboardLWCController.getLast2Years';
import {
    events, openEvents, toastEvents
} from 'c/utils';
export default class ArchiveReimbursementProfile extends LightningElement {
    @api contactId;
    @api accountId;
    @api trip;
    @api driverDetails;
    contact;
    lastYears;
    accordionList;
    hrBorder;
    lengthOfContact = false;
    timeAttendance = false;
    isIcon = true;
    value = "";
    selectViewList = [ {
        "User": "Geiger, Bethany",
        "Name": "",
        "Phone": "",
        "id": 1,
        "label": "6502 Orange St, Los Angeles, CA  90048",
        "value": "6502 Orange St, Los Angeles, CA  90048",
        "Latitude": 34.064847,
        "Longitude": -118.370149,
        "Range (ft)": 115,
        "Default Activity": "",
        "Tollbooth": ""
      },
      {
        "User": "Geiger, Bethany",
        "Name": "",
        "Phone": "",
        "id": 2,
        "label": "698 S Vermont Ave, Los Angeles, CA  90005",
        "value": "698 S Vermont Ave, Los Angeles, CA  90005",
        "Latitude": 34.060223,
        "Longitude": -118.291192,
        "Range (ft)": 328,
        "Default Activity": "",
        "Tollbooth": ""
      },
      {
        "User": "Geiger, Bethany",
        "Name": "",
        "Phone": "",
        "id": 3,
        "label": "5492 Calarosa Ranch Rd, Camarillo, CA  93012",
        "value": "5492 Calarosa Ranch Rd, Camarillo, CA  93012",
        "Latitude": 34.239233,
        "Longitude": -118.991619,
        "Range (ft)": 328,
        "Default Activity": "",
        "Tollbooth": ""
      },
      {
        "User": "Geiger, Bethany",
        "Name": "fed ex",
        "Phone": "",
        "id": 4,
        "label": "3150 Paseo Mercado, Oxnard, CA  93036",
        "value": "3150 Paseo Mercado, Oxnard, CA  93036",
        "Latitude": 34.228486,
        "Longitude": -119.146031,
        "Range (ft)": 328,
        "Default Activity": "",
        "Tollbooth": ""
      },
      {
        "User": "Geiger, Bethany",
        "Name": "",
        "Phone": "",
        "id": 5,
        "label": "3150 Via Paseo, Montebello, CA  90640",
        "value": "3150 Via Paseo, Montebello, CA  90640",
        "Latitude": 34.029474,
        "Longitude": -118.127495,
        "Range (ft)": 328,
        "Default Activity": "",
        "Tollbooth": ""
      },
      {
        "User": "Harris, Patricia",
        "Name": "",
        "Phone": "",
        "id": 6,
        "label": "110 Arndt St, Michigan City, IN  46360",
        "value": "110 Arndt St, Michigan City, IN  46360",
        "Latitude": 41.726699,
        "Longitude": -86.891668,
        "Range (ft)": 16,
        "Default Activity": "",
        "Tollbooth": ""
      },
      {
        "User": "Harris, Patricia",
        "Name": "",
        "Phone": "",
        "id": 7,
        "label": "1010 N Karwick Rd, Michigan City, IN  46360",
        "value": "1010 N Karwick Rd, Michigan City, IN  46360",
        "Latitude": 41.733743,
        "Longitude": -86.857173,
        "Range (ft)": 16,
        "Default Activity": "",
        "Tollbooth": ""
      },
      {
        "User": "Harris, Patricia",
        "Name": "",
        "Phone": "",
        "id": 8,
        "label": "41.714239,-86.557736",
        "value": "41.714239,-86.557736",
        "Latitude": 41.714239,
        "Longitude": -86.557736,
        "Range (ft)": 47,
        "Default Activity": "",
        "Tollbooth": ""
      },
      {
        "User": "Harris, Patricia",
        "Name": "",
        "Phone": "",
        "id": 9,
        "label": "Lake Park Plaza, 4353 Franklin St, Michigan City, IN  46360",
        "value": "Lake Park Plaza, 4353 Franklin St, Michigan City, IN  46360",
        "Latitude": 41.675206,
        "Longitude": -86.893971,
        "Range (ft)": 16,
        "Default Activity": "",
        "Tollbooth": ""
      },
      {
        "User": "Harris, Patricia",
        "Name": "",
        "Phone": "",
        "id": 10,
        "label": "2410 N Salisbury St, West Lafayette, IN  47906",
        "value": "2410 N Salisbury St, West Lafayette, IN  47906",
        "Latitude": 40.451986,
        "Longitude": -86.914729,
        "Range (ft)": 15,
        "Default Activity": "",
        "Tollbooth": ""
    }]
    proxyToObject(e) {
        return JSON.parse(e)
    }

    sortByDateDesc(data){
        (data).sort((a, b) => {
                 a = a ? a.toLowerCase() : '';
                 b = b ? b.toLowerCase() : '';
                 return a > b ? -1  : 1 ;
         });
         return data
     }

     getDriverDetail(data){
         let contactList = this.proxyToObject(data);
         this.contact = contactList[0];
         console.log("Driver details reimbursement clone", data)
         getLast2Years({
             contactId: this.contactId
         }).then(result => {
             let yearList = this.proxyToObject(result);
             this.lastYears = this.sortByDateDesc(yearList)
             this.accordionList = this.dynamicBinding(this.lastYears, this.trip)
             this.lengthOfContact = (this.accordionList.length > 0) ? true : false;
             console.log("formatted", JSON.stringify(this.accordionList))
             console.log("getLast2Years", data, JSON.stringify(this.lastYears))
         })
        .catch((error) => {
                 console.log("getLast2Years error", error)
        })
     }

    dynamicBinding(data, tripType) {
        let dataBind = [];
        let count = 1;
        data.forEach(element => {
          let singleValue = {}
          singleValue.Id = count ++;
          singleValue.yearName = element;
          singleValue.accordionTitle = (tripType === 'timeAttendance') ? element + ' Reimbursement Data (T & A)' : element + ' Reimbursement Data';
          singleValue.classType = 'accordion-item';
          this.hrBorder = false;
        //   singleValue.accTextClass = 'paragraph accordion-none';
          dataBind.push(singleValue);
        });
         
        return dataBind
    }

    // handleChange(evt) {
    //     //this.changeValue = evt.detail.value;
    //     console.log("changed---", evt.detail.value)
    //   }

    backToReimbursement(){
        events(this, '');
    }

    fromAccordion(event){
        openEvents(this, event.detail)
    }

    onToast(event){
        toastEvents(this, event.detail)
      }

      getSpinner(event){
        this.dispatchEvent(
            new CustomEvent("show", {
              detail: event.detail
            })
        )
      }

    connectedCallback(){
        console.log("trip", this.trip, this.driverDetails);
        this.timeAttendance = (this.trip === 'timeAttendance') ? true : false;
        if(this.driverDetails){
            this.getDriverDetail(this.driverDetails);
        }
    }
}