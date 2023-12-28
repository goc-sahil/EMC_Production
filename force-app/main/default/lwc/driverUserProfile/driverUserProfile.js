/* eslint-disable @lwc/lwc/no-async-operation */
import { LightningElement, api, wire } from 'lwc';
import carImage from '@salesforce/resourceUrl/EmcCSS';
import resourceImage from '@salesforce/resourceUrl/mBurseCss';
import getDriverDetails  from '@salesforce/apex/DriverDashboardLWCController.getDriverDetails';
import getReimbursementData from '@salesforce/apex/DriverDashboardLWCController.getReimbursementData';
import getMileages from "@salesforce/apex/DriverDashboardLWCController.getMileages";
import getGasPriceandRate from "@salesforce/apex/DriverDashboardLWCController.getGasPriceandRate";
import getAllReimbursements from "@salesforce/apex/DriverDashboardLWCController.getAllReimbursements";
import getDrivingState  from '@salesforce/apex/DriverDashboardLWCController.getDrivingState';
import canadaStates from '@salesforce/label/c.canada_driving_states';
import usaDrivingStates from '@salesforce/label/c.usa_driving_states';
import {
    events
} from 'c/utils';

export default class DriverUserProfile extends LightningElement {
    profileCarImage = carImage + '/emc-design/assets/images/car.png';
    milesIcon = resourceImage + '/mburse/assets/mBurse-Icons/Middle-block/1.png';
    moneyIcon = resourceImage + '/mburse/assets/mBurse-Icons/Middle-block/2.png';
    variableRateIcon = resourceImage + '/mburse/assets/mBurse-Icons/Middle-block/3.png';
    fuelIcon = resourceImage + '/mburse/assets/mBurse-Icons/Middle-block/4.png';
    maginifyIcon = resourceImage + '/mburse/assets/mBurse-Icons/Middle-block/5.png';
    umbrellaIcon = resourceImage + '/mburse/assets/mBurse-Icons/Plan-Parameters/6.png';
    milesPlanIcon = resourceImage + '/mburse/assets/mBurse-Icons/Plan-Parameters/7.png';
    calendarPlanIcon = resourceImage + '/mburse/assets/mBurse-Icons/Plan-Parameters/8.png';
    carPlanIcon = resourceImage + '/mburse/assets/mBurse-Icons/Plan-Parameters/9.png';
    insurancePlanIcon = resourceImage + '/mburse/assets/mBurse-Icons/Plan-Parameters/10.png';
    searchIcon = resourceImage + '/mburse/assets/mBurse-Icons/Vector.png';
    flagIcon = resourceImage + '/mburse/assets/Vector.png';
    flagRejectIcon = resourceImage + '/mburse/assets/mBurse-Icons/Tooltip/flag.png';
    unapproveIcon = resourceImage + '/mburse/assets/mBurse-Icons/Tooltip/unapprove.png';
    approveIcon = resourceImage + '/mburse/assets/mBurse-Icons/Tooltip/approve.png';
    checkMark = resourceImage + '/mburse/assets/mBurse-Icons/check.png';
    crossMark = resourceImage + '/mburse/assets/mBurse-Icons/Cross.png';
    circle = resourceImage + '/mburse/assets/mBurse-Icons/Ellipse.png';
    cross = resourceImage + '/mburse/assets/mBurse-Icons/notify-cancel.png';
    error = resourceImage + '/mburse/assets/mBurse-Icons/Error-notify.png';
    @api isNotify;
    @api notifyMessageList;
    @api notifyMessage;
    @api reimbursementYtd;
    @api excelYtd;
    headerModalText = '';
    ytd = false;
    checkAll = false;
    typeMap = 'USA';
    mapCountry = '';
    biweekYtd = false;
    modalLength = false;
    multipleMap = false;
    startNumber = 0;
    endNumber = 100;
    progress = 0;
    progressPercent = 0;
    messageForNextBatch = "";
    modalStyle = '';
    headerText = '';
    monthText = '';
    lastMonth = '';
    subTitle = '';
    thisMonth = '';
    vehicleType = '';
    planYear = '';
    canadaStatesList = '';
    usaDrivingStates = '';
    usStatesList = '';
    complianceMileage = '';
    vehicleValue = '';
    insurancePlan = '';
    complianceStatus = '';
    annualMileage = '';
    annualReimbursement = '';
    drivingState_US;
    drivingState_canada;
    templateName = '';
    lastMonthMiles = '';
    thisMonthMiles = '';
    halfFixedAmount = '';
    biweekly = false;
    monthly = false;
    fixedAmount = '';
    variableRate = '';
    monthfuelPrice = '';
    lastMonthMileageRate = '';
    lastMilesZero = '';
    thisMilesZero = '';
    halfFixedZero= '';
    fixedAmountZero = '';
    fuelPriceZero = '';
    mileageRateZero = '';
    year = '';
    address = '';
    vehicleImage;
    chartList;
    contactName;
    colname="name";
    coltype="String";
    sortorder="desc";
    _value = "";
    isSearchEnable = true;
    renderedInitialized = false;
    planInsurance = false;
    planMileage = false;
    planVehicleAge = false;
    planVehicleValue = false;
    planCompliance = false;
    isSortable = false;
    isValid = false;
    isFalse = false;
    isTrue = true;
    isScrollable = true;
    download = true;
    variable = true;
    view = false;
    viewAllNotification = false;
    lastModelList;
    originalModelList;
    modalKeyFields;
    modalListColumn;
    lastMonthColumn = [{
            id: 1,
            name: "Trip date",
            colName: "tripdate",
            colType: "Date",
            arrUp: true,
            arrDown: false
        },
        {
            id: 2,
            name: "Origin",
            colName: "originname",
            colType: "String",
            arrUp: false,
            arrDown: false,
        },
        {
            id: 3,
            name: "Destination",
            colName: "destinationname",
            colType: "String",
            arrUp: false,
            arrDown: false
        },
        {
            id: 4,
            name: "Submitted",
            colName: "submitteddate",
            colType: "Date",
            arrUp: false,
            arrDown: false
        },
        {
            id: 5,
            name: "Approved",
            colName: "approveddate",
            colType: "Date",
            arrUp: false,
            arrDown: false
        },
        {
            id: 6,
            name: "Mileage",
            colName: "mileage",
            colType: "Decimal",
            arrUp: false,
            arrDown: false
        },
        {
            id: 7,
            name: "Variable Amount",
            colName: "variableamount",
            colType: "Decimal",
            arrUp: false,
            arrDown: false
        }
    ];
    lastMonthKeyFields = ["tripdate", "originname", "destinationname", "submitteddate", "approveddate", "mileage", "variableamount"]
    thisMonthColumn = [{
        id: 1,
        name: "Trip date",
        colName: "tripdate",
        colType: "Date",
        arrUp: true,
        arrDown: false
    },
    {
        id: 2,
        name: "Origin",
        colName: "originname",
        colType: "String",
        arrUp: false,
        arrDown: false,
    },
    {
        id: 3,
        name: "Destination",
        colName: "destinationname",
        colType: "String",
        arrUp: false,
        arrDown: false
    },
    {
        id: 4,
        name: "Mileage",
        colName: "mileage",
        colType: "Decimal",
        arrUp: false,
        arrDown: false
    }
    ];
    thisMonthKeyFields = ["tripdate", "originname", "destinationname", "mileage"]
    gasPriceColumn = [{
        id: 1,
        name: "",
        colName: "ReimMonth",
        colType: "String",
        arrUp: false,
        arrDown: false
    },{
            id: 2,
            name: "Gas Prices",
            colName: "fuelPrice",
            colType: "Decimal",
            arrUp: false,
            arrDown: false
        },
        {
            id: 3,
            name: "Mileage Rate",
            colName: "VariableRate",
            colType: "Decimal",
            arrUp: false,
            arrDown: false
        }
    ];
    gasPriceKeyFields = ["ReimMonth", "fuelPrice", "VariableRate"]
    biweekKeyFields = ["month", "variableRate", "mileage","varibleAmount","fixed1","fixed2","fixed3","totalReimbursements", "avgToDate"]
    biweekColumn = [{
        id: 1,
        name: "",
        colName: "month"
    },
    {
        id: 2,
        name: "Mi Rate",
        colName: "variableRate"
    },
    {
        id: 3,
        name: "Mileage",
        colName: "mileage"
    },
    {
        id: 4,
        name: "Variable",
        colName: "varibleAmount"
    },
    {
        id: 5,
        name: "Fixed 1",
        colName: "fixed1"
    },
    {
        id: 6,
        name: "Fixed 2",
        colName: "fixed2"
    },
    {
        id: 7,
        name: "Fixed 3",
        colName: "fixed3"
    },{
        id: 8,
        name: "Total",
        colName: "totalReimbursements"
    },{
        id: 9,
        name: "Avg to Date",
        colName: "avgToDate"
    }
    ]

