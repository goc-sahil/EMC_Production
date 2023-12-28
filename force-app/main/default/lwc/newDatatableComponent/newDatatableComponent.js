import { LightningElement , api } from 'lwc';
import { loadStyle , loadScript } from 'lightning/platformResourceLoader';
import DRIVER_TAX_REPORT from '@salesforce/resourceUrl/MilegesDynamicTable';
import resourceImage from '@salesforce/resourceUrl/mBurseCss';
import deleteMileages from '@salesforce/apex/GetDriverData.deleteMileages';
import approveMileages from '@salesforce/apex/GetDriverData.approveMileages';
import fetchMileages from '@salesforce/apex/GetDriverData.fetchMileageslwc';
import mileageListData from '@salesforce/apex/GetDriverData.mileageListData';
import deleteTrips from '@salesforce/apex/GetDriverData.deleteTrips';
import MassSyncTrips from '@salesforce/apex/GetDriverData.MassSyncTrips';
import fetchMileagesSize from '@salesforce/apex/GetDriverData.fetchMileagesSize';
import getMilegesData from '@salesforce/apex/GetDriverData.getMilegesData';
import getMilegesDataSize from '@salesforce/apex/GetDriverData.getMilegesDataSize';
import accountMonthList from "@salesforce/apex/ManagerDashboardController.accountMonthList";
import LOADER_MSG_LABEL from '@salesforce/label/c.Loading_message_for_preview_page';
import SALESFORCE_LIMIT_MSG from '@salesforce/label/c.Info_message_for_salesforce_limit';

import {
  formatData,
  changeKeyObjects,
  dateTypeFormat,
  excelFormatDate,
  yearMonthDate
} from 'c/commonLib';
export default class NewDatatableComponent extends LightningElement {
  @api accId ;
  @api adminId;
  @api roleOfUser
  contactId;
  accountId;
  Accounts = [];
  MilegesData = [];
  MilegesDatanew = [];
  searchdata = [];
  searchKey = '';
  searchDataLength = false;
  headershow = false;
  pagination = false;
  checkinTolltip = false;
  pageSize = '25';
  totalrows = 0;
  totalmileage = 0.00;
  pageSizeOptions = [{Id:1,label:'25',value:'25'},{Id:2,label:'50',value:'50'},{Id:3,label:'100',value:'100'},{Id:4,label:'200',value:'200'}];
  openmodel = false;
  recordid;
  isopen = false;
  ascsorticon = false;
  dscsorticon = false;
  @api driver;
  number = 0;
  reverse = false;
  approveRejectData = [];
  isAlertEnabled = false;
  // isLoading = false;
  alertMessage='';
  paginatinrecord = [];
  searchIcon = resourceImage + '/mburse/assets/mBurse-Icons/Vector.png';
  mapIcon = resourceImage + '/mburse/assets/map_point.png';
  title='';
  isFalse=true;
  modalclass = "slds-modal slds-fade-in-open ";
  headerclass = "slds-modal__header header-preview ";
  subheaderClass = "slds-modal__title slds-hyphenate hedear-style_class";
  modalcontentstyle = "slds-modal__content slds-p-left_medium slds-p-right_medium slds-p-bottom_medium slds-p-top_small"
  styleheader = "slds-modal__container"
  closebtnclass = "close-notify"
  modalcontentmessage='';
  updatetext;
  btnlabel='';
  advancesearch = false;
  advanceSearchdata = false;
  celenderdropdown = false;
  filename;
  xlsHeader = [];
  xlsData = [];
  temp = [];
  fromDate = '';
  toDate = '';
  csvFiledata = [];
  _accid ='';
  _adminid='';
  @api driverData;
  driverDataNew = [];
  syStDate;
  syEnDate;
  // @api monthList ;
  @api driverList;
  @api statusList;
  @api monthList;
  typeList = [{Id : 1 , label : 'All Types' , value : 'All Types'},{Id : 1 , label : 'High Risk' , value : 'High Risk'}];
  statusList1 = [{Id : 1 , label : 'All Status' , value : 'All Status'},
                {Id : 2 , label : 'Approved' , value : 'Approved'},
                {Id : 3 , label : 'Not Approved Yet' , value : 'Not Approved Yet'},
                {Id : 4 , label : 'Rejected' , value : 'Rejected'}];
  @api mainClass;
  className = 'slds-scrollable_y slds-p-right_small slds-p-left_small';
  @api norecordMessage;
  norecordMessagenew = '';
  offset=0;
  limit=25;
  limitSize = 0 ;
  tripStatus='';
  datatable = 'slds-table slds-table--header-fixed slds-table_cell-buffer slds-table_striped';
  id='' ; 
  AdminId ='';
  idOfDriver='';
  StartDate ;
  EndDate; 
  OriginName ='';
  DestinationName ='';
  ActiveDriver ='';
  StartMileage =''; 
  EndMileage='';
  TripStatus ='';
  TrackingMethod ='';
  Tag='';
  Activity='';
  monthfilter = '';
  searchStatus = '';
  Status = '';
  searchDriver='';
  filterdriver='';
  highrisk = false;
  selectedDriver = '';
  selectedStatus = '';
  selectedmonthlist = '';
  selectedMonth ;
  remmonth = '';
  selectDriver = '';
  // monthoptions = [];
  @api searchDriver;
  
   TypeOptions = [ { fieldlabel: 'Driver', fieldName: 'Driver' },
                            { fieldlabel: 'Mileage', fieldName: 'mileage' },
                            { fieldlabel: 'From', fieldName: 'from' },
                            { fieldlabel: 'To', fieldName: 'to' },
                            { fieldlabel: 'Tags', fieldName: 'tags' },
                            { fieldlabel: 'Notes', fieldName: 'notes' }];
    
     getUrlParamValue(url, key) {
      return new URL(url).searchParams.get(key);
    }
    
    connectedCallback(){
      this.dispatchEvent(
        new CustomEvent("showloader", { detail :{ message: 'Please wait while we load your data'}})
      );
      this._accid  = this.getUrlParamValue(window.location.href, 'accid')
      this._adminid  = this.getUrlParamValue(window.location.href, 'id')
      // accountMonthList({
      //   accountId: this._accid
      // }).then((data) => {
      //   if (data) {
      //     let mileageAccount = data ? this.removeDuplicateValue(this.proxyToObject(data)) : [];
      //     let mileageAccountList = this.review(mileageAccount);
      //     console.log("Month---", mileageAccountList);
      //     var monthoption = JSON.parse(  mileageAccountList ).sort( ( a, b ) => {
      //       return a.id > b.id ? 1 : -1;
      //     });
      //     this.monthoptions = [{id:0 ,label:'Month',value:'Month'}].concat(monthoption);
      //   }
      // });
      // if(this.monthoptions){
        // console.log("this.monthoptions",JSON.parse(JSON.stringify(this.monthoptions)))
        
        var makeDate = new Date();
        makeDate.setMonth(makeDate.getMonth()-1);
        this.selectedmonthlist = makeDate.toLocaleString('default', { month: 	'long' });
        console.log("connected callback",this.selectedmonthlist)
        if(this.advanceSearchdata == false){
          fetchMileagesSize({accID: this._accid, adminId:this._adminid})
          .then((result) => {
            this.limitSize = result;
            this.totalrows = result;
          
              if(this.template.querySelector('c-new-paginator')){
                this.template.querySelector('c-new-paginator').updateRecords(this.limitSize  , this.pageSize)
              } 
              console.log("this.driverData",this.driverData)
              this.getmilegeslist(this.driverData);

             
              setTimeout(() => {
                this.dispatchEvent(
                  new CustomEvent("hideloader", { detail : ''})
                );
              },2000); 
              //  this.showlimittoast();
              
          })
          .catch((error) => {
          console.log("relod",error)
        })
        }
      // }
    }

    renderedCallback() {
      Promise.all([loadStyle(this, DRIVER_TAX_REPORT + '/MilesgesCSS/milegesDetailCSS.css')]);
    }
    
    get options() {
      var optionList;
      var currentDate = new Date();
      var previousDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
      var lastSyncMonth = dateTypeFormat(previousDate);
      var currentSyncMonth = dateTypeFormat(currentDate);
      optionList = [{
          label: lastSyncMonth,
          value: lastSyncMonth
      }, {
          label: currentSyncMonth,
          value: currentSyncMonth
      }];
      return optionList;
    }

