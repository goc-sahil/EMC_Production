import { LightningElement , wire , track ,api} from 'lwc';
// import getDriverList from '@salesforce/apex/ReportComplianceofDriver.getDriversDetails';
// import getReportDetail from '@salesforce/apex/ReportComplianceofDriver.getComplianceCalculation';
// import getYearDetail from '@salesforce/apex/ReportComplianceofDriver.complianceYear';
import getYearDetail from '@salesforce/apex/ReportListController.AccountYear';
import getDriverList from '@salesforce/apex/ReportDetailsController.getAllDrivers';
import getReportDetail from '@salesforce/apex/ReportDetailsController.getCompliance';

import { loadStyle } from 'lightning/platformResourceLoader';
import DRIVER_TAX_REPORT from '@salesforce/resourceUrl/DriverTaxReport';

export default class DriverTaxLiabilityReport extends LightningElement {
    accounts = [];
    Driver = []; //to store Driver picklist List
    yesrlist = []; //to store Year picklist List
    @api Year =[]; //to store Year picklist List
    @api TypeOptions = []; //to store Driver picklist List
    @api accId;
    @track DriverTaxDetail = [];
    @track QuarterWiseDetail = [];//to store Quarter wise tax Detail
    @track errormsg = '';//to store result of click on apply button
    label = ''; //to store selected label of Driver dropdown
    value = ''; //to store selected value of Driver dropdown
    @track labelyear = '';//to store value of selected Year dropdown
    @track msg = '';//to store msg of 1st,2nd for Quarter
    @track isDriver = false;//this boolean variable is used for apply button visible on off
    @track isYear = false ;//this boolean variable is used for apply button visible on off
    @track AnualTaxLiability = false;//this boolean variable is used for show quarter detail
    @track Driverplaceholder = 'Select Driver';//to store placeholder value of Driver dropdown
    @track Yearplaceholder = 'Select Year';//to store placeholder value of Year dropdown
    totalrem = 0.00;//to store total raimbursment amount qurter wise
    maxallounce = 0.00;//to store max allounce amount qurter wise
    taxliablity = 0.00;//to store tax liability amount qurter wise
    DownloadExcelnew = [];
    sumoftotalraim = 0.00;//to store sum of raimbursment for Summary detail
    sumofiRSallowable = 0.00;//to store sum of IRS Allowable for Summary detail
    sumofimputedincome = 0.00;//to store sum of Imputed income for Summary detail
    emailid = '';
    empid = '';
    labelyear = '';
    downloaddetail = [];
    jsondatanew = [];
    header = [];//To store header of Detail xlsx file
    summaryheader = [];//To store header of Summary xlsx file
    
    //to get driver picklist value
    // @wire(getDriverList, { accountId: this.accId }) 
    // DriverDetail(result){
    //     const { error, data } = result;
    //     if(data){ 
    //       let options = [];
    //       let finalData = this.JsonToParseData(data);
          
    //       finalData.forEach( eachData => {
    //         options.push({ label:eachData.Name, value:eachData.Id , rowSelected:"slds-listbox__item" });
    //       })
    //         this.Driver = options;
    //         this.TypeOptions = options;
    //         console.log("TypeOptions",this.TypeOptions)
    //     }
    //     if(error){
    //         console.log('error--',error);
    //     }
    // }
    // //to get year picklist value
    // @wire(getYearDetail, { accountId: this.accId }) 
    // YesrDetail(result){
    //     const { error, data } = result;
    //     if(data){ 
    //         this.yesrlist.push({ label:data.toString(), value:data.toString() });
    //         this.Year.push({ label:data.toString(), value:data.toString() });
    //     }
    //     if(error){
    //         console.log('error--',error);
    //     }
    // }
    connectedCallback(){
        console.log("accid",this.accId)
        getDriverList({ accountId: this.accId })
        .then(result =>{
            let options = [];
            let finalData = this.JsonToParseData(result);
          
            finalData.forEach( eachData => {
                options.push({ label:eachData.Name, value:eachData.Id  });
            })
            this.Driver = options;
            this.TypeOptions = options;
            console.log("TypeOptions",this.TypeOptions)
        })
        .catch (error => {
            console.log('error--',error);
        })
        getYearDetail({ accountId: this.accId })
        .then(data =>{
            let account = JSON.parse(JSON.stringify(data));
            let currentYear = new Date().getFullYear();
            if(account != currentYear){
                for(let i = account; i <= currentYear ;i++){
                    this.yesrlist.push({label:i.toString() , value:i.toString()})
                }
            }else{
                this.yesrlist.push({label:account.toString() , value:account.toString()})
            }
            this.yesrlist = JSON.parse(JSON.stringify(this.yesrlist))
        })
        .catch (error => {
            console.log('error--',error);
        })
    }
    