    monthKeyFields = [
        "month",
        "fuel",
        "mileage",
        "variableRate",
        "varibleAmount",
        "fixedAmount",
        "totalReimbursements",
        "avgToDate"
    ]

    monthColumn = [
        {
          id: 1,
          name: "",
          colName: "month"
        },
        {
          id: 2,
          name: "Fuel",
          colName: "fuel"
        },
        {
          id: 3,
          name: "Mileage",
          colName: "mileage"
        },
        {
          id: 4,
          name: "Mi Rate",
          colName: "variableRate"
        },
        {
          id: 5,
          name: "Variable",
          colName: "varibleAmount"
        },
        {
          id: 6,
          name: "Fixed",
          colName: "fixedAmount"
        },
        {
          id: 7,
          name: "Total",
          colName: "totalReimbursements"
        },{
            id: 8,
            name: "Avg to Date",
            colName: "avgToDate"
        }
    ]
    paginatedModal = false;
    @api sectionClass;
    @api contactId;
    @api accountId;
    @api chartInfo;

    getNumber(num) {
       // if (this.contactDetails) {
        //    if (num != null) {
                return num.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
          //  }
      //  }
    }

    getMonthFromString(mon){
        var d = Date.parse(mon + "1, 2012");
        if(!isNaN(d)){
           return new Date(d).getMonth() + 1;
        }
        return -1;
    }