    get driveroption() {
      var driverlist = JSON.parse( JSON.stringify( this.driverList ) ).sort( ( a, b ) => {
        a = a.label ? a.label.toLowerCase() : ''; // Handle null values
        b = b.label ? b.label.toLowerCase() : '';
        return a > b ? 1 : -1;
      });;
      let driverarray = [{id: 1,label:'All Active Users',value:'All Drivers'}].concat(driverlist);
      return driverarray;
    }
    get statusoption() {
      var statusoption = JSON.parse(JSON.stringify(this.statusList));
      console.log("status option",statusoption)

      return statusoption;
    }
    get monthoptions() {
      var monthoption = JSON.parse(  this.monthList ).sort( ( a, b ) => {
        return a.id > b.id ? 1 : -1;
      });
      let arr2 = [{id: 0 ,label:'Month',value:'Month'}].concat(monthoption);
      return arr2;
    }
    // get lastmonth(){
    //   var makeDate = new Date();
    //   makeDate.setMonth(makeDate.getMonth()-1);
    //   let lastmonth = makeDate.toLocaleString('default', { month: 	'long' });
    //   return lastmonth;
    // }
    
   
    @api getmilegeslist(data){
     let accdata = [];
     let dateformatenew ='';
     let enddateformate='';
     let dateformate='';
     let acctdata = JSON.parse(data);
     let datedash = '';
     console.log("acc data2",acctdata);

     for(let index  = 0 ; index < acctdata.length ; index++){
           //for trip date
           if(acctdata[index].Trip_Date__c != undefined){
              let objectDate1 = new Date(acctdata[index].Trip_Date__c);
            var objectDate = objectDate1.toLocaleDateString("en-US", {
              timeZone: "Asia/Kolkata",
              day: "2-digit",
              month: "2-digit",
              year: "2-digit"
            });
           
            //  let day = objectDate.getDate();
            //  if (day < 10) {
            //    day = '0' + day;
            //  }
            //  let month = objectDate.getMonth() + 1;
            //  if (month < 10) {
            //    month = '0' + month;
            //  }
            //  let year = objectDate.getYear();
            //  year = year.toString();
             
            //  dateformate = month+'/'+day+'/'+year.substring(1);
            dateformate = objectDate;
           }else{
             dateformate = '';
           }
           
           //for starttime
           if(acctdata[index].ConvertedStartTime__c != undefined){
             let startendTime = new Date(acctdata[index].ConvertedStartTime__c);
             let convertedTime = startendTime.toLocaleTimeString("en-US", {
               timeZone: "America/Panama",
               hour: "2-digit",
               minute: "2-digit",
             });
              dateformatenew = convertedTime ;
             
           }else{
             dateformatenew = '';
           }    
           
           //for endtime
           if(acctdata[index].ConvertedEndTime__c != undefined){
             let endTime = new Date(acctdata[index].ConvertedEndTime__c);
             let convertedEndTime = endTime.toLocaleTimeString("en-US", {
               timeZone: "America/Panama",
               hour: "2-digit",
               minute: "2-digit",
             });
             enddateformate = convertedEndTime;
           }else{
             enddateformate = '';
           } 
           if(dateformatenew.length > 0 && enddateformate.length > 0){
            datedash = ' - ';
           }
           if(acctdata[index].Tracing_Style__c != undefined){
            if(acctdata[index].Tracing_Style__c.length > 0){
              this.checkinTolltip = true;
            }else{
              this.checkinTolltip = false;
            }
           }
           accdata.push({Id : acctdata[index].Id , Date:dateformate ,IsSelected : false, checkinicon : false ,TrackingTolltip : this.checkinTolltip, Status : acctdata[index].Trip_Status__c , rowSelected:"tbody-header" ,iconcolor:"checkin_icon",timeColor:'start_time',
                         StartTime : dateformatenew,dated : datedash,EndTime : enddateformate,DriverName : acctdata[index].EmployeeReimbursement__r.Contact_Id_Name__c , 
                         Mileges :    parseFloat(acctdata[index].Mileage__c.toFixed(2)), 
                         From : acctdata[index].Original_Origin_Name__c  == undefined ? acctdata[index].Origin_Name__c == undefined ? '': acctdata[index].Origin_Name__c : acctdata[index].Original_Origin_Name__c, 
                         FromName : acctdata[index].Original_Origin_Name__c == undefined ? '' : acctdata[index].Original_Origin_Name__c,
                         Triporigion : acctdata[index].Trip_Origin__c,
                         To : acctdata[index].Original_Destination_Name__c == undefined ? acctdata[index].Destination_Name__c == undefined ? '': acctdata[index].Destination_Name__c : acctdata[index].Original_Destination_Name__c ,  
                         ToName : acctdata[index].Original_Destination_Name__c == undefined ? '' : acctdata[index].Original_Destination_Name__c,
                         
                         Toorigion : acctdata[index].Trip_Destination__c,
                         weekday:acctdata[index].Day_Of_Week__c == undefined ? '' : acctdata[index].Day_Of_Week__c.substring(0, 3), 
                         Tags : acctdata[index].Tag__c == undefined ? '' : acctdata[index].Tag__c , 
                         Notes :  acctdata[index].Notes__c == undefined ? '' : acctdata[index].Notes__c , 
                         Activity : acctdata[index].Activity__c == undefined ? '' : acctdata[index].Activity__c , 
                         DriveTime: acctdata[index].Driving_Time__c == undefined ?  0 : acctdata[index].Driving_Time__c,
                         StayTime:  acctdata[index].Stay_Time__c == undefined ? 0 : acctdata[index].Stay_Time__c,
                         fromlatitude:acctdata[index].From_Location__Latitude__s == undefined ?  undefined : acctdata[index].From_Location__Latitude__s,
                         fromlongitude: acctdata[index].From_Location__Longitude__s == undefined ?  undefined : acctdata[index].From_Location__Longitude__s,
                         tolatitude: acctdata[index].To_Location__Latitude__s == undefined ?  undefined : acctdata[index].To_Location__Latitude__s,
                         tolongitude: acctdata[index].To_Location__Longitude__s == undefined ?  undefined : acctdata[index].To_Location__Longitude__s,
                         tripId:acctdata[index].Trip_Id__c == undefined ? undefined : acctdata[index].Trip_Id__c,
                         triplog: acctdata[index].Triplog_Map__c == undefined ? '' : acctdata[index].Triplog_Map__c,
                         timezone: acctdata[index].TimeZone__c == undefined ? '' : acctdata[index].TimeZone__c,
                         waypoint: acctdata[index].Way_Points__c == undefined ? undefined : acctdata[index].Way_Points__c,
                         EmailID : acctdata[index].EmployeeReimbursement__r.Contact_Id__r.External_Email__c,
                         TrackingStyle : acctdata[index].Tracing_Style__c == undefined ?  '' : acctdata[index].Tracing_Style__c,
                         approverejecticon : null,approverejecticon1:null,approvecheckin : false ,rejectcheckin : false,
                         State : acctdata[index].Trip_Destination_State__c,
                         milegeLockDate :acctdata[index].EmployeeReimbursement__r.Mileage_Lock_Date__c == undefined ? '' : acctdata[index].EmployeeReimbursement__r.Mileage_Lock_Date__c
             });
         }
         
         this.Accounts = accdata;
         this.driverDataNew = accdata;
         this.celenderdropdown = true;
         if (this.Accounts.length != 0) {
           this.datatable = 'slds-table slds-table--header-fixed slds-table_cell-buffer slds-table_fixed-layout slds-max-medium-table_stacked-horizontal slds-table_striped';
           this.searchDataLength = true;
           this.totalrows = this.limitSize;
           this.pagination = true;
           this.headershow = true;
           this.pageEventClick(this.Accounts);
           this.norecordMessagenew = '';
           console.log("after pageevent")
            // if(this.Accounts.length > 8){
            //   this.className = 'slds-scrollable_y slds-p-right_small slds-p-left_small';
            // }else{
            //   this.className = ' slds-p-right_small slds-p-left_small';
            // }
            if(this.template.querySelector('.CheckUncheckAll')){
              let checkboxes = this.template.querySelector('.CheckUncheckAll')
              
              let checkbox = this.template.querySelectorAll('.checkboxCheckUncheckSearch')
              if(checkbox){
                  let count = 0;
                  for(let i=0; i<checkbox.length; i++) {
                    if(checkbox[i].checked == true) {
                        count++;
                    }
                  }
                  console.log("count",count +'---'+checkbox.length)
                  if(count == checkbox.length){
                    checkboxes.checked = true;
                  }else{
                    checkboxes.checked = false;
                  }
                }  
              }
         } else {
          this.datatable = 'slds-table slds-table--header-fixed slds-table_cell-buffer slds-table_striped';
          this.norecordMessagenew = 'There is no trip data available';
           this.searchDataLength = false;
           this.pagination = false;
           this.headershow = false;
           this.totalrows = 0;
           this.totalmileage = 0.00;
           
         }
     }
    handleoffset(event){
      console.log("in offset")
      this.offset = event.detail.offset;
      this.limit = event.detail.limit;
     
      const accidparavalue  = this.getUrlParamValue(window.location.href, 'accid')
      const idparavalue  = this.getUrlParamValue(window.location.href, 'id')
      if(this.advanceSearchdata == false ) {
        fetchMileages({accID : accidparavalue,AdminId: idparavalue,limitSize : this.limit,offset : this.offset})
        .then((result) => {
            let accresult1 = JSON.stringify(result)
            if(accresult1.length > 0){
              this.getmilegeslist(accresult1);
            }else{
              this.searchDataLength = false;
              this.pagination = false;
              this.totalmileage = 0.00;
              this.totalrows = 0;
            }
        })  
        .catch((error) => {
          console.log("relod in offset",error)
        })
     
      }else {
        
        if(this.StartDate == null){
          this.StartDate = null;
          this.EndDate = null;
        }
        if(this.Status){
          this.TripStatus = this.Status;
        }else if(this.searchStatus){
          this.TripStatus = this.searchStatus;
        }else{
          this.TripStatus = 'All Status';
        }
        if(this.filterdriver){
          this.idOfDriver = this.filterdriver;
        }else if(this.searchDriver){
          this.idOfDriver = this.searchDriver;
        }else{
          this.idOfDriver = '';
        }
       
        console.log("in advance true",this.TripStatus)
        this.getmileagesData(this._accid , this._adminid , this.idOfDriver , this.StartDate , this.EndDate , this.OriginName , this.DestinationName , this.ActiveDriver , this.StartMileage , this.EndMileage,
          this.TripStatus , this.TrackingMethod , this.Tag  , this.limit , this.offset,this.remmonth,this.highrisk)
      }
     
      let checkbox = this.template.querySelectorAll('.checkboxCheckUncheckSearch')
     
          let count = 0;
          for(let i=0; i<checkbox.length; i++) {
            checkbox[i].checked = false;
          }
        
        
      if(this.template.querySelector('.CheckUncheckAll')){
        let checkboxes = this.template.querySelector('.CheckUncheckAll')
        checkboxes.checked = false;
      }

    }
    pageEventClick(data){
      // let pageeventdata = [...event.detail.records];
      console.log("pageclickevent",data)
      this.MilegesData = JSON.parse(JSON.stringify(data))
      let mileges = 0;
        this.MilegesData.forEach(rowItem => {
          mileges = mileges + rowItem.Mileges;
          if(rowItem.fromlatitude == undefined && rowItem.tolatitude == undefined){
              rowItem.checkinicon = false;
          }else{
              rowItem.checkinicon = true;
              rowItem.Status === "Approved" || rowItem.Status === "Not Approved Yet" ? rowItem.approvecheckin = true : rowItem.approvecheckin = false;
              rowItem.Status === "Rejected" ? rowItem.rejectcheckin = true : rowItem.rejectcheckin = false;
          }
          
          if(rowItem.Status === "Approved") {
            rowItem.rowSelected = 'row collapsible row-approved-color';
            rowItem.iconcolor = 'checkin_icon';
            rowItem.timeColor  = 'start_time';
            rowItem.approverejecticon = true;
            rowItem.approverejecticon1 = false;
          }else if(rowItem.Status === "Rejected") {
            rowItem.rowSelected = 'row collapsible row-rejected-color';
            rowItem.iconcolor = 'reject_checkin_icon';
            rowItem.timeColor  = 'reject_time';
            rowItem.approverejecticon = false;
            rowItem.approverejecticon1 = true;

          } else{
            rowItem.rowSelected = 'row collapsible';
            rowItem.iconcolor = 'reject_checkin_icon';
            rowItem.timeColor  = 'start_time';
            rowItem.approverejecticon = null;
            rowItem.approverejecticon1 = null;
          } 
        })
      console.log("pageclickevent2",data)

        if(this.MilegesData.length > 0){
          this.headershow = true;
          this.celenderdropdown = true;
        
          if(this.template.querySelector('.CheckUncheckAll')){
            let checkboxes = this.template.querySelector('.CheckUncheckAll')
            checkboxes.checked = false;
          }
         
          this.totalmileage = mileges.toFixed(2);
        }else{
          // this.celenderdropdown = false;
          this.headershow = false;
          this.totalmileage = 0.00;
        }
      console.log("pageclickevent3",data)

        this.MilegesDatanew = this.MilegesData;
    }
    