    renderedCallback() {
        Promise.all([loadStyle(this, DRIVER_TAX_REPORT + '/dynamicCSS/DriverTaxReportCSS.css')]);
    }
    //This event is custom event for Dropdown of Driver
    handleDriver(event) {
        this.isDriver = true;
        this.TypeOptions.forEach(element => {
            if(element.label == event.detail.value){
                this.label = element.value;
            }
        })
        // this.label = event.detail.value;
        // this.value = event.detail.selectedlabel;
        console.log('indriver',this.label)
    }
    //This event is custom event for Dropdown of Year
    handleYear(event) {
        this.isYear = true;
        this.labelyear = event.detail.value;
        console.log('inyear',this.isYear)
    }
    //This method is used for convert data into JSON.Parse(Stringify)
    JsonToStringifyData(array){
        return JSON.parse(JSON.stringify(array));
    }
    //This method is used for convert data into JSON.Parse
    JsonToParseData(parsedata){
        return JSON.parse(parsedata);
    }
    //this method are call, when click on Apply button for Get Report Data
    HandleApply(){
        getReportDetail({contactId: this.label, year :  this.labelyear})  
        .then(result =>{
            let detailExcel = [];
            let arrOfSummry = [];

            console.log('result',result);
            this.DriverTaxDetail = result;
            //To get the detail of Quarter 
            let taxDetail = this.JsonToStringifyData(this.DriverTaxDetail[2]);
            this.QuarterWiseDetail =this.JsonToParseData(taxDetail);
            this.QuarterWiseDetail = this.QuarterWiseDetail.map((accnew)=>
             Object.assign({}, accnew, {msg: null})
             );
            //To store quarter wise msg ,like 1 then 'st' , 2 then 'nd'
            this.QuarterWiseDetail.forEach(acc => {
                var j = acc.quarterno % 10,
                k = acc.quarterno % 100;
                if (j == 1 && k != 11) {
                    acc.msg = 'st';
                }
                else if (j == 2 && k != 12) {
                    acc.msg = 'nd';
                }
                else if (j == 3 && k != 13) {
                    acc.msg = 'rd';
                }
                else  {
                    acc.msg = 'th';
                }
                return acc;
            });
  
            this.AnualTaxLiability = true;
            //To get the Detail for Annual Tax Detail
            let totalrem = this.JsonToStringifyData(this.DriverTaxDetail[5]);
            this.totalrem = this.JsonToParseData(totalrem);
            let maxallounce = this.JsonToStringifyData(this.DriverTaxDetail[6]);
            this.maxallounce = this.JsonToParseData(maxallounce);
            let taxliablity = this.JsonToStringifyData(this.DriverTaxDetail[7]);
            this.taxliablity = this.JsonToParseData(taxliablity);

            //To get the detail for create Detail File
            let DownloadExcel = this.JsonToStringifyData(this.DriverTaxDetail[3]);
            this.DownloadExcelnew = this.JsonToParseData(DownloadExcel);
           //To get the total for dEtail file and summary file
            this.DownloadExcelnew.forEach(acct =>{
                this.empid = acct.employeeid;
                this.emailid = acct.emailid;
                this.sumoftotalraim = this.sumoftotalraim + acct.totalreim;
                this.sumofiRSallowable = this.sumofiRSallowable + acct.iRSallowable;
                this.sumofimputedincome = this.sumofimputedincome + acct.imputedincome;
            })
            /************Start for Detail Excel**********/
            //to get the header of Detail.xlsx
            this.header = [ "Driver Name","Email","Employee Id","Month","Year",
                            "Total Reimbursement","IRS allowable","Imputed Income"];
            //to concat two array for row of sum and detail
            let arr2 = [].concat(this.DownloadExcelnew);
            arr2.push({drivername:'', emailid:'',  
                        employeeid:'' ,month:'', year:'',
                        totalreim:this.sumoftotalraim, iRSallowable:this.sumofiRSallowable ,
                        imputedincome:this.sumofimputedincome});
                        console.log('arr2',arr2)
                
            let jsondata = this.JsonToStringifyData(arr2);
            
            jsondata.forEach( detaildata => {
                detailExcel.push({ DriverName:detaildata.drivername, Email:detaildata.emailid ,  
                                        EmployeeID:detaildata.employeeid ,Month:detaildata.month, Year:detaildata.year,
                                        TotalReimbursement:'$'+detaildata.totalreim, IRSAllowable:'$'+detaildata.iRSallowable ,
                                        ImputedIncome:'$'+detaildata.imputedincome});
                return detailExcel;
            })
            this.downloaddetail = this.JsonToStringifyData(detailExcel);
            /************End for Detail Excel**********/

            /************Start for Summary Excel**********/
            //to get the header of Summary.xlsx
            this.summaryheader = [ "Driver Name","Email","Employee Id",
                            "Total Reimbursement","IRS allowable","Imputed Income"];
            arrOfSummry.push({DriverName:this.value, Email:this.emailid,  
                        EmployeeId:this.empid, 
                        TotalReimbursement:'$'+this.sumoftotalraim, IRSAllowable:'$'+this.sumofiRSallowable ,
                        ImputedIncome:'$'+this.sumofimputedincome});

            this.jsondatanew = this.JsonToStringifyData(arrOfSummry);  
            /************End for Summary Excel**********/
        })
        .catch (error => {
            //If result not found or get any error then show data not fount 
            this.AnualTaxLiability = false;
            this.errormsg = 'No Data Found for this Year';
            console.log('error',this.errormsg);
        })
    }
    //this method are call, when click on download button for Detail xlsx file
    handleDetail(){
        let tempheader = [];
        let tempworkSheetNameList = [];
        let tempxlsData = [];
        let name = '';
        //push data , custom header , filename and worksheetname for detail xlsx file
        tempheader.push(this.header);
        tempworkSheetNameList.push("Detail Report");
        tempxlsData.push(this.downloaddetail);
        name = this.value+' Annual Tax Liability Detail Report.xlsx';
        //Download detail report(xlsx file)
        if(tempxlsData.length > 0){
            this.callcreatexlsxMethod(tempheader ,name, tempworkSheetNameList , tempxlsData);
        }
    }
    //this method are call, when click on download button for Summary xlsx file
    handleSummary(){
        let summaryheadernew = [];
        let summaryworkSheetNameList = [];
        let summaryxlsData = [];
        let summaryname = '';
        //push data , custom header , filename and worksheetname for Summary xlsx file
        summaryheadernew.push(this.summaryheader);
        summaryworkSheetNameList.push("Summary Report");
        summaryxlsData.push(this.jsondatanew);
        summaryname =  this.value+' Annual Tax Liability Summary Report.xlsx';
        //Download Summary report(xlsx file)
        if(summaryxlsData.length > 0){
            this.callcreatexlsxMethod(summaryheadernew ,summaryname, summaryworkSheetNameList , summaryxlsData);
        }
    }

    callcreatexlsxMethod(headerList , filename , worksheetNameList , sheetData ){
        //Download Summary report(xlsx file)
        this.template.querySelector("c-download-C-S-V-File").download(headerList , filename , worksheetNameList , sheetData);
    }
    //call this even when click on Back icon to referesh report(set null)
    handleClick(){
        this.label = null;
        this.labelyear = null;
        this.isDriver = false;
        this.isYear = false;
        this.AnualTaxLiability = false;
        this.dispatchEvent(
            new CustomEvent("back", {
              
            })
          );
    }

}