    currentMonth(){
        const date = new Date();
        var day = date.getDate();
        const formatter = new Intl.DateTimeFormat("default", {
            month: "short"
          });
        let month = formatter.format(
            new Date(date.getFullYear(), date.getMonth())
        );
    
        if(day >= 1 && day < 4 ){
            return month;
        }
    }

    isToday(){
        const date = new Date();
        var day = date.getDate();
        const formatter = new Intl.DateTimeFormat("default", {
            month: "long"
          });
        let prevMonth = formatter.format(
            new Date(date.getFullYear(), date.getMonth() - 1)
        );

        if(day >= 1 && day < 4 ){
            return prevMonth;
        }
        return 'none'
    }

    getMonthName(monthIndex){
        const months = Array.from({length: 12}, (item, i) => {
            return new Date(0, i).toLocaleString('en-US', {month: 'long'})
          });
          
        console.log(months, months[monthIndex]);
        return  months[monthIndex]
    }

    proxyToObject(e) {
        return JSON.parse(e)
    }

    mapOrder(array, order, key) {
        array.sort(function (a, b) {
            var A = a[key],
                B = b[key];
            if (order.indexOf(A) > order.indexOf(B)) {
                return 1;
            }
            return -1;
        });

        return array;
    }

    sortByMonthAsc(data, colName) {
        let months = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December"
        ];
        data.sort((a, b) => {
          return months.indexOf(a[colName]) - months.indexOf(b[colName]);
        });
        return data;
      }

      sortByMonthDesc(data, colName) {
        let months = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December"
        ];
        data.sort((a, b) => {
          return months.indexOf(b[colName]) - months.indexOf(a[colName]);
        });
        return data;
      }
      
    dynamicBinding(data, keyFields) {
        data.forEach(element => {
            let model = [];
            for (const key in element) {
                if (Object.prototype.hasOwnProperty.call(element, key)) {
                    let singleValue = {}
                    if (keyFields.includes(key) !== false) {
                        singleValue.key = key;
                        singleValue.value = (element[key] === "null" || element[key] === null) ? "" : (key === "variableRate" || key === "varibleAmount" || key === 'fixed1' || key === 'fixed2' || 
                        key === 'fixed3' || 
                        key === 'totalFixedAmount' || key === "totalReimbursements") ? element[key].replace(/\$/g, "").replace(/\s/g, "") : element[key];
                        // singleValue.isCurrency = (key === 'variableamount' || key === 'VariableRate' || key === 'variableRate'  || key === 'varibleAmount' || key === 'fixed1' || key === 'fixed2' || key === 'fixed3' || key === 'totalFixedAmount') ? true : false;
                        singleValue.truncate = (key === 'originname' || key === 'destinationname') ? true : false;
                        singleValue.bold = (key === "month" || key === "ReimMonth") ? true : false;
                        singleValue.tooltip = (key === 'originname' || key === 'destinationname') ? true : false;
                        singleValue.tooltipText = (key === 'originname') ? (element.origin != null ? element.origin : 'This trip was manually entered without an address.') : (element.destination != null ? element.destination : 'This trip was manually entered without an address.');
                        singleValue.twoDecimal = (key === "mileage" )? true : false;
                        singleValue.isfourDecimalCurrency = (key === 'variableRate' || key === 'VariableRate') ? true : false;
                        singleValue.istwoDecimalCurrency = (key === "fuel" || key === "avgToDate" ||
                        key === "fixedAmount" ||
                        key === "totalReimbursements" ||
                        key === "fuelPrice" ||
                        key === "varibleAmount" ||
                        key === 'variableamount' ||
                        key === 'fixed1' || key === 'fixed2' || 
                        key === 'fixed3' || 
                        key === 'totalFixedAmount' ||
                        key === "totalReim" ||
                        key === "variable") ? (element[key] === "null" || element[key] === null || element[key] === "") ? false : true
                        : false;
                        
                        singleValue.hasLeadingZero = ((key === "fuel" ||
                        key === "fixedAmount" ||
                        key === "totalReimbursements" ||
                        key === "variableRate" ||
                        key === "varibleAmount" ||
                        key === "fuelPrice" ||
                        key === 'variableamount' || 
                        key === 'VariableRate' ||
                        key === 'totalFixedAmount' ||
                        key === "totalReim" ||
                        key === "variable" || key === "mileage" ||
                        key === "fixed1" || key === "fixed2" ||
                        key === "fixed3") && ((element[key] !== "null" || element[key] !== null) && (singleValue.value !== '0.00') && (singleValue.value !== '0.0000')) && (/^0+/).test(singleValue.value) === true) ? (singleValue.value).replace(/^0+/, '') : null;
                        element[key] = (element[key] === "null" || element[key] === null) ? "" : (key === "variableRate" || key === "varibleAmount" || key === 'fixed1' || key === 'fixed2' || 
                        key === 'fixed3' || 
                        key === 'totalFixedAmount' || key === "totalReimbursements") ? element[key].replace(/\$/g, "").replace(/\s/g, "") : element[key];
                        /* Display 10/4 Update or 1/4 Update based on month from 1st until 3rd of month until mileage and gas prices are available */
                        if(key === 'fuelPrice' || key === 'VariableRate'){
                            const monthValue =  (element['ReimMonth'] === "null" || element['ReimMonth'] === null || element['ReimMonth'] === "") ? -1 : this.getMonthFromString(element['ReimMonth']);
                            const nextUpdate = (monthValue !== -1) ? (monthValue === 12) ? '1/4 Update' : (monthValue + 1) + '/4 Update' : ''
                            if(element['ReimMonth'] === this.isToday()){
                                singleValue.istwoDecimalCurrency = false
                                singleValue.isfourDecimalCurrency = false
                                singleValue.value = nextUpdate
                            }
                        }
                        model.push(singleValue);
                    }
                }
            }
            
            element.rejectedClass = (element.status === 'Rejected') ? 'rejected' : '';
            element.isYtd = (this.templateName === 'Biweek' || this.templateName === 'Monthly') ? true : false;
            element.isYtdBiweek = (this.templateName === 'Biweek') ? true : false;
            element.keyFields = this.mapOrder(model, keyFields, 'key');
        });
    }

    showAll(){
        this.dispatchEvent(
            new CustomEvent("modal", {
              detail: ''
            })
          );
        // this.viewAllNotification = true;
        // console.log(this.viewAllNotification)
        // if(this.viewAllNotification){
        //     this.template.querySelector('c-user-profile-modal').show();
        // }
        //this.template.querySelector('.notify-container').classList.remove('overflow');
    }

    handleChange(event) {
		this._value = event.target.value;
        this.isSearchEnable = this._value === "" ? true : false;
        this.template.querySelector('c-user-data-table').searchByKey(this._value, this.lastModelList)
	}

    handleClose(event) {
        var eId = event.currentTarget.dataset.id;
        this.dispatchEvent(
            new CustomEvent("close", {
              detail: eId
            })
          );
    }
    
    // @api hide(eId){
    //     this.template.querySelector(`.notify-text[data-id="${eId}"]`).classList.add('slds-hide');
    // }

    get progressStyle() {
        return `width: ${this.progressPercent}`;
    }
    

    getLastMonthMileage(){
       // this.viewAllNotification = false;
        this.paginatedModal = true;
        this.isScrollable = true; 
        this.isSortable = true;
        this.download = true;
        this.variable = true;
        this.ytd = false;
        this.biweekYtd = false;
        getMileages({
            clickedMonth: this.lastMonth,
            year: this.year,
            contactId: this.contactId
        })
        .then(data => {
            let resultData = data[0].replace(/\\/g, '');
            this.headerText = 'Last month';
            this.monthText =  '(' + this.lastMonth + ')';
            this.lastModelList = JSON.parse(resultData);
            this.modalLength = this.lastModelList.length > 0 ? true : false;
            this.originalModelList = JSON.parse(resultData);
            this.colname = "tripdate";
            this.coltype = "Date";
            this.modalListColumn = this.lastMonthColumn;
            this.modalKeyFields = this.lastMonthKeyFields;
            console.log("My getMileages list->", resultData);
            this.dynamicBinding(this.lastModelList, this.modalKeyFields);
            this.template.querySelector('c-user-profile-modal').show();
        })
        .catch(error => {
            console.log({
                error
            });
        });
    }

    getThisMonthMileage(){
       // this.viewAllNotification = false;
        this.paginatedModal = true;
        this.isScrollable = true;
        this.isSortable = true;
        this.download = true;
        this.ytd = false;
        this.biweekYtd = false;
        this.variable = false;
        getMileages({
            clickedMonth: this.thisMonth,
            year: this.year,
            contactId: this.contactId
        })
        .then(data => {
            let resultData = data[0].replace(/\\/g, '');
            this.headerText = 'This month';
            this.monthText =  '(' + this.thisMonth + ')';
            this.lastModelList = JSON.parse(resultData);
            this.modalLength = this.lastModelList.length > 0 ? true : false;
            this.originalModelList = JSON.parse(resultData);
            this.colname = "tripdate";
            this.coltype = "Date";
            this.modalListColumn = this.thisMonthColumn;
            this.modalKeyFields = this.thisMonthKeyFields;
            console.log("My getMileages list->", resultData);
            this.dynamicBinding(this.lastModelList, this.modalKeyFields)
            this.template.querySelector('c-user-profile-modal').show();
        })
        .catch(error => {
            console.log({
                error
            });
        });
    }

    getGasPrice(){
        this.templateName = 'Gas Price';
       // this.viewAllNotification = false;
        this.ytd = false;
        this.biweekYtd = false;
        this.paginatedModal = false;
        this.isScrollable = false;
        this.isSortable = false;
        this.modalStyle = 'slds-modal slds-modal_x-small slds-is-fixed slds-fade-in-open animate__animated animate__fadeInTopLeft animate__faster';
        getGasPriceandRate({
            contactId : this.contactId
        })
        .then(data => {
            let gasPriceList = this.proxyToObject(data);
            this.headerText = '';
            this.monthText =  '';
            this.lastModelList = this.sortByMonthDesc(gasPriceList, "ReimMonth");
            this.originalModelList = gasPriceList;
            this.modalListColumn = this.gasPriceColumn;
            this.modalKeyFields = this.gasPriceKeyFields;
            this.dynamicBinding(this.lastModelList, this.modalKeyFields)
            this.template.querySelector('c-user-profile-modal').show();
            console.log("gasPrice ----", gasPriceList)
        })
    }

    getBiweekReimbursement(){
        this.templateName = 'Biweek';
       // this.viewAllNotification = false;
        this.biweekYtd = true;
        this.paginatedModal = false;
        this.isScrollable = false;
        this.isSortable = false;
        this.modalStyle = 'slds-modal slds-modal_large slds-is-fixed slds-fade-in-open animate__animated animate__fadeInTopLeft animate__faster';
        getAllReimbursements({
            year: this.year,
            contactId : this.contactId,
            accountId : this.accountId
        })
        .then(data => {
            let biweekReimbursementList = this.proxyToObject(data[0]);
            this.ytd = (biweekReimbursementList.length > 0) ? true : false;
            this.headerText = '';
            this.monthText =  '';
            this.lastModelList = this.sortByMonthDesc(biweekReimbursementList, "month");
            this.originalModelList = biweekReimbursementList;
            this.modalListColumn = this.biweekColumn;
            this.modalKeyFields = this.biweekKeyFields;
            this.dynamicBinding(this.lastModelList, this.modalKeyFields)
            this.template.querySelector('c-user-profile-modal').show();
            console.log("getAllReimbursements ----", data)
        })
    }

    getMonthReimbursement(){
        this.templateName = 'Monthly';
      //  this.viewAllNotification = false;
        //this.ytd = true;
        this.biweekYtd = false;
        this.paginatedModal = false;
        this.isScrollable = false;
        this.isSortable = false;
        this.modalStyle = 'slds-modal slds-modal_large slds-is-fixed slds-fade-in-open animate__animated animate__fadeInTopLeft animate__faster';
        getAllReimbursements({
            year: this.year,
            contactId : this.contactId,
            accountId : this.accountId
        })
        .then(data => {
            let biweekReimbursementList = this.proxyToObject(data[0]);
            this.ytd = (biweekReimbursementList.length > 0) ? true : false;
            this.headerText = '';
            this.monthText =  '';
            this.lastModelList = this.sortByMonthDesc(biweekReimbursementList, "month");
            this.originalModelList = biweekReimbursementList;
            this.modalListColumn = this.monthColumn;
            this.modalKeyFields = this.monthKeyFields;
            this.dynamicBinding(this.lastModelList, this.modalKeyFields)
            this.template.querySelector('c-user-profile-modal').show();
            console.log("getAllReimbursements ----", data)
        })
    }

    excelToExport(data, file, sheet){
        this.template.querySelector('c-export-excel').download(data, file, sheet);
    }

    dateTime(date){
        var yd, ydd,ymm, yy, hh, min ,sec;
        yd = date
        ydd = yd.getDate();
        ymm = yd.getMonth() + 1;
        yy = yd.getFullYear();
        hh = yd.getHours();
        min = yd.getMinutes();
        sec = yd.getSeconds();
        ydd = (ydd < 10) ? ('0' + ydd) : ydd;
        ymm = (ymm < 10) ? ('0' + ymm) : ymm;
        console.log(ymm + ydd);
        console.log(yy.toString(), hh.toString(), min.toString(), sec.toString());
        return  ymm.toString() + ydd.toString() + yy.toString() + hh.toString() + min.toString() + sec.toString();
    }

    downloadUserTrips(){
        if(this.headerText === 'This month'){
            let mileage = [];
            // let clickedPeriod = "Pay Period " + this.startDate + " - " + this.endDate;
            let fileName = this.contactName + '\'s This Month Mileage Report ' + this.dateTime(new Date());
            let sheetName = 'This Month Mileage Report';
            mileage.push(["Contact Email", "Trip Date", "Start Time", "End Time", "Trip Origin", "Trip Destination", "Mileage", "Status"])
            this.lastModelList.forEach((item)=>{
                mileage.push([item.emailaddress,  item.tripdate, item.starttime, item.endtime, item.originname, item.destinationname, item.mileage, item.status])
            })
            this.excelToExport(mileage, fileName, sheetName);
        }else{
            let mileage = [];
            // let clickedPeriod = "Pay Period " + this.startDate + " - " + this.endDate;
            let fileName = this.contactName + '\'s Last Month Mileage Report ' + this.dateTime(new Date());
            let sheetName = 'Last Month Mileage Report';
            mileage.push(["Contact Email", "Tracking Style", "Day Of Week", "Trip Date", "Start Time", "End Time", "Trip Origin", "Trip Destination", "Mileage", "Status", "Date Submitted", "Date Approved", "Maint/Tires", "Fuel Rate", "Variable Rate", "Amount", "Notes", "Tags"])
            this.lastModelList.forEach((item)=>{
                mileage.push([item.emailaddress, item.tracingstyle, item.dayofweek, item.tripdate, item.starttime, item.endtime, item.originname, item.destinationname, item.mileage, item.status, item.submitteddate, item.approveddate, item.maintTyre, item.fuelVariableRate, item.variablerate, item.variableamount,item.notes, item.tag])
            })
            this.excelToExport(mileage, fileName, sheetName);
        }
    }

    downloadAllRecord(){
        if(this.templateName === 'Gas Price'){
            let downloadList = [];
            // let clickedPeriod = "Pay Period " + this.startDate + " - " + this.endDate;
            let fileName = this.contactName + '\'s Mileage & Gas Price Report ' + this.dateTime(new Date());
            let sheetName = 'Mileage Report';
            downloadList.push(["Month", "Gas Prices", "Mileage Rate"])
            this.lastModelList.forEach((item)=>{
                downloadList.push([item.ReimMonth, item.fuelPrice, item.VariableRate])
            })
            this.excelToExport(downloadList, fileName, sheetName);
        }else if(this.templateName === 'Monthly'){
            let downloadList = [];
            // let clickedPeriod = "Pay Period " + this.startDate + " - " + this.endDate;
            let fileName = this.contactName + '\'s Mileage Report ' + this.dateTime(new Date());
            let sheetName = 'Mileage Report';
            downloadList.push(["Month", "Fuel", "Mileage", "Mi Rate", "Variable", "Fixed", "Total","Average To Date"])
            this.lastModelList.forEach((item)=>{
                downloadList.push([item.month, item.fuel, item.mileage,  item.variableRate, item.varibleAmount,  item.fixedAmount,  item.totalReimbursements, item.avgToDate])
            })
            downloadList.push(["YTD", "", this.excelYtd.mileageCalc, "", this.excelYtd.varibleAmountCalc, this.excelYtd.totalMonthlyFixedCalc, this.excelYtd.totalReim, this.excelYtd.totalAVGCalc])
            this.excelToExport(downloadList, fileName, sheetName);
        }else{
            let downloadList = [];
            // let clickedPeriod = "Pay Period " + this.startDate + " - " + this.endDate;
            let fileName = this.contactName + '\'s Mileage Report ' + this.dateTime(new Date());
            let sheetName = 'Mileage Report';
            downloadList.push(["Month", "Mi Rate", "Mileage", "Variable", "Fixed 1", "Fixed 2", "Fixed 3", "Total", "Average To Date"])
            this.lastModelList.forEach((item)=>{
                downloadList.push([item.month, item.variableRate, item.mileage,  item.varibleAmount,  (item.fixed1) ? item.fixed1 : '',  (item.fixed2) ? item.fixed2 : '',  (item.fixed3) ? item.fixed3 : '',  item.totalReimbursements, item.avgToDate])
            })
            downloadList.push(["YTD", "", this.excelYtd.mileageCalc,  this.excelYtd.varibleAmountCalc, this.excelYtd.fixed1Calc, this.excelYtd.fixed2Calc,  this.excelYtd.fixed3Calc,  this.excelYtd.totalReim, this.excelYtd.totalAVGCalc])
            this.excelToExport(downloadList, fileName, sheetName);
        }
      
    }

    
    handleClearInput(){
        this._value = "";
        this.isSearchEnable = this._value === "" ? true : false;
        this.template
        .querySelector("c-user-data-table")
        .searchByKey(this._value);
    }

    handleMap(event){
        this.checkAll = event.target.checked;
        this.typeMap = (!this.checkAll) ? 'USA' : 'CANADA'
        let state = (!this.checkAll) ? this.drivingState_US : this.drivingState_canada
        this.subTitle = (state !== undefined) ? state.join(', ') : '';
        this.template.querySelector('c-choropleth-map').type = this.typeMap;
        this.template.querySelector('c-choropleth-map').reloadChart()
    }

    dataReimbursement(reimbursementData){
        this.lastMilesZero = (reimbursementData.lastmonthmiles !== '0.00' && (/^0+/).test(reimbursementData.lastmonthmiles) === true) ? (reimbursementData.lastmonthmiles).replace(/^0+/, '') : null;
        this.thisMilesZero = (reimbursementData.currentmonthmiles !== '0.00' && (/^0+/).test(reimbursementData.currentmonthmiles) === true) ? (reimbursementData.currentmonthmiles).replace(/^0+/, '') : null;
        this.halfFixedZero= (reimbursementData.halfFixedAmount !== '0.00' && (/^0+/).test(reimbursementData.halfFixedAmount) === true) ? (reimbursementData.halfFixedAmount).replace(/^0+/, '$') : null;
        this.fixedAmountZero = (reimbursementData.fixedAmount !== '0.00' && (/^0+/).test(reimbursementData.fixedAmount) === true) ? (reimbursementData.fixedAmount).replace(/^0+/, '$') : null;
        this.fuelPriceZero = (reimbursementData.lastmonthfuelprice !== '0.00' && (/^0+/).test(reimbursementData.lastmonthfuelprice) === true) ? (reimbursementData.lastmonthfuelprice).replace(/^0+/, '$') : null;
        this.mileageRateZero = (reimbursementData.lastmonthmileagerate !== '0.00' && (/^0+/).test(reimbursementData.lastmonthmileagerate) === true) ? (reimbursementData.lastmonthmileagerate).replace(/^0+/, '$') : null;
        this.lastMonthMiles = (reimbursementData.lastmonthmiles) ? reimbursementData.lastmonthmiles : 0;
        this.thisMonthMiles = (reimbursementData.currentmonthmiles) ? reimbursementData.currentmonthmiles : 0;
        this.halfFixedAmount = (reimbursementData.halfFixedAmount) ? reimbursementData.halfFixedAmount : 0;
        this.fixedAmount = (reimbursementData.fixedAmount) ? reimbursementData.fixedAmount : 0;
        this.monthfuelPrice = (reimbursementData.lastmonthfuelprice) ? reimbursementData.lastmonthfuelprice : 0;
        this.lastMonthMileageRate = (reimbursementData.lastmonthmileagerate) ? reimbursementData.lastmonthmileagerate : 0;
    }

    driverListOfDetail(contactList){
        this.vehicleImage = contactList[0].Car_Image__c;
        this.vehicleType = contactList[0].Vehicle_Type__c;
        this.mapCountry = (contactList[0].Map_Country__c !== undefined) ? contactList[0].Map_Country__c : 'USA';
        this.contactName = contactList[0].Name;
        this.address = (contactList[0].MailingCity !== undefined ? contactList[0].MailingCity + ', ' : '') + (contactList[0].MailingState !== undefined ? contactList[0].MailingState : '') +' '+ (contactList[0].MailingPostalCode !== undefined ? contactList[0].MailingPostalCode : '');
        this.planInsurance = (contactList[0].Insurance__c !== undefined) ? (contactList[0].Insurance__c === 'Yes') ? true : false : false;
        // this.planMileage =    (contactList[0].Mileage_Meet__c !== undefined) ? (contactList[0].Mileage_Meet__c === 'Yes') ? true : false : false;
        this.planVehicleAge =  (contactList[0].Vehicle_Age__c !== undefined) ?  (contactList[0].Vehicle_Age__c === 'Yes') ? true : false : false;
        this.planVehicleValue = (contactList[0].Vehicle_Value_Check__c !== undefined) ?   (contactList[0].Vehicle_Value_Check__c === 'Yes') ? true : false : false;
        this.planCompliance =  (contactList[0].compliancestatus__c !== undefined) ?  (contactList[0].compliancestatus__c === 'Yes') ? true : false : false;
        this.planYear = (contactList[0].Plan_Years__c !== undefined) ?  contactList[0].Plan_Years__c : 0;
        this.complianceMileage = (contactList[0].Compliance_Mileage__c !== undefined) ? contactList[0].Compliance_Mileage__c : 0;
        this.vehicleValue = (contactList[0].Vehicle_Value__c !== undefined) ? (contactList[0].Vehicle_Value__c) : 0;
        this.insurancePlan = (contactList[0].Insurance_Plan__c !== undefined) ? contactList[0].Insurance_Plan__c : '';
        this.complianceStatus = (contactList[0].compliancestatus__c !== undefined) ? contactList[0].compliancestatus__c : '';
        this.annualMileage = (contactList[0].Total_Approved_Mileages__c !== undefined) ? contactList[0].Total_Approved_Mileages__c : '0';
        this.annualReimbursement = (contactList[0].Total_reimbursment__c !== undefined) ? contactList[0].Total_reimbursment__c : '0';
        this.isValid = parseFloat(this.annualMileage) >= parseFloat(this.complianceMileage) ? true : false;
        this.planMileage =   (this.isValid) ?  true : false;
        this.biweekly = (contactList[0].Reimbursement_Frequency__c === 'Bi-Weekly Reimbursement') ? true : false;
        this.typeMap = this.mapCountry;
        this.progressBar(parseFloat(this.annualMileage), parseFloat(this.complianceMileage))
    }

    progressBar(numVal, compareVal) {
        if (numVal >= 1) {
            this.progress = (numVal / compareVal) * 100;
            this.progress = (this.progress > 100) ? 100 : this.progress
            this.progressPercent = this.progress + '%'
        }
        else {
            this.progress = 0;
            this.progressPercent = this.progress + '%';
        }
    }

    @wire(getDriverDetails, {
        contactId:'$contactId'
    })driverDetailInfo({data,error}) {
        if (data) {
            let contactList = this.proxyToObject(data);
            this.driverListOfDetail(contactList);
            console.log("getDriverDetails data", data)
        }else if(error){
            console.log("getDriverDetails error", error.message)
        }
    }

    @wire(getReimbursementData, {
        contactId:'$contactId'
    })reimbursementData({data,error}) {
        if (data) {
            let reimbursementData = this.proxyToObject(data);
           this.dataReimbursement(reimbursementData);
            console.log("getReimbursementData data",data)
        }else if(error){
            console.log("getReimbursementData error", error)
        }
    }

    connectedCallback(){
        let currDate = new Date();
        let monthNo = currDate.getMonth();
        let previousMonthNo = currDate.getMonth() - 1;
        this.year = currDate.getFullYear();
        this.thisMonth = this.getMonthName(monthNo);
        this.lastMonth = (previousMonthNo > 0) ? this.getMonthName(previousMonthNo) : this.getMonthName(11);
        this.messageForNextBatch = (this.currentMonth()) ? 'Updated ' + this.currentMonth() + '. 4' : false;
       // console.log(this.thisMonth, this.lastMonth)
        if(this.chartInfo){
          //  console.log("chart",this.chartInfo[0])
            this.chartList = this.chartInfo[0]
        }
        this.headerModalText = 'Notifications';
        this.canadaStatesList = canadaStates;
        this.usaDrivingStates = usaDrivingStates;
        getDrivingState({
            contactId: this.contactId
        }).then((result) =>{
            if(result){
                //console.log("Driving state", result)
                let drivingState = this.proxyToObject(result);
                if(drivingState.length > 0){
                    if(drivingState[0].Driving_States__c !== undefined){
                        let canadaState = this.canadaStatesList.split(',');
                        let usAState = this.usaDrivingStates.split(',');
                        let states = drivingState[0].Driving_States__c.split(';');
                        this.usStatesList = drivingState[0].Driving_States__c;
                        let usState = (states !== undefined) ? states : []
                        let candaState = (canadaState !== undefined) ? canadaState : []
                        this.drivingState_US = usState.filter(item => !candaState.includes(item));
                        this.drivingState_canada = usState.filter(item => candaState.includes(item));
                        let C = canadaState.some(elem => states.includes(elem));
                        let U = usAState.some(elem => states.includes(elem));
                        setTimeout(()=>{
                            this.subTitle = (this.typeMap === 'CANADA') ? this.drivingState_canada.join(', ') : this.drivingState_US.join(', ')
                            this.multipleMap = (C === true && U === true) ? true : false;
                            this.checkAll = (this.typeMap === 'CANADA') ? true : false;
                        }, 2000)
                       
                    }
                }
              
                //console.log("Driving state", result, this.typeMap)
            }
        })

    }


    redirectToReimbursement(){
        events(this, '');
    }

    redirectToResources(){
        const e = new CustomEvent('redirectview', {});
        this.dispatchEvent(e);
    }
}