    handleRecordsPerPage(event){
      if(this.MilegesData.length > 0){
        this.pageSize = event.detail.value;
          this.template.querySelector("c-new-paginator").updateRecords(this.limitSize , this.pageSize);
          this.celenderdropdown = true;
      }  
    }

    IsAllCheckForApprove(event) {
      let checked = event.target.checked;
      let checkboxes = this.template.querySelectorAll('.checkboxCheckUncheckSearch')
      for(let i=0; i<checkboxes.length; i++) {
        checkboxes[i].checked = checked;
      }
    }

    handleCheckbox(event){
      let checkboxes = this.template.querySelector('.CheckUncheckAll')
      if(event.target.checked == false ){
        
            checkboxes.checked = false;
      }
      let checkbox = this.template.querySelectorAll('.checkboxCheckUncheckSearch')
      let count = 0;
      for(let i=0; i<checkbox.length; i++) {
       if(checkbox[i].checked == true) {
          count++;
       }
      }
      console.log("count",count +'---'+checkbox.length)
      if(count == checkbox.length){
        checkboxes.checked = event.target.checked;
      }else{
        checkboxes.checked = false;
      }
    }
    handleicon(event){
      this.sortRecs(event);
    }

    sortRecs(event){
      if(this.MilegesData.length > 0){
        let colName = event.currentTarget.dataset.name;
        console.log("colName",colName)
        if(colName == 'Driver' ){
          this.updateSorting(colName ,'DriverName')
        }else if(colName == 'Mileage'){
          this.updateSorting(colName, 'Mileges')
        }else if(colName == 'From'){
          this.updateSorting(colName ,'From')
        }else if(colName == 'To'){
          this.updateSorting(colName , 'To')
        }else if(colName == 'Tags'){
          this.updateSorting(colName , 'Tags')
        }else if(colName == 'Notes'){
          this.updateSorting(colName , 'Notes')
        }else if(colName == 'Date & Time'){
          this.updateSorting(colName , 'Date')
        }
      }
    }

    updateSorting(colname , field){
      this.template.querySelectorAll('.sorting_dsc').forEach(dsc =>{
        dsc.classList.remove('asc-style');
      }) 
      this.template.querySelectorAll('.sorting_asc').forEach(asc =>{
        asc.classList.remove('asc-style');
      })
       
      if(this.reverse  == false){
        if(colname == 'Mileage'){
          this.MilegesData = JSON.parse( JSON.stringify( this.MilegesData ) ).sort( ( a, b ) => {
            a = a[ field ] == null ? 0 : a[ field ]; // Handle null values
            b = b[ field ] == null ? 0 : b[ field ];
            console.log("if 1")
            return a < b ? 1 : -1;
          });  
        }else{
          this.MilegesData = JSON.parse( JSON.stringify( this.MilegesData ) ).sort( ( a, b ) => {
            a = a[ field ] ? a[ field ].toLowerCase() : ''; // Handle null values
            b = b[ field ] ? b[ field ].toLowerCase() : '';
            console.log("if 1")
            return a < b ? 1 : -1;
          });
        }
        this.reverse = true;
        this.template.querySelector(`.sorting_dsc[data-name="${colname}"]`).classList.add('asc-style'); 
        this.template.querySelector(`.sorting_asc[data-name="${colname}"]`).classList.remove('asc-style');
      }else{
        if(colname == 'Mileage'){
          this.MilegesData = JSON.parse( JSON.stringify( this.MilegesData ) ).sort( ( a, b ) => {
            a = a[ field ] == null ? 0 : a[ field ]; // Handle null values
            b = b[ field ] == null ? 0 : b[ field ];
            console.log("if 1")
            return a > b ? 1 : -1;
          });  
        }else{
          this.MilegesData = JSON.parse( JSON.stringify( this.MilegesData ) ).sort( ( a, b ) => {
            a = a[ field ] ? a[ field ].toLowerCase() : ''; // Handle null values
            b = b[ field ] ? b[ field ].toLowerCase() : '';
            console.log("if 1")
            return a > b ? 1 : -1;
          });
        }
        this.reverse = false;
        this.template.querySelector(`.sorting_asc[data-name="${colname}"]`).classList.add('asc-style'); 
        this.template.querySelector(`.sorting_dsc[data-name="${colname}"]`).classList.remove('asc-style');
      }
    }

    handleKeyPress(event){
      this.searchKey = event.target.value;
      if(this.MilegesData.length > 0){
        this.filterDropdownList(this.searchKey);
      }else{
        this.datatable = 'slds-table slds-table--header-fixed slds-table_cell-buffer slds-table_striped';
          this.norecordMessagenew = 'There is no trip data available';
        this.searchDataLength = false;
        this.totalmileage = 0.00;
        this.headershow = false;
        this.pagination = false;
      }  
    }
    
    handleKeyCode(event){
      try {
        if(event.key == "Backspace"){
          this.MilegesData = this.MilegesDatanew;
          this.searchDataLength = true;
          this.headershow = true;
          this.pagination = true;
          this.celenderdropdown = true;
          this.template.querySelector('.CheckUncheckAll').checked = false;
        }
      } catch (error) {
        
      }
      
    }

    filterDropdownList(key) {
      const filteredOptions = this.MilegesData.filter(filteritem => JSON.stringify(filteritem).toUpperCase().includes(key.toUpperCase()));
      this.MilegesData = filteredOptions;
      if(this.MilegesData.length > 0){
        this.searchDataLength = true;

      }else{
        this.searchDataLength = false;
        this.totalmileage = 0.00;
        // this.totalrows = 0;
        this.headershow = false;
        this.pagination = false;
        this.datatable = 'slds-table slds-table--header-fixed slds-table_cell-buffer slds-table_striped';
          this.norecordMessagenew = 'There is no trip data available';
        // this.celenderdropdown = false;
      }
    }
    
    /** Added By Megha (Row Open on click of TR) Starts--- */
    previewTrip(event) {
      
      // event.stopPropagation();
     this.recordid = event.currentTarget.dataset.id;
        // Display list of rows with class name 'content'
      if(event.target.dataset.elementType != "checkbox"){
        let row1 = this.template.querySelector(
          `.content_view[data-id="${this.recordid}"]`
        );
        row1.classList.remove('disply_row')
        let row = this.template.querySelectorAll(
          `[data-id="${this.recordid}"],.content_view`
        );
        this.datatable = 'slds-table slds-table--header-fixed slds-table_cell-buffer slds-table_fixed-layout slds-max-medium-table_stacked-horizontal slds-table_striped';
        for (let i = 0; i < row.length; i++) {
          let view = row[i];
          // console.log("view",view.className)
          if (view.className === "row collapsible active" || view.className === "row collapsible row-approved-color active" || view.className === "row collapsible row-rejected-color active") {
            if (this.recordid === view.dataset.id) {
              view.classList.remove('active');
              this.template.querySelector(`c-editable-datatable[data-id="${this.recordid}"]`).closeModal();
              // console.log("view.className",this.template.querySelector(`.content_view[data-id="${this.recordid}"]`))
              // this.template.querySelector(`.content_view[data-id="${this.recordid}"]`).style.display = "none"
              let row1 = this.template.querySelector(
                `.content_view[data-id="${this.recordid}"]`
              );
              row1.classList.add('disply_row')
              // this.closeTrip(event);
            }  
          } else{
            if (view.className === "row collapsible" || view.className === "row collapsible row-approved-color" || view.className === "row collapsible row-rejected-color") {
              if (this.recordid === view.dataset.id) {
               // if (view.style.display === "table-row" || view.style.display === "")
                  view.classList.add('active');
                  this.MilegesData.forEach(newindex =>{
                    if(newindex.Id === this.recordid){
                      console.log("newindex.waypoint",newindex.waypoint)
                      this.template.querySelector(`c-editable-datatable[data-id="${this.recordid}"]`).openmodal(newindex.Id , newindex.DriverName , newindex.Date ,newindex.Mileges ,newindex.From , newindex.To ,newindex.Tags , newindex.Notes , newindex.Activity ,newindex.DriveTime ,newindex.StayTime,newindex.fromlatitude,newindex.fromlongitude,newindex.tolatitude,newindex.tolongitude,newindex.tripId,newindex.triplog,newindex.timezone,newindex.waypoint,newindex.StartTime ,newindex.EndTime);
                    }
                    return newindex;
                  })
              } else {view.classList.remove('active')};
            } else if (view.className == "row content_view") {
              if (this.recordid == view.dataset.id) {
                if (view.style.display == "table-row") { view.classList.remove('active'); view.style.display = "none";}
                else {  view.classList.add('active'); view.style.display = "table-row"; }
              }
            } 
          } 
        }
        
      }  
    }

    //** (Row Close on click of TR) */
    closeTrip(event) {
      // data-id of row <tr> -- >
      this.rowElementId  = '';
       this.recordid = event.currentTarget.dataset.id;
      console.log("target", this.recordid, this.template.querySelectorAll(
        `[data-id="${this.recordid}"],.content_view`
      ))
      let row1 = this.template.querySelector(
        `.content_view[data-id="${this.recordid}"]`
      );
      row1.classList.remove('disply_row')
      // Display list of rows with class name 'content'
      let row = this.template.querySelectorAll(
        `[data-id="${this.recordid}"],.content_view`
      );
  
      for (let i = 0; i < row.length; i++) {
        let view = row[i];
        if (
          view.className === "row collapsible active" || view.className === "row collapsible row-approved-color active" || view.className === "row collapsible row-rejected-color active"
        ) {
          if (this.recordid === view.dataset.id) {
              view.classList.remove('active');
          }else {view.classList.add('active')};
        } else if (view.className === "row content_view active") {
          if (this.recordid === view.dataset.id) {
            if (view.style.display === "table-row")  { view.classList.remove('active'); view.style.display = "none";}
            else { view.classList.add('active'); view.style.display = "table-row"; }
          }
        }
      }
    }
    /** Ends --- */
    handleRefresh(event){
      let data = this.MilegesData;
      data.forEach(rowindex =>{
        if(rowindex.Id === event.detail.userid){
          rowindex.Notes = event.detail.usernote;
          rowindex.Tags = event.detail.usertag;
          rowindex.StayTime = event.detail.userstaytime;
          this.template.querySelector('c-editable-datatable').closeModal();
          setTimeout(() => {
            this.template.querySelector(`.row[data-id="${rowindex.Id}"]`).classList.add('hightlight_row');
            this.dispatchEvent(
              new CustomEvent("toastmessage", {
                detail: {
                  errormsg: "success",
                  message:"Record Successfully Updated."
                } 
              })
            );
            setTimeout(() => {
                this.template.querySelector(`.row[data-id="${rowindex.Id}"]`).classList.remove('hightlight_row');
            }, 3000);
          }, 1000);
        }
        return rowindex;
      })
      this.MilegesData = JSON.parse(JSON.stringify(data));
    }

    getcheckboxtrue(){
      let listofarray = [];
      let checkboxes = this.template.querySelectorAll('.checkboxCheckUncheckSearch')
      for(let i=0; i<checkboxes.length; i++) {
        if(checkboxes[i].checked == true){
          listofarray.push({
            Id: this.MilegesData[i].Id,
            employeeEmailId: this.MilegesData[i].EmailID,
            milegeLockDate : this.MilegesData[i].milegeLockDate
          });
        }
      }
      this.approveRejectData = JSON.stringify(listofarray);
      console.log("getcheckboxtrue",this.approveRejectData.length)
    }

    handleUnapproveClick(){
      if(this.MilegesData.length > 0){
        this.getcheckboxtrue();
        if (this.approveRejectData.length == 2) {
          this.dispatchEvent(
            new CustomEvent("toastmessage", {
              detail: {
                errormsg: "error",
                message:"Select atleast one trip to unapprove."
              } 
            })
          );
        }else{
          this.btnlabel = "Cancel";
          this.styleheader = "slds-modal__container slds-m-top_medium modal_width"
          this.openmodal("Unapprove Trips","Are you sure you want to unapprove the selected trips ?");
          this.updatetext = "Not Approved Yet";
        }
      }
    }
    handleRejectClick(){
      if(this.MilegesData.length > 0){
        this.getcheckboxtrue();
        if (this.approveRejectData.length == 2) {
          this.dispatchEvent(
            new CustomEvent("toastmessage", {
              detail: {
                errormsg: "error",
                message:"Select atleast one trip to reject."
              } 
            })
          );
        }else{
          this.btnlabel = "Cancel";
          this.styleheader = "slds-modal__container slds-m-top_medium "
          this.openmodal("Mileage Status","The mileage approval and flagging process could take several minutes. Would you like to receive an email when the process is complete ?");
          this.updatetext = "Rejected";
        }
      }  
    }
    handleApproveClick(){
      if(this.MilegesData.length > 0){
        this.getcheckboxtrue();
        if (this.approveRejectData.length == 2) {
          this.dispatchEvent(
            new CustomEvent("toastmessage", {
              detail: {
                errormsg: "error",
                message:"Select atleast one trip to approve."
              } 
            })
          );
        }else{
          this.styleheader = "slds-modal__container slds-m-top_medium "
          let count = 0;
          let modaltxt;
          let lockdatearray = JSON.parse(this.approveRejectData);
         
            lockdatearray.forEach(element =>{
              console.log("in each loop",element.milegeLockDate)
              if(element.milegeLockDate != null){
                count = count + 1;
              }
            })
            
           
          // }
          console.log("count",count)
          if(count > 0){
            const date = new Date();  // 2009-11-10
            const month = date.toLocaleString('default', { month: 'long' });
            modaltxt = 'You are approving mileage after the ' + month + ' reimbursement report was run. This mileage will be applied to the next reimbursement period report';
          }else{
            modaltxt = 'The mileage approval and flagging process could take several minutes. Would you like to receive an email when the process is complete ?'
          }
          this.btnlabel = "Cancel";
          this.openmodal("Mileage Status",modaltxt);
          this.updatetext = "Approved";
        }
      }
    }
    handleDeleteTrips(){
      if(this.MilegesData.length > 0){
        this.getcheckboxtrue();
        if (this.approveRejectData.length == 2) {
          this.dispatchEvent(
            new CustomEvent("toastmessage", {
              detail: {
                errormsg: "error",
                message:"Select atleast one trip to delete."
              } 
            })
          );
        }else{
          this.btnlabel = "No";
          this.styleheader = "slds-modal__container slds-m-top_medium modal_width"
          this.openmodal("Delete Trip Status","Are you sure you want to delete the selected trips ?");
          this.updatetext = "delete";
        }
      }  
    }
   
    openmodal(textofheader , contentmessage ){
      this.title=textofheader;
      this.modalcontentmessage = contentmessage;
      if (this.template.querySelector('c-user-profile-modal')) {
          this.template.querySelector('c-user-profile-modal[data-id="mileges"]').show();
      }
    }

    handlemodalYes(){
      let updateidlist = [];
      updateidlist = this.approveRejectData;

      if(this.template.querySelector('c-user-profile-modal')) {
        this.template.querySelector('c-user-profile-modal[data-id="mileges"]').hide();
      }
      if(this.updatetext == "Not Approved Yet"){
        this.updateMileges(updateidlist ,"Trip's unapproved sucessfully", false , true , true);
      }else if(this.updatetext == "Approved"){
        this.updateMileges(updateidlist ,"Trip's approved sucessfully", true , true , false);
      }else if(this.updatetext == "Rejected"){
        this.updateMileges(updateidlist ,"Trip's rejected sucessfully", false , false , false);
      }else{
        this.dispatchEvent(
          new CustomEvent("showloader", { detail :{ message: 'Please wait while we load your data'}})
        );
        deleteMileages({emailaddress: updateidlist })
        .then((data) => {
          setTimeout(() => {
            this.dispatchEvent(
              new CustomEvent("toastmessage", {
                detail: {
                  errormsg: "success",
                  message:"Trip's deleted sucessfully."
                } 
              })
            );
          }, 2000);
          ///////
          // this.Status = 'All Status';
          this.filterdriver = '';
          this.selectedStatus = 'All Status';
          this.advanceSearchdata = false;
          var makeDate = new Date();
          makeDate.setMonth(makeDate.getMonth()-1);
          var lastmonth = makeDate.toLocaleString('default', { month: 	'long' });
          this.selectedmonthlist = lastmonth;
          this.monthfilter = lastmonth;
          this.template.querySelector('c-dropdown-select[data-id="month"]').selection()
          this.template.querySelector('c-dropdown-select[data-id="month"]').toggleSelectedValue(lastmonth);
          this.template.querySelector('c-dropdown-select[data-id="Status"]').selection()
          this.template.querySelector('c-dropdown-select[data-id="Status"]').toggleSelectedValue('All Status');
          this.template.querySelector('c-dropdown-select[data-id="Drivers"]').selection()
          this.template.querySelector('c-dropdown-select[data-id="Drivers"]').toggleSelectedValue('All Active Users') ;
          this.template.querySelector('c-dropdown-select[data-id="Types"]').selection()
          this.template.querySelector('c-dropdown-select[data-id="Types"]').toggleSelectedValue('All Types') ;
          this.template.querySelector('c-dropdown-select[data-id="Types"]').selectedValue = 'All Types';

          const accidparavalue  = this.getUrlParamValue(window.location.href, 'accid')
          const idparavalue  = this.getUrlParamValue(window.location.href, 'id')
          fetchMileagesSize({accID:accidparavalue, adminId:idparavalue})
          .then((result) => {
            if(result > 2000){
              this.limitSize = 2000;
              this.totalrows = 2000;
             }else{
              this.limitSize = result;
              this.totalrows = result;
             }
              if(this.template.querySelector('c-new-paginator')){
                this.template.querySelector('c-new-paginator').updateRecords(this.limitSize  , this.pageSize)
              } 
              fetchMileages({accID : accidparavalue,AdminId: idparavalue,limitSize : this.pageSize,offset : 0})
              .then((acc) => {
                let accresult2 = JSON.stringify(acc)
                this.getmilegeslist(accresult2);
               
              })
              .catch((error) => {
                console.log(error)
              });
              
              setTimeout(() => {
                this.dispatchEvent(
                  new CustomEvent("hideloader", { detail : ''})
                );
              },2000); 
          })
          .catch((error) => {
            console.log("relod",error)
          })
          
         
          let boxes = this.template.querySelectorAll('.checkboxCheckUncheckSearch')
          for(let i=0; i<boxes.length; i++) {
            if(boxes[i].checked == true){
              boxes[i].checked = false;
            }
          }
          let checkboxesnew = this.template.querySelector('.CheckUncheckAll');
            checkboxesnew.checked = false;
          this.approveRejectData =  [];
        })
        .catch((error) => {
          console.log(error)
        });
      }
    }
    closeModal(){
      let updateidlist = [];
      updateidlist = this.approveRejectData;

      if (this.template.querySelector('c-user-profile-modal')) {
        this.template.querySelector('c-user-profile-modal[data-id="mileges"]').hide();
      }
      // if(this.updatetext == "Approved"){
        // this.updateMileges(updateidlist ,"Trip's approved sucessfully", true , false , false);
      // }else if(this.updatetext == "Rejected"){
        // this.updateMileges(updateidlist ,"Trip's rejected sucessfully", false , false , false);
      // }
      if(this.Accounts.length > 0){
        let boxes = this.template.querySelectorAll('.checkboxCheckUncheckSearch')
          for(let i=0; i<boxes.length; i++) {
            if(boxes[i].checked == true){
              boxes[i].checked = false;
            }
          }
          let checkboxesnew = this.template.querySelector('.CheckUncheckAll');
          checkboxesnew.checked = false;
      }
    }
    handleCloseModal(){
      console.log("in close",this.Accounts.length)
      if(this.Accounts.length > 0){
        let boxes = this.template.querySelectorAll('.checkboxCheckUncheckSearch')
          for(let i=0; i<boxes.length; i++) {
            if(boxes[i].checked == true){
              boxes[i].checked = false;
            }
          }
          let checkboxesnew = this.template.querySelector('.CheckUncheckAll');
          checkboxesnew.checked = false;
      }
    }

    updateMileges(listofId , toastmsg ,approve , unapprove , sendmail){
      this.dispatchEvent(
        new CustomEvent("showloader", { detail : {message: LOADER_MSG_LABEL}})
      );
      approveMileages({
        checked: approve,
        emailaddress: listofId,
        sendEmail: sendmail,
        unapprove: unapprove
      })
      .then((result) => {
          if(result){
           
            setTimeout(() => {
              this.dispatchEvent(
                new CustomEvent("hideloader", { detail : ''})
              );
              this.dispatchEvent(
                new CustomEvent("toastmessage", {
                  detail: {
                    errormsg: "success",
                    message:toastmsg
                  } 
                })
              );
            }, 2000);
            
            let boxes = this.template.querySelectorAll('.checkboxCheckUncheckSearch')
            for(let i=0; i<boxes.length; i++) {
              if(boxes[i].checked == true){
                boxes[i].checked = false;
              }
            }
            let checkboxesnew = this.template.querySelector('.CheckUncheckAll');
            checkboxesnew.checked = false;
            let formateddata = JSON.parse(this.approveRejectData);
            for(let j=0; j<formateddata.length;j++){
              this.MilegesData.forEach(account => {
                if(account.Id == formateddata[j].Id){
                  if(approve == true){
                    account.Status = 'Approved';
                  }else if(unapprove == true){
                    account.Status = 'Not Approved Yet';
                  }else{
                    account.Status = 'Rejected';
                  }
                }
              })
            }
            this.pageEventClick( this.MilegesData)
            this.approveRejectData =  [];
          }
      })
      .catch((error) => {
          console.log(error)
      })
    }
    handlevaluechange(event){
      this.selectedMonth = event.detail.value;
    }
    /// click on sync all button
    async handleSyncAll(){
        this.styleheader = "slds-modal__container slds-m-top_medium modal_width"
        if (this.template.querySelector('c-user-profile-modal')) {
          this.template.querySelector('c-user-profile-modal[data-id="syncall"]').show();
        }
    }
    async handlemodalselect(){
      if (this.selectedMonth != undefined) { 
        this.dispatchEvent(
          new CustomEvent("showloader", { detail :{ message: 'Please wait while we load your data'}})
        );
        var today = new Date();
        var cDate = dateTypeFormat(today);
        if (cDate === this.selectedMonth) {
            var now = new Date(today.getFullYear(), today.getMonth(), 1);
            var last = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            this.syStDate = yearMonthDate(now);
            this.syEnDate = yearMonthDate(last);
        } else {
            var previousNow = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            var previousLast = new Date(today.getFullYear(), today.getMonth(), 0);
            this.syStDate = yearMonthDate(previousNow);
            this.syEnDate = yearMonthDate(previousLast);
        }
        try {
          let deleteResult = await deleteTrips({
            accountId: this._accid,
            month: this.selectedMonth
          });
          console.log("M1", deleteResult);
          if (deleteResult) {
            let massResult = await MassSyncTrips({
                  accountId: this._accid,
                  startDate: this.syStDate,
                  endDate: this.syEnDate,
                  month: this.selectedMonth,
                  tripStatus: 'U',
                  activityStatus: 'Business'
                });

                console.log("M2", massResult);
                if (massResult) {
                  let finalMassResult = await MassSyncTrips({
                        accountId: this._accid,
                        startDate: this.syStDate,
                        endDate: this.syEnDate,
                        month: this.selectedMonth,
                        tripStatus: 'S',
                        activityStatus: 'Business'
                      });
                      console.log("Mass Result", finalMassResult);
                      if(finalMassResult){
                            this.handlesynccloseModal();
                             this.advanceSearchdata = false;
                              const accidparavalue  = this.getUrlParamValue(window.location.href, 'accid')
                              const idparavalue  = this.getUrlParamValue(window.location.href, 'id')
                             
                              setTimeout(() => {
                                fetchMileagesSize({accID: accidparavalue, adminId:idparavalue})
                                .then((result) => {
                                  console.log("sync limitsize",result)
                                  if(result > 2000){
                                    this.limitSize = 2000;
                                    this.totalrows = 2000;
                                   }else{
                                    this.limitSize = result;
                                    this.totalrows = result;
                                   }
                                    if(this.template.querySelector('c-new-paginator')){
                                      this.template.querySelector('c-new-paginator').updateRecords(this.limitSize  , this.pageSize)
                                    } 
                                    fetchMileages({accID : accidparavalue , AdminId : idparavalue , limitSize : this.pageSize , offset : 0})
                                    .then((result) => {
                                      console.log("result",JSON.parse(JSON.stringify(result)))
                                      this.getmilegeslist(JSON.stringify(result));
                                      // this.showlimittoast();
                                    })
                                    .catch((error) => {
                                      console.log("error",error)
                                    })
                                  
                                })
                                .catch((error) => {
                                  console.log("relod",error)
                                })
                                this.dispatchEvent(
                                  new CustomEvent("hideloader", { detail : ''})
                                );
                              },10000);   
                      }
                }
              
          }
        } catch (error) {
          // Handle the error gracefully
          console.error('An error occurred:', error);
          this.dispatchEvent(
            new CustomEvent("hideloader", { detail : ''})
          );
          // You can also display an error message to the user if necessary
        }  
      }else{
        this.dispatchEvent(
          new CustomEvent("toastmessage", {
            detail: {
              errormsg: "error",
              message:"Please select month"
            } 
          })
        );
      }
    }
    handlesynccloseModal(){
      if (this.template.querySelector('c-user-profile-modal')) {
        this.template.querySelector('c-user-profile-modal[data-id="syncall"]').hide();
      }
    }
    exportTripsByDate(){
      this.styleheader = "slds-modal__container slds-m-top_medium"
        if (this.template.querySelector('c-user-profile-modal')) {
          this.template.querySelector('c-user-profile-modal[data-id="export_trip"]').show();
          setTimeout(() => {
            if(this.template.querySelectorAll('.date-selector').length > 0){
              this.intializeDatepickup();
            }
          },1000);
      }  
    }
   
    exportSelectedTrips(){
      if(this.MilegesData.length > 0){
        this.getcheckboxtrue();
        if (this.approveRejectData.length == 2) {
          // this.SetToasterrorMessage("Select atleast one trip to Export.");
          this.dispatchEvent(
            new CustomEvent("toastmessage", {
              detail: {
                errormsg: "error",
                message:"Select at least one trip to export"
              } 
            })
          );
        }else{
          let exportSelectedData = [];
          var checkbox = this.template.querySelectorAll(
            ".checkboxCheckUncheckSearch"
          );
          
          if (this.MilegesData.length != 0) {
            var i,exportTripData = [],j = checkbox.length;
            for (i = 0; i < j; i++) {
              if (checkbox[i].checked == true) {
                let StayTime = this.MilegesData[i].StayTime== undefined ? 0 : parseFloat(this.MilegesData[i].StayTime);
                let Drivetime = this.MilegesData[i].DriveTime == undefined ? 0 : parseFloat(this.MilegesData[i].DriveTime);
                let totaltime = StayTime + Drivetime;
                console.log("totaltime",totaltime)
                exportTripData.push({Driver:this.MilegesData[i].DriverName , Email:this.MilegesData[i].EmailID,Status:this.MilegesData[i].Status,TripDate:this.MilegesData[i].Date,
                                    Day:this.MilegesData[i].weekday == undefined ? '' : this.MilegesData[i].weekday,
                                    Starttime:this.MilegesData[i].StartTime == undefined ? '' : this.MilegesData[i].StartTime,
                                    EndTime:this.MilegesData[i].EndTime == undefined ? '' : this.MilegesData[i].EndTime,
                                    StayTime:this.MilegesData[i].StayTime== undefined ? '' : this.MilegesData[i].StayTime,
                                    Drivetime:this.MilegesData[i].DriveTime == undefined ? '' : this.MilegesData[i].DriveTime,
                                    totaltime:totaltime,
                                    Activity:this.MilegesData[i].Activity == undefined ? '' : this.MilegesData[i].Activity,
                                    Mileges:this.MilegesData[i].Mileges == undefined ? 0 : this.MilegesData[i].Mileges,
                                    from: this.MilegesData[i].FromName == undefined ? '' : this.MilegesData[i].FromName,
                                    Triporigion:this.MilegesData[i].Triporigion == undefined ? '' : this.MilegesData[i].Triporigion,
                                    to:this.MilegesData[i].ToName == undefined ? '' : this.MilegesData[i].ToName,
                                    Toorigion:this.MilegesData[i].Toorigion == undefined ? '' : this.MilegesData[i].Toorigion,
                                    state:this.MilegesData[i].State == undefined ? '' : this.MilegesData[i].State,
                                    tags:this.MilegesData[i].Tags == undefined ? '' : this.MilegesData[i].Tags,
                                    notes:this.MilegesData[i].Notes == undefined ? '' : this.MilegesData[i].Notes,
                                    trackingmethod:this.MilegesData[i].TrackingStyle == undefined ? '' : this.MilegesData[i].TrackingStyle});
              }
            }
          } 
          if(exportTripData.length != 0){
            this.xlsFormatter(exportTripData);
            exportTripData = [];
          }
        }
      }  
    }
    async handledownloadCSV(){
      let fdate = this.template.querySelector(`.date-selector[data-id="from_date"]`).value;
      let todate = this.template.querySelector(`.date-selector[data-id="to_date"]`).value;
      let exportList = await this.exportExcelByDateRange();
      if (exportList) {
             let rowEnd = '\n';
             let csvString = '';
             let regExp = /^[0-9/]*$/gm;
             let regExpForTime = /^[0-9:\sAM|PM]*$/gm
             let decimalExp = /^(\d*\.)?\d+$/gm
             // this set elminates the duplicates if have any duplicate keys
             let rowData = new Set();
             let csvdata = exportList;
             csvdata.forEach(function (record) {
               Object.keys(record).forEach(function (key) {
                 rowData.add(key);
               });
             });
             rowData = Array.from(rowData);
             
             csvString += rowData.join(',');
             csvString += rowEnd;
 
             var i = 0;
             for(let i=0; i < csvdata.length; i++){
               let colVal = 0;
               // validating keys in data
               for(let key in rowData) {
                   if(rowData.hasOwnProperty(key)) {
                       let rowKey = rowData[key];
                       if(colVal > 0){
                           csvString += ',';
                       }
                       // If the column is undefined, it as blank in the CSV file.
                       let value = csvdata[i][rowKey] === undefined ? '' : csvdata[i][rowKey];
                       if (value != null || value != '') {
                         if (value.match) {
                           if (value.match(regExp) || value.match(regExpForTime) || value.match(decimalExp)) {
                             csvString += '="' + value + '"';
                           } else {
                             csvString += '"' + value + '"';
                           }
                         } else {
                           csvString += '"' + value + '"';
                         }
                       } else {
                         csvString += '"' + value + '"';
                       }
                   }
                   colVal++;
               }
               csvString += rowEnd;
               console.log("csvString",csvString)
             }
             /* Updated change on 27-09-2021 */
             var universalBOM = "\uFEFF";
             var a = window.document.createElement('a');
             a.setAttribute('href', 'data:text/csv; charset=utf-8,' + encodeURIComponent(universalBOM+csvString));
             a.setAttribute('target', '_self');
             a.setAttribute('download',  'all_trips_' + fdate + '_to_' + todate + '.csv')
             window.document.body.appendChild(a);
             a.click();
         }else{
           setTimeout(() => {
             this.dispatchEvent(
               new CustomEvent("toastmessage", {
                 detail: {
                   errormsg: "error",
                   message:"No data found for this date range."
                 } 
               })
             );
           }, 2000);
         }
      
      this.handleexportcloseModal()
     
   }
   async exportExcelByDateRange() {
    try {
      const accidparavalue  = this.getUrlParamValue(window.location.href, 'accid')
       const idparavalue  = this.getUrlParamValue(window.location.href, 'id')
       let fdate = this.template.querySelector(`.date-selector[data-id="from_date"]`).value;
       let todate = this.template.querySelector(`.date-selector[data-id="to_date"]`).value;
       
       let convertFromDate = excelFormatDate(fdate);
       let convertToDate = excelFormatDate(todate);
      let resData = await mileageListData({
        accId: accidparavalue,
        adminId: idparavalue,
        startDate: convertFromDate,
        endDate: convertToDate
      });
      console.log("response->", resData);
      var exportCSV = [];
      if (resData.length > 0) {
        this.isExcelEmpty = false;
        exportCSV = formatData(resData);
        this.csvExportData = exportCSV;
        //  console.log("response csv->", exportCSV);
        if (this.csvExportData.length != 0) {
          this.csvFiledata = changeKeyObjects(this.csvExportData);
        }
       return this.csvFiledata;
      } else {
        this.isExcelEmpty = true;
      }
    } catch (error) {
      console.log("Error while exporting list ", error);
    }
  }
    handleexportcloseModal(){
      if (this.template.querySelector('c-user-profile-modal')) {
        this.template.querySelector('c-user-profile-modal[data-id="export_trip"]').hide();
      }
    }
    handleButtonClick(){
        this.advancesearch = true;
    }
    handleclosesearch(){
      this.advancesearch = false;
      // this.id = event.detail.accountId;
      // this.AdminId = event.detail.AdminId;
      // this.searchDriver = '';
      this.selectedDriver = '';
      this.StartDate = null;
      this.EndDate = null;
      this.OriginName = '';
      this.DestinationName = '';
      // this.ActiveDriver = event.detail.ActiveDriver;
      this.StartMileage = '';
      this.EndMileage = '';
      this.searchStatus = 'All Status';
      this.filterdriver = '';
          this.selectedStatus = 'All Status';
          this.advanceSearchdata = false;
          var makeDate = new Date();
          makeDate.setMonth(makeDate.getMonth()-1);
          var lastmonth = makeDate.toLocaleString('default', { month: 	'long' });
          this.selectedmonthlist = lastmonth;
          this.monthfilter = lastmonth;
          this.template.querySelector('c-dropdown-select[data-id="month"]').selection()
          this.template.querySelector('c-dropdown-select[data-id="month"]').toggleSelectedValue(lastmonth);
          this.template.querySelector('c-dropdown-select[data-id="Status"]').selection()
          this.template.querySelector('c-dropdown-select[data-id="Status"]').toggleSelectedValue('All Status');
          this.template.querySelector('c-dropdown-select[data-id="Drivers"]').selection()
          this.template.querySelector('c-dropdown-select[data-id="Drivers"]').toggleSelectedValue('All Active Users') ;
          this.template.querySelector('c-dropdown-select[data-id="Types"]').selection()
          this.template.querySelector('c-dropdown-select[data-id="Types"]').toggleSelectedValue('All Types') ;
          this.template.querySelector('c-dropdown-select[data-id="Types"]').selectedValue = 'All Types';
          const accidparavalue  = this.getUrlParamValue(window.location.href, 'accid')
          const idparavalue  = this.getUrlParamValue(window.location.href, 'id')
          fetchMileagesSize({accID:accidparavalue, adminId:idparavalue})
          .then((result) => {
            if(result > 2000){
              this.limitSize = 2000;
              this.totalrows = 2000;
             }else{
              this.limitSize = result;
              this.totalrows = result;
             }
              if(this.template.querySelector('c-new-paginator')){
                this.template.querySelector('c-new-paginator').updateRecords(this.limitSize  , this.pageSize)
              } 
              fetchMileages({accID : accidparavalue,AdminId: idparavalue,limitSize : this.pageSize,offset : 0})
              .then((acc) => {
                let accresult2 = JSON.stringify(acc)
                this.getmilegeslist(accresult2);
               
              })
              .catch((error) => {
                console.log(error)
              });
              
              setTimeout(() => {
                this.dispatchEvent(
                  new CustomEvent("hideloader", { detail : ''})
                );
              },2000); 
          })
          .catch((error) => {
            console.log("relod",error)
          })
    }
     // Send formatted excel data to child component 'c-excel-sheet'
  xlsFormatter(data) {
    let Header = Object.keys(data[0]);
    
      Header[0] = "Driver";
      Header[1] = "Email";
      Header[2] = "Status";
      Header[3] = "Date";
      Header[4] = "Day";
      Header[5] = "Start Time";
      Header[6] = "End Time";
      Header[7] = "Stay Time";
      Header[8] = "Drive Time";
      Header[9] = "Total Time";
      Header[10] = "Activity";
      Header[11] = "Mileage (mi)";
      Header[12] = "From Location Name";
      Header[13] = "From Location Address";
      Header[14] = "To Location Name";
      Header[15] = "To Location Address";
      Header[16] = "State";
      Header[17] = "Tags";
      Header[18] = "Notes";
      Header[19] = "Tracking Method";
    
    if(this.xlsHeader.length > 0){
      this.xlsHeader = [];
      this.xlsHeader.push(Header);
    }else{
      this.xlsHeader.push(Header);
    }
    if(this.xlsData.length > 0){
      this.xlsData = [];
      this.xlsData.push(data);
    }else{
      this.xlsData.push(data);
    }
    
    console.log("this.xlsData",JSON.stringify(this.xlsData))
    this.template.querySelector("c-excel-sheet").download(this.xlsHeader, this.xlsData);
  }
 
  intializeDatepickup(){
    let $jq = jQuery.noConflict();
    let $input =  $jq(this.template.querySelectorAll('.date-selector'));
    let _self = this;
    $input.each(function(index) {
      console.log("index",index)
          let _self2 =  $jq(this)
          let $btn =  $jq(this).next()
          console.log("this",this)
          $jq(this).datepicker({

            // inline mode
            inline: false,

            // additional CSS class
            classes: 'flatpickr-cal',

            // language
            language: 'en',

            // start date
            startDate: new Date(),
            //selectedDates: new Date(),
            
            // array of day's indexes
            weekends: [6, 0],

            // custom date format
            dateFormat:'mm/dd/yy',

            // Alternative text input. Use altFieldDateFormat for date formatting.
            altField: '',

            // Date format for alternative field.
            altFieldDateFormat: '@',

            // remove selection when clicking on selected cell
            toggleSelected: false,

            // keyboard navigation
            keyboardNav: false,

            // position
            position: 'bottom left',
            offset: 12,

            // days, months or years
            view: 'days',
            minView: 'days',
            showOtherMonths: true,
            selectOtherMonths: true,
            moveToOtherMonthsOnSelect: true,

            showOtherYears: true,
            selectOtherYears: true,
            moveToOtherYearsOnSelect: true,

            minDate: '',
            maxDate: '',
            disableNavWhenOutOfRange: true,

            multipleDates: false, // Boolean or Number
            multipleDatesSeparator: ',',
            range: false,
            isMobile: false,
            // display today button
            todayButton: new Date(),

            // display clear button
            clearButton: false,
            
            // Event type
            showEvent: 'focus',

            // auto close after date selection
            autoClose: true,

            // navigation
            monthsFiled: 'monthsShort',
            prevHtml: '<svg><path d="M 17,12 l -5,5 l 5,5"></path></svg>',
            nextHtml: '<svg><path d="M 14,12 l 5,5 l -5,5"></path></svg>',
            navTitles: {
                days: 'M <i>yyyy</i>',
                months: 'yyyy',
                years: 'yyyy1 - yyyy2'
            },
            
            // timepicker
            datepicker: true,
            timepicker: false,
            onlyTimepicker: false,
            dateTimeSeparator: ' ',
            timeFormat: '',
            minHours: 0,
            maxHours: 24,
            minMinutes: 0,
            maxMinutes: 59,
            hoursStep: 1,
            minutesStep: 1,
            // callback events
            onSelect: function(date, formattedDate, datepicker){
                console.log('explain:', date, formattedDate, datepicker, _self2.val());
                console.log('selected date', date);
               
            },
            onShow: function (dp, animationCompleted) {
              console.log('selected date');
              if (!animationCompleted) {
                if (dp.$datepicker.find('span.datepicker--close--button').html()===undefined) { /*ONLY when button don't existis*/
                    dp.$datepicker.find('div.datepicker--buttons').append('<span  class="datepicker--close--button">Close</span>');
                    dp.$datepicker.find('span.datepicker--close--button').click(function() {
                      dp.hide();
                      console.log('onshow');
                    });
                }
              }
            },
            // onShow: '',
            onHide: '',
            onChangeMonth: '',
            onChangeYear: '',
            onChangeDecade: '',
            onChangeView: '',
            // eslint-disable-next-line consistent-return
            onRenderCell: function(date){
                if (date.getDay() === 0) {
                      return {
                          classes: 'color-weekend-sunday'
                      }
                }
                  if (date.getDay() === 6) {
                      return {
                          classes: 'color-weekend-saturday'
                      }
                }
            }
          })//.data('datepicker').selectDate(new Date(_self2.val()))
          $btn.on('click', function(){
            console.log('btnon');
            _self2.datepicker({showEvent: 'none'}).data('datepicker').show();
            _self2.focus();
          });
    })
  }

  
  handlefilterdata(event){
    this.dispatchEvent(
      new CustomEvent("showloader", { detail :{ message: 'Please wait while we load your data'}})
    );
        this.MilegesData = [];
        this.totalmileage = 0.00;
        this.totalrows = 0;
        this.headershow = false;
        // this.pagination = false;
        // this.celenderdropdown = false;
        this.searchDataLength = false;
        this.id = event.detail.accountId;
        this.AdminId = event.detail.AdminId;
        this.searchDriver = event.detail.idOfDriver;
        this.StartDate = event.detail.StartDate;
        this.EndDate = event.detail.EndDate;
        this.OriginName = event.detail.OriginName;
        this.DestinationName = event.detail.DestinationName;
        this.ActiveDriver = event.detail.ActiveDriver;
        this.StartMileage = event.detail.StartMileage;
        this.EndMileage = event.detail.EndMileage;
        this.searchStatus = event.detail.TripStatus;
        this.Status = '';
        this.filterdriver = '';
        this.template.querySelector('c-dropdown-select[data-id="Status"]').selection()
        
        if(this.searchStatus){
          this.template.querySelector('c-dropdown-select[data-id="Status"]').toggleSelectedValue(this.searchStatus);
        }else{
          this.template.querySelector('c-dropdown-select[data-id="Status"]').toggleSelectedValue('All Status');
        }

       
          if(this.searchDriver){
            for(let i = 0;i<this.driverList.length;i++){
              if(this.driverList[i].value == this.searchDriver){
                this.selectDriver = this.driverList[i].label;
                this.searchDriver = this.driverList[i].value;
              }
            }
          }else{
            this.searchDriver = 'All Drivers';
          }
       
       
        this.TrackingMethod = event.detail.TrackingMethod;
        this.Tag = event.detail.Tag;
        this.remmonth = null;
        if(this.StartDate == null){
          this.StartDate = null;
          this.EndDate = null;
        }
        getMilegesDataSize({
          accountId: this.id,
          AdminId: this.AdminId,
          idOfDriver: this.searchDriver,
          StartDate: this.StartDate,
          EndDate: this.EndDate,
          OriginName: this.OriginName,
          DestinationName: this.DestinationName,
          ActiveDriver: this.ActiveDriver,
          StartMileage: this.StartMileage,
          EndMileage: this.EndMileage,
          TripStatus: this.searchStatus,
          TrackingMethod: this.TrackingMethod,
          Tag:  this.Tag ,
          Notes: null,
          Activity: null,
          reimMonth:null,
          highRisk: false
      })
      .then((result) => {
          this.limitSize = result;
          this.totalrows = result;
          this.advanceSearchdata = true;
          if(this.template.querySelector('c-new-paginator')){
            this.template.querySelector('c-new-paginator').updateRecords(this.totalrows , this.pageSize)
          } 
         
          this.getmileagesData(this.id , this.AdminId , this.searchDriver , this.StartDate , this.EndDate , this.OriginName , this.DestinationName , this.ActiveDriver , this.StartMileage , this.EndMileage,
            this.searchStatus , this.TrackingMethod , this.Tag  , this.pageSize , 0,null,false)
          setTimeout(() => {
            this.dispatchEvent(
              new CustomEvent("hideloader", { detail : ''})
            );
          },2000); 
      }) 
      .catch((error) => {
        console.log(error)
      });
  }
 
  getmileagesData(accid ,adminid,driver,startdate,enddate,originname,destinationname,active,frommilege,tomilege,status,trackingmethod,tag,limit,offset,remmonth,highrisk){
    getMilegesData({
      accountId: accid,
        AdminId: adminid,
        idOfDriver: driver,
        StartDate: startdate,
        EndDate: enddate,
        OriginName: originname,
        DestinationName: destinationname,
        ActiveDriver: active,
        StartMileage: frommilege,
        EndMileage: tomilege,
        TripStatus: status,
        TrackingMethod: trackingmethod,
        Tag:  tag ,
        Notes: null,
        Activity: null,
        limitSize: limit,
        offset: offset,
        reimMonth:remmonth,
        highRisk:highrisk
    })
    .then((result) => {
        let accresult = JSON.stringify(result)
        console.log('accresult',accresult)
        if(accresult.length > 0){
          this.getmilegeslist(accresult);
        }else{
          this.totalmileage = 0.00;
        }
    })
    .catch((error) => {
      console.log("advance search",error)
    });
  }
  handleToastMessage(event){
    this.dispatchEvent(
      new CustomEvent("toastmessage", {
        detail: {
          errormsg: "error",
          message:event.detail
        } 
      })
    );
  }
  handlemousedown(event) {
      event.preventDefault();
  }

  handlemonthchange(event){
    this.norecordMessagenew = '';
    this.dispatchEvent(
      new CustomEvent("showloader", { detail :{ message: 'Please wait while we load your data'}})
    );
    this.advanceSearchdata = true;
    this.monthfilter = event.detail.value;
    if(this.filterdriver){
      this.idOfDriver = this.filterdriver;
    }else if(this.searchDriver){
      this.idOfDriver = this.searchDriver;
    }else{
      this.idOfDriver = '';
    }
    if(this.highrisk == true){
      this.highrisk = true;
    }else{
      this.highrisk = false;
    }
   
    if(this.monthfilter == "Month"){
      this.StartDate = null;
      this.EndDate = null;
      this.remmonth= null;
      console.log("driver",this.filterdriver+'---'+this.StartDate+'-----'+this.EndDate+'---'+this.remmonth)
      this.handlefilterbydropdown(this.idOfDriver,this.StartDate,this.EndDate, this.OriginName,this.DestinationName,this.ActiveDriver,this.StartMileage,this.EndMileage,this.TripStatus,this.TrackingMethod,this.Tag,this.remmonth,this.highrisk);
      // this.showlimittoast();
    }else{
      // Get the month number (0-indexed)
        const date = new Date(`${this.monthfilter} 1`);
        var monthNumber = date.getMonth() + 1;
        if(monthNumber < 9){
          monthNumber = '0'+monthNumber;
        }
        var lastDate = this.getLastDateOfMonth(monthNumber)
        this.remmonth = this.monthfilter;
        var year = new Date().toLocaleDateString('en', {year: '2-digit'})
        // 2023-07-06
        let convertFromDate = monthNumber +'/01/'+ year
        let convertToDate = monthNumber +'/'+lastDate+'/'+ year
        this.StartDate = excelFormatDate(convertFromDate);
        this.EndDate = excelFormatDate(convertToDate);
        console.log("this.EndDate",this.EndDate)
    }
    if(this.advanceSearchdata == false){
      this.advanceSearchdata = true;
      if(this.OriginName){this.OriginName = this.OriginName;}else{this.OriginName = null;} 
      if(this.DestinationName){this.DestinationName = this.DestinationName;}else{this.DestinationName = null;} 
      if(this.ActiveDriver){this.ActiveDriver = this.ActiveDriver;}else{this.ActiveDriver = true;} 
      if(this.StartMileage){this.StartMileage = this.StartMileage;}else{this.StartMileage = '';} 
      if(this.EndMileage){this.EndMileage = this.EndMileage;}else{this.EndMileage = '';} 
      if(this.TrackingMethod){this.TrackingMethod = this.TrackingMethod;}else{this.TrackingMethod = null;} 
      if(this.Tag){this.Tag = this.Tag;}else{this.Tag = null;} 
    }
        console.log("driver",this.filterdriver+'---'+this.StartDate+'-----'+this.EndDate+'---'+this.remmonth)
       this.handlefilterbydropdown(this.idOfDriver,this.StartDate,this.EndDate, this.OriginName,this.DestinationName,this.ActiveDriver,this.StartMileage,this.EndMileage,this.TripStatus,this.TrackingMethod,this.Tag,this.remmonth,this.highrisk);
      //  this.showlimittoast();
  }

  handleTypechange(event){
    this.norecordMessagenew = '';
    this.dispatchEvent(
      new CustomEvent("showloader", { detail :{ message: 'Please wait while we load your data'}})
    );
    // this.advanceSearchdata = true;
    let type = event.detail.value;
    if(type == "All Types"){
      this.highrisk = false;
      var makeDate = new Date();
      if(this.StartDate == null){
        let monthNumber = makeDate.getMonth()+1;
        var year = new Date().toLocaleDateString('en', {year: '2-digit'})
        var lastDate = this.getLastDateOfMonth(monthNumber)
        let convertFromDate = monthNumber +'/01/'+ year
        let convertToDate = monthNumber +'/'+lastDate+'/'+ year
        this.StartDate = excelFormatDate(convertFromDate);
        this.EndDate = excelFormatDate(convertToDate);
      }
      
      makeDate.setMonth(makeDate.getMonth()+1);
      let lastmonth = makeDate.toLocaleString('default', { month: 	'long' });

      if(this.monthfilter){
        if(this.monthfilter == 'Month'){
          this.remmonth = null;
          this.StartDate = null;
          this.EndDate = null;
        }else{
          this.remmonth = this.monthfilter;
        }
      }else{
        this.remmonth = lastmonth;
      }
     console.log("this.remmonth",this.remmonth+'---'+this.monthfilter)
      this.handlefilterbydropdown(this.filterdriver,this.StartDate,this.EndDate, this.OriginName,this.DestinationName,this.ActiveDriver,this.StartMileage,this.EndMileage,this.Status,this.TrackingMethod,this.Tag,this.remmonth,this.highrisk);
      // this.showlimittoast();
    }else{
      this.highrisk = true;
      var makeDate = new Date();
      if(this.StartDate == null){
        let monthNumber = makeDate.getMonth();
        var year = new Date().toLocaleDateString('en', {year: '2-digit'})
        var lastDate = this.getLastDateOfMonth(monthNumber)
        let convertFromDate = monthNumber +'/01/'+ year
        let convertToDate = monthNumber +'/'+lastDate+'/'+ year
        this.StartDate = excelFormatDate(convertFromDate);
        this.EndDate = excelFormatDate(convertToDate);
      }
      
      makeDate.setMonth(makeDate.getMonth()-1);
      let lastmonth = makeDate.toLocaleString('default', { month: 	'long' });
  
      if(this.monthfilter){
        if(this.monthfilter == 'Month'){
          this.remmonth = null;
          this.StartDate = null;
          this.EndDate = null;
        }else{
          this.remmonth = this.monthfilter;
        }
      }else{
        this.remmonth = lastmonth;
      }
     console.log("this.remmonth",this.remmonth+'---'+this.StartDate+'----'+this.EndDate)

      this.handlefilterbydropdown(this.filterdriver,this.StartDate,this.EndDate, this.OriginName,this.DestinationName,this.ActiveDriver,this.StartMileage,this.EndMileage,this.Status,this.TrackingMethod,this.Tag,this.remmonth,this.highrisk);
   
    }
  }
 
  handledriverchange(event){
    this.norecordMessagenew = '';
    this.dispatchEvent(
      new CustomEvent("showloader", { detail :{ message: 'Please wait while we load your data'}})
    );
    this.filterdriver = event.detail.value;
    this.selectedDriver = event.detail.value;
    if(this.highrisk == true){
      this.highrisk = true;
    }else{
      this.highrisk = false;
    }
    console.log("driver")

    if(this.filterdriver == "All Active Users"){
      this.filterdriver = 'All Drivers'
      this.selectedDriver= 'All Drivers'
    }else{
      if(this.filterdriver){
        for(let i = 0;i<this.driverList.length;i++){
          if(this.driverList[i].label == this.filterdriver){
            this.filterdriver = this.driverList[i].value;
           
          }
        }
      }else{
        this.filterdriver = '';
      }
    }
    this.searchDriver = '';
    if(this.filterdriver){
      this.idOfDriver = this.filterdriver;
    }else if(this.searchDriver){
      this.idOfDriver = this.searchDriver;
    }else{
      this.idOfDriver = '';
    }
    console.log("driver")

    if(this.advanceSearchdata == false){
      this.advanceSearchdata = true;
      if(this.OriginName){this.OriginName = this.OriginName;}else{this.OriginName = null;} 
      if(this.DestinationName){this.DestinationName = this.DestinationName;}else{this.DestinationName = null;} 
      if(this.ActiveDriver){this.ActiveDriver = this.ActiveDriver;}else{this.ActiveDriver = true;} 
      if(this.StartMileage){this.StartMileage = this.StartMileage;}else{this.StartMileage = '';} 
      if(this.EndMileage){this.EndMileage = this.EndMileage;}else{this.EndMileage = '';} 
      if(this.TrackingMethod){this.TrackingMethod = this.TrackingMethod;}else{this.TrackingMethod = null;} 
      if(this.Tag){this.Tag = this.Tag;}else{this.Tag = null;} 
    }
    console.log("driver")
    var makeDate = new Date();
    if(this.StartDate == null){
      let monthNumber = makeDate.getMonth();
      var year = new Date().toLocaleDateString('en', {year: '2-digit'})
      var lastDate = this.getLastDateOfMonth(monthNumber)
      let convertFromDate = monthNumber +'/01/'+ year
      let convertToDate = monthNumber +'/'+lastDate+'/'+ year
      this.StartDate = excelFormatDate(convertFromDate);
      this.EndDate = excelFormatDate(convertToDate);
    }
    
    makeDate.setMonth(makeDate.getMonth()-1);
    let lastmonth = makeDate.toLocaleString('default', { month: 	'long' });

    if(this.monthfilter){
      if(this.monthfilter == 'Month'){
        this.remmonth = null;
        this.StartDate = null;
        this.EndDate = null;
      }else{
        this.remmonth = this.monthfilter;
      }
    }else{
      this.remmonth = lastmonth;
    }
    console.log("driver",this.filterdriver+'---'+this.StartDate+'-----'+this.EndDate+'---'+this.remmonth)
    this.handlefilterbydropdown(this.filterdriver,this.StartDate,this.EndDate, this.OriginName,this.DestinationName,this.ActiveDriver,this.StartMileage,this.EndMileage,this.Status,this.TrackingMethod,this.Tag,this.remmonth,this.highrisk);
 }  
  
  handlestatuschange(event){
    this.norecordMessagenew = '';
    this.dispatchEvent(
      new CustomEvent("showloader", { detail :{ message: 'Please wait while we load your data'}})
    );
      this.searchStatus = '';
      if(this.filterdriver){
        this.idOfDriver = this.filterdriver;
      }else if(this.searchDriver){
        this.idOfDriver = this.searchDriver;
      }else{
        this.idOfDriver = '';
      }
      if(this.highrisk == true){
        this.highrisk = true;
      }else{
        this.highrisk = false;
      }
      this.Status = event.detail.value;
      this.selectedStatus = event.detail.value;
      console.log("this.StartDate",this.Status)
      if(this.advanceSearchdata == false){
        this.advanceSearchdata = true;
        if(this.OriginName){this.OriginName = this.OriginName;}else{this.OriginName = null;} 
        if(this.DestinationName){this.DestinationName = this.DestinationName;}else{this.DestinationName = null;} 
        if(this.ActiveDriver){this.ActiveDriver = this.ActiveDriver;}else{this.ActiveDriver = true;} 
        if(this.StartMileage){this.StartMileage = this.StartMileage;}else{this.StartMileage = '';} 
        if(this.EndMileage){this.EndMileage = this.EndMileage;}else{this.EndMileage = '';} 
        if(this.TrackingMethod){this.TrackingMethod = this.TrackingMethod;}else{this.TrackingMethod = null;} 
        if(this.Tag){this.Tag = this.Tag;}else{this.Tag = null;} 
      }
      console.log("this.StartDate",this.Status)
      var makeDate = new Date();
      if(this.StartDate == null){
        let monthNumber = makeDate.getMonth();
        var year = new Date().toLocaleDateString('en', {year: '2-digit'})
        var lastDate = this.getLastDateOfMonth(monthNumber)
        let convertFromDate = monthNumber +'/01/'+ year
        let convertToDate = monthNumber +'/'+lastDate+'/'+ year
        this.StartDate = excelFormatDate(convertFromDate);
        this.EndDate = excelFormatDate(convertToDate);
      }
     
      makeDate.setMonth(makeDate.getMonth()-1);
      let lastmonth = makeDate.toLocaleString('default', { month: 	'long' });
      console.log("this.monthfilter",this.monthfilter)
      if(this.monthfilter){
        if(this.monthfilter == 'Month'){
          this.remmonth = null;
          this.StartDate = null;
          this.EndDate = null;
        }else{
          this.remmonth = this.monthfilter;
        }
      }else{
        this.remmonth = lastmonth;
      }
      
      console.log("driver",this.filterdriver+'---'+this.StartDate+'-----'+this.EndDate+'---'+this.remmonth)
      this.handlefilterbydropdown(this.idOfDriver,this.StartDate,this.EndDate, this.OriginName,this.DestinationName,this.ActiveDriver,this.StartMileage,this.EndMileage,this.Status,this.TrackingMethod,this.Tag,this.remmonth,this.highrisk);
  }  

  handlefilterbydropdown(idofdriver , StartDate , EndDate,OriginName,DestinationName,ActiveDriver,StartMileage,EndMileage,TripStatus,TrackingMethod,Tag,remMonth,highrisk){
      getMilegesDataSize({
        accountId: this._accid,
        AdminId: this._adminid,
        idOfDriver: idofdriver,
        StartDate: StartDate,
        EndDate: EndDate,
        OriginName: OriginName,
        DestinationName: DestinationName,
        ActiveDriver: ActiveDriver,
        StartMileage: StartMileage,
        EndMileage: EndMileage,
        TripStatus: TripStatus,
        TrackingMethod: TrackingMethod,
        Tag:  Tag ,
        Notes: null,
        Activity: null,
        reimMonth:remMonth,
        highRisk:highrisk
      })
      .then((result) => {
        console.log("limitsize for filter",result , this.pageSize)
        // if(result > 2000){
        //   this.limitSize = 2000;
        //   this.totalrows = 2000;
        //  }else{
          this.limitSize = result;
          this.totalrows = result;
        //  }
          // this.pagination = true;
          this.advanceSearchdata = true;
          if(this.template.querySelector('c-new-paginator')){
            this.template.querySelector('c-new-paginator').updateRecords(this.totalrows , this.pageSize)
          } 
          this.getmileagesData(this._accid , this._adminid , idofdriver , StartDate , EndDate,OriginName,DestinationName,ActiveDriver,StartMileage,EndMileage,TripStatus,TrackingMethod,Tag , this.pageSize , 0,remMonth,highrisk)
         
          setTimeout(() => {
            this.dispatchEvent(
              new CustomEvent("hideloader", { detail : ''})
            );
          },2000);
          // this.showlimittoast();
      }) 
      .catch((error) => {
        console.log(error)
      });
  }
  getLastDateOfMonth(monthNumber) {
    // Ensure the month number is between 1 and 12
    monthNumber = Math.max(1, Math.min(12, monthNumber));
  
    // Create a Date object for the next month's first day
    var nextMonthDate = new Date();
    nextMonthDate.setMonth(monthNumber);
  
    // Subtract one day from the next month's first day to get the last day of the current month
    nextMonthDate.setDate(0);
  
    // Return the date of the last day of the current month
    return nextMonthDate.getDate();
  }
  removeDuplicateValue(myArray) {
    var newArray = [];
    myArray.forEach((value) => {
        var exists = false;
        newArray.forEach((val2) => {
            if (value === val2) {
                exists = true;
            }
        })

        if (exists === false && value !== "") {
            newArray.push(value);
        }
    })

    return newArray;
  }

  review(a) {
    if (a) {
      let monthA = a,
        array = [];
      for (let i = 0; i < monthA.length; i++) {
        let obj = {};
        obj.id = i + 1;
        obj.label = monthA[i];
        obj.value = monthA[i];
        array.push(obj);
      }

      return JSON.stringify(array);
    }
    return a;
  }
  proxyToObject(e) {
    return JSON.parse(e);
  }
  handleEscKey(event) {
    if (event.key === 'Escape') {
        // Close the modal when "Escape" key is pressed
        this.handleCloseModal();
    }
  }

  showlimittoast(){
    if(this.limitSize > 2000){
      this.dispatchEvent(
        new CustomEvent("toastmessage", {
          detail: {
              errormsg: "info",
              message:SALESFORCE_LIMIT_MSG
          } 
        })
      )
     }
  }
 
}