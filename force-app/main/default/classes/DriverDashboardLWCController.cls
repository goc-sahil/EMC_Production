global class DriverDashboardLWCController {
    public static string videoCustom {get;set;}
    global static string drivingStates {get;set;}
    global static string contactName {get;set;}
    global static Integer userLoginCount {get;set;}
    global static String ScheduleGotoMeeting {get;set;}
    public static Date activationDate {get;set;}
    public static String systemNotification {get;set;}
    global static String last2Month {get;set;}

    
    global DriverDashboardLWCController(){
        NewDashboardVideoLink__c videoCustomSetting = NewDashboardVideoLink__c.getOrgDefaults();
        videoCustom = json.serialize(videoCustomSetting );
        List<Contact> conList = [SELECT id,FirstName,Role__c,Driving_States__c,account.Schedule_Goto_Meeting__c,Activation_Date__c, System_Notification__c FROM Contact WHERE id =: getContactid() ];
        if(conList.size() > 0){
            ScheduleGotoMeeting = conList[0].account.Schedule_Goto_Meeting__c != null ? conList[0].account.Schedule_Goto_Meeting__c : '' ;
            drivingStates = Json.serialize(String.valueOf(conList[0].Driving_States__c));
            contactName = conList[0].FirstName != null ? conList[0].FirstName : '';
            activationDate = conList[0].Activation_Date__c != null ? conList[0].Activation_Date__c: null;   
            systemNotification = conList[0].System_Notification__c;            
        }  
        userLoginCount = countUserLogin(getContactid());
        
    last2Month = String.escapeSingleQuotes(WrapperUtils.getpastYearReimbursement(getContactid()));        
    }
    
    public static String getContactid() {
        if(ApexPages.currentPage().getParameters().containsKey('id') && String.isNotBlank(ApexPages.currentPage().getParameters().get('id'))) {
           return ApexPages.currentPage().getParameters().get('id');
        } else {
            return '';
        } 
    }
    
    public static Integer countUserLogin(String contactId){
        integer countLogin = 0;
        User userObj = [SELECT id from User where ContactId =: contactId];
        if(userObj != null){
            for(LoginHistory objLogin : [SELECT id,Status from LoginHistory where LoginUrl = 'https://mburse--partialdev.sandbox.my.site.com/app/adminlogin' and UserId =: userObj.Id]){
                if(objLogin.Status == 'Success'){
                    countLogin = countLogin + 1;
                }
            }
        }        
        return countLogin;
    }
    // This Method is used to return Driver's details.
     @AuraEnabled(cacheable=true)
    public static String getDriverDetails(String contactId) {            
        List<contact> driverDataList = new List<contact>();
        driverDataList = [SELECT id, Name, FirstName, MailingPostalCode,MailingState,External_Email__c, MailingCity,Driver_Type__c,Driving_States__c,Expiration_Date__c,Compliance_Mileage__c, Vehicle_Value__c,Time_Attandance__c,
                                        Fixed_Amount__c, compliancestatus__c, Car_Image__c,Notification_Message__c,Contact_Picture__c,Insurance_Plan__c,Plan_Years__c,Vehicle_Type__c,Insurance_Upload_Date__c,Insurance_Attachment_Id__c,
                                        Total_Approved_Mileages__c,Total_Annual_Reimbursement__c,Total_reimbursment__c,Monthly_Reimbursement__c, Biweek_Reimbursement__c, Bi_Week_Fixed_Amount__c, Monthly_Mileage_Rate__c,Maintenance__c,Tires__c, Insurance_Rate__c, License_Ragistration__c, Taxes__c,
                                        Depreciation__c, Total_Monthly_Costs__c, Business_Use__c,Fixed_Cost_Adjustment__c,Vehicle_Value_Check__c,Mileage_Meet__c,Vehicle_Age__c,Insurance__c, Notification_Date__c, Account.Bodily_Injury__c, Account.Uninsured_Motorist__c, 
                                        Account.Property_Damage__c,Map_Country__c, Account.Comprehensive__c, Account.Collision__c,Account.Umbrella_Coverage__c,Triplog_UserID__c,Reimbursement_Type__c,Reimbursement_Frequency__c, Account.Reimbursement_Type__c,MobilePhone
                                    FROM Contact 
                                    WHERE id =: contactId];
        return JSON.serialize(driverDataList ).unescapeHtml4();
    }
    
    @AuraEnabled
    public static String getDriverDetailsClone(String contactId) {            
        List<contact> driverDataList = new List<contact>();
        driverDataList = [SELECT id, Name, FirstName, MailingPostalCode, MailingState,External_Email__c, MailingCity,Driver_Type__c,Driving_States__c,Expiration_Date__c,Compliance_Mileage__c, Vehicle_Value__c,Time_Attandance__c,
                                        Fixed_Amount__c, compliancestatus__c, Car_Image__c,Notification_Message__c,Contact_Picture__c,Insurance_Plan__c,Plan_Years__c,Vehicle_Type__c,Insurance_Upload_Date__c,Insurance_Attachment_Id__c,
                                        Total_Approved_Mileages__c,Total_Annual_Reimbursement__c,Total_reimbursment__c,Monthly_Reimbursement__c, Biweek_Reimbursement__c, Bi_Week_Fixed_Amount__c, Monthly_Mileage_Rate__c,Maintenance__c,Tires__c, Insurance_Rate__c, License_Ragistration__c, Taxes__c,
                                        Depreciation__c, Total_Monthly_Costs__c, Business_Use__c,Fixed_Cost_Adjustment__c,Vehicle_Value_Check__c,Mileage_Meet__c,Vehicle_Age__c,Insurance__c, Notification_Date__c,Account.Bodily_Injury__c, Account.Uninsured_Motorist__c, 
                                        Account.Property_Damage__c,Map_Country__c, Account.Comprehensive__c, Account.Collision__c,Account.Umbrella_Coverage__c,Triplog_UserID__c,Reimbursement_Type__c,Reimbursement_Frequency__c, Account.Reimbursement_Type__c
                                    FROM Contact 
                                    WHERE id =: contactId];
      return JSON.serialize(driverDataList ).unescapeHtml4();
    }
    
    // This Method is used to get Driver's Driving State.
    
    @AuraEnabled
    public static String getDrivingState(String contactId) {            
        List<contact> driverDataList = new List<contact>();
        driverDataList = [SELECT id, Name, Driving_States__c
                                    FROM Contact 
                                    WHERE id =: contactId];  
        return JSON.serialize(driverDataList ).unescapeHtml4();
    }

    // This Method is used to get Company's logo from the account object.
    @AuraEnabled(cacheable=true)
    public static String getCompanyLogoUrl(String accountId) {
        String imageURL;
        Account acc = [SELECT Id,Name,Logo_Document_Id__c from Account where id =:accountId];
        if(acc.Logo_Document_Id__c != null){
            imageURL = acc.Logo_Document_Id__c;
        }else{
            imageURL ='';
        }
        return JSON.serialize(imageURL).unescapeHtml4();
    }
    
    // This Method is used to get Mileages based on the month and year.
    @AuraEnabled
    public static List<String> getMileages(String clickedMonth,String year,String contactId) {
        return WrapperUtils.getMileages1(clickedMonth,year,contactId);
    }

    @AuraEnabled
    public static String getMileagesData(Integer year,String contactId) {
            List<mileageValueWrapper> mileageData = new List<mileageValueWrapper>(); 
    
            for(Employee_Mileage__c empMileagelst : [SELECT Id,StartTime__c, EndTime__c,CreatedDate, Contact_Email_Id__c, Tracing_Style__c, Day_Of_Week__c, 
                                                        Trip_Date__c, Origin_Name__c, Destination_Name__c, Mileage__c, Trip_Status__c, Approved_Date__c, ConvertedStartTime__c,ConvertedEndTime__c,
                                                        Fuel_Variable_Rate__c, Variable_Rate__c,Variable__c,Maintenance_and_Tires__c ,EmployeeReimbursement__r.Month__c ,Total_Time__c, 
                                                        Notes__c, Tag__c 
                                                    from Employee_Mileage__c 
                                                    where EmployeeReimbursement__r.Contact_Id__c =: contactId and EmployeeReimbursement__r.Year__c =:year  order by Trip_Date__c  desc]){
                String MonthVal = empMileagelst.EmployeeReimbursement__r.Month__c.split('-').get(0);
                String MonthStr = WrapperUtils.getMonthNamefromno(Integer.valueOf(MonthVal));            
                mileageValueWrapper empMileWrap = new mileageValueWrapper ();
                empMileWrap.reimMonth = MonthStr;
                empMileWrap.id = String.valueOf(empMileagelst.Id);
                //empMileWrap.endtime = String.valueOf(empMileagelst.EndTime__c);
                //empMileWrap.starttime = String.valueOf(empMileagelst.StartTime__c);
                if(empMileagelst.ConvertedStartTime__c != null ) {
                    DateTime startTime = empMileagelst.ConvertedStartTime__c;
                    empMileWrap.starttime = startTime.format('h:mm a','America/Panama');
                }                
                if(empMileagelst.ConvertedEndTime__c != null) {
                    DateTime endTime = empMileagelst.ConvertedEndTime__c ;
                    empMileWrap.endTime = endTime.format('h:mm a','America/Panama');
                }  
                empMileWrap.email = String.valueOf(empMileagelst.Contact_Email_Id__c);
                empMileWrap.tracingStyle = String.valueOf(empMileagelst.Tracing_Style__c);
                empMileWrap.dayOfWeek = String.valueOf(empMileagelst.Day_Of_Week__c);
                
                Date dTrip = empMileagelst.Trip_Date__c;
                DateTime dt = DateTime.newInstance(dTrip.year(), dTrip.month(),dTrip.day());
                String dateStrforTrip = dt.format('MM/dd/yy');

                empMileWrap.tripDate = dateStrforTrip;
                empMileWrap.originName = String.valueOf(empMileagelst.Origin_Name__c);
                empMileWrap.destinationName = String.valueOf(empMileagelst.Destination_Name__c);
                empMileWrap.mileage = String.valueOf(empMileagelst.Mileage__c);
                empMileWrap.tripStatus = String.valueOf(empMileagelst.Trip_Status__c);
                if(empMileagelst.Approved_Date__c != null ){
                    Date dApprove = empMileagelst.Approved_Date__c;
                    DateTime dt2 = DateTime.newInstance(dApprove.year(), dApprove.month(),dApprove.day());
                    String dateStrforApprove = dt2.format('MM/dd/yy');    
                    empMileWrap.approvedDate = dateStrforApprove;
                }
                
                empMileWrap.fuelVaraibleRate = String.valueOf(empMileagelst.Fuel_Variable_Rate__c);          
                empMileWrap.varaibleRate = empMileagelst.Variable_Rate__c != null ? String.valueOf(empMileagelst.Variable_Rate__c) : '0';
                empMileWrap.varaibleAmount = String.valueOf(empMileagelst.Variable__c);
                empMileWrap.maintTyre = String.valueOf(empMileagelst.Maintenance_and_Tires__c);
                empMileWrap.totalTime = String.valueOf(empMileagelst.Total_Time__c);
                empMileWrap.notes = String.valueOf(empMileagelst.Notes__c);
                empMileWrap.tag = String.valueOf(empMileagelst.Tag__c);

                Date createddate = Date.valueOf(empMileagelst.CreatedDate);
                if(String.valueOf(createddate).contains('-')) {
                    List<String> createdDateSplitted = new List<String>();
                    createdDateSplitted = String.valueOf(createddate).split('-');
                    empMileWrap.submitteddate =  createdDateSplitted[1]+'/'+createdDateSplitted[2]+'/'+createdDateSplitted[0].substring(2,4);
                }
                mileageData.add(empMileWrap);
            }   
            return JSON.serialize(mileageData).unescapeHtml4();
    }

    public class mileageValueWrapper {
       public string reimMonth {get;set;}
        public string id {get;set;}
        public string starttime {get;set;}
        public string endtime {get;set;}
        public string email {get;set;}
        public string tracingStyle {get;set;}
        public string dayOfWeek {get;set;}
        public string tripDate {get;set;}
        public string originName {get;set;}
        public string destinationName {get;set;}
        public string mileage {get;set;}
        public string tripStatus {get;set;}
        public string approvedDate {get;set;}
        public string fuelVaraibleRate {get;set;}
        public string varaibleRate {get;set;}
        public string varaibleAmount {get;set;}
        public string totalTime {get;set;}
        public string notes {get;set;}
        public string tag {get;set;}
        public string maintTyre {get;set;}
        public string submitteddate {get;set;}
    }
    
    @RemoteAction
    public static String getChartData(String contactId) { 
        return NewdriverdashboardController.getChartData(contactid);
    }
    
    // This Method is used to return reimbursement list
    @AuraEnabled
    global Static List<String> getAllReimbursements(String year,String contactId,String accountId) {   
        List<EmployeeReimbursements> employeeReimList = new List<EmployeeReimbursements>();    
        List<reaimValueWrapperNew> employeeReimWrap = new List<reaimValueWrapperNew>();  

        Decimal mileageCount = 0.00;
        Decimal fixedCount = 0.00;
        Decimal avgToDateCount = 0.00;
        Decimal varibleAmountCount = 0.00;
        Decimal fixed1Count = 0.00;
        Decimal fixed2Count = 0.00;
        Decimal fixed3Count = 0.00;
        Decimal totalFixedAmountCount = 0.00;
        Decimal reimCount = 0.00;

        String responseData = WrapperUtils.getAllReimbursements(year,contactId,accountId);
        if(responseData != null) {
            employeeReimList = (List<EmployeeReimbursements>)Json.deserialize(responseData,List<EmployeeReimbursements>.class);
        }
        reaimValueWrapperNew employeeReimbursement = new reaimValueWrapperNew();

        for(EmployeeReimbursements empReim : employeeReimList){           
            Double variableAmou = Double.valueof((empReim.varibleAmount).replace('$',''));

            if(empReim.mileage != 'null'){
                mileageCount = mileageCount + Double.valueof(empReim.mileage);
            }
            
            if(variableAmou > 0 ){
                varibleAmountCount = varibleAmountCount + variableAmou;
            }   
            System.debug('emp value before : '+empReim.fixed1);
            if(empReim.fixed1 != 'null'){
                fixed1Count = fixed1Count + Double.valueof((empReim.fixed1).replace('$',''));
            }
            if(empReim.fixed2 != 'null'){
                fixed2Count = fixed2Count + Double.valueof((empReim.fixed2).replace('$',''));
            }
            if(empReim.fixed3 != 'null'){
                fixed3Count = fixed3Count + Double.valueof((empReim.fixed3).replace('$',''));
            }
            System.debug('empReim.fixedAmount: '+empReim.fixedAmount);
            if(empReim.fixedAmount != 'null' && empReim.fixedAmount != null  && empReim.fixedAmount != ''){
             System.debug('empReim.fixedAmount:===== '+empReim.fixedAmount);
                fixedCount = fixedCount + Double.valueof((empReim.fixedAmount).replace('$',''));
            }
            if(empReim.avgToDate != 'null'){
                System.debug('avgToDateCount: '+Double.valueof(empReim.avgToDate));
                avgToDateCount = avgToDateCount + Double.valueof((empReim.avgToDate).replace('$',''));
                System.debug('avgToDateCount: '+avgToDateCount);
            }
            if(empReim.totalReimbursements != 'null'){
                reimCount = reimCount + Double.valueof((empReim.totalReimbursements).replace('$',''));
                System.debug('reimCount :'+reimCount);
            }
        }
        employeeReimbursement.mileageCalc = String.valueOf(mileageCount);
        employeeReimbursement.varibleAmountCalc = '$' +String.valueOf((varibleAmountCount).setScale(2));
        employeeReimbursement.fixed1Calc = fixed1Count != null ? '$' +String.valueOf((fixed1Count).setScale(2)) : '0';
        employeeReimbursement.fixed2Calc = fixed2Count != null ? '$' +String.valueOf((fixed2Count).setScale(2)) : '0';
        employeeReimbursement.fixed3Calc = fixed3Count != null ? '$' +String.valueOf((fixed3Count).setScale(2)) : '0';
        //employeeReimbursement.fixed1Calc = '$' +String.valueOf(fixed1Count);
        //employeeReimbursement.fixed2Calc = '$' +String.valueOf(fixed2Count);
        //employeeReimbursement.fixed3Calc = '$' +String.valueOf(fixed3Count);
        employeeReimbursement.totalFixedAmountCalc = '$' +String.valueOf((totalFixedAmountCount).setScale(2));
        employeeReimbursement.totalMonthlyFixedCalc = '$' +String.valueOf((fixedCount).setScale(2));
        employeeReimbursement.totalAVGCalc = '$' +String.valueOf((avgToDateCount).setScale(2));
        employeeReimbursement.totalReim = '$' +String.valueOf((reimCount).setScale(2));
        System.debug('totalReim :'+employeeReimbursement.totalReim);
        
        List<String> lstOfReim = new List<String>();
        lstOfReim.add(responseData);
        lstOfReim.add(Json.serialize(employeeReimbursement));
        return lstOfReim;
    }

    public class reaimValueWrapperNew{
        public String mileageCalc {get;set;}
        public String varibleAmountCalc {get;set;}
        public String fixed1Calc {get;set;}
        public String fixed2Calc {get;set;}
        public String fixed3Calc {get;set;}
        public String totalFixedAmountCalc {get;set;}
        public String totalMonthlyFixedCalc {get;set;}
        public String totalAVGCalc {get;set;}
        public String totalReim {get;set;}
    }
    
    @AuraEnabled(cacheable = true)
    public static String getGasPriceandRate(String contactId) {       
        List<reaimValueWrapper> reimValue = new List<reaimValueWrapper>();       
        List<String> reaimMonthList =  new List<String>();
        reaimMonthList = LWCWrapperUtils.monthList(String.valueOf(System.today().Year()),true);   
        String lastMonth = Utils.fetchMonths(1, 0)[0];    
        for(Employee_Reimbursement__c empReimLst : [SELECT Id,Month__c,Fuel_Price__c,Variable_Rate__c,Fuel_Variable_Rate__c,Contact_Id__r.MailingCity,Contact_Id__r.MailingState  
                                                        FROM Employee_Reimbursement__c 
                                                        WHERE Month__c =: reaimMonthList 
                                                            AND Contact_Id__c =: contactId]){
            String MonthVal = empReimLst.Month__c.split('-').get(0);
            String MonthStr = WrapperUtils.getMonthNamefromno(Integer.valueOf(MonthVal));            
            reaimValueWrapper reimWrap = new reaimValueWrapper ();
            reimWrap.ReimMonth = MonthStr;
            reimWrap.fuelPrice = empReimLst.Fuel_Price__c != null ? String.valueOf(empReimLst.Fuel_Price__c) : '0';
            reimWrap.VariableRate = empReimLst.Variable_Rate__c != null ? String.valueOf(empReimLst.Variable_Rate__c) : '0';     
            reimValue.add(reimWrap);
           
        }
        return Json.serialize(reimValue);
    }
    @AuraEnabled
    public static String getLast2Years(String contactId) {
       return String.escapeSingleQuotes(WrapperUtils.getpastYearReimbursement(contactId));
    }
    
   @AuraEnabled
    public static string TimeAttendance(String conId,String year){
        return Json.serialize(BiweeklyPayPeriod.getTimeAndAttendance(conId,year));
    }

    @AuraEnabled
    public static String getMileagesBasedTandAtt(String startdate,String enddate,String contactId) {
        return String.escapeSingleQuotes(WrapperUtils.getMileagesBasedTA(startdate,enddate,contactId));
    } 

    @AuraEnabled
    public static string biweeklyMileage(String conId,Integer year){
        return Json.serialize(BiweeklyPayPeriod.getBiweeklyReimbursement(conId,year)); 
    }

    @AuraEnabled
    public static List<String> getBiweekMileages(string biweekId) {
        return BiweeklyPayPeriod.getBiweekMileages1(biweekId);
    } 

    @AuraEnabled
    public static string ApproveBiweekMileages(string biweekId) {       
        BiweeklyPayPeriod.ApproveBiWeekTrips(biweekId);
        return 'sucess';
    } 
    
    @AuraEnabled
    public static List<String> getAllMileages(String startdate,String enddate,String contactId) {
        return BiweeklyPayPeriod.getAllBiweekMileages1(date.valueof(startdate),date.valueof(enddate),contactId);
    }
    
    @AuraEnabled
    public static List<String> getCompliance(String contactId) {
        return WrapperUtils.getComplianceCalculation(contactId,String.valueOf(System.today().year()));
    }
    
    @AuraEnabled
    public static String getFuelVariableRate(String contactId) {
        return WrapperUtils.getDriverFuelVariableRate(contactId);
    }
    public class reaimValueWrapper {
        public string ReimMonth {get;set;}
        public string fuelPrice {get;set;}
        public string VariableRate {get;set;}       
    }
    
    @AuraEnabled(cacheable=true)
    public static String getReimbursementData(String contactId) {  
      return LWCWrapperUtils.getReimbursementData(contactId);
    }  
    
    @AuraEnabled(cacheable=true)
    public static List<String> getPacketandMeeting(String contactId) {
        return WrapperUtils.getPacketandMeetingDetails(contactId);
    } 
    
    @AuraEnabled 
    public static NewDashboardVideoLink__c getCustomSettings(){
        return NewDashboardVideoLink__c.getOrgDefaults();
    }
    
    @AuraEnabled
    public static String getPlanParameter (String contactId) {
        planParameterWrap wrapObj = new planParameterWrap ();
        //List<Attachment> driverPacketAttachmentList = [select id,Name from Attachment where ParentId =: contactId and (Name LIKE '%Signed Document%' OR Name LIKE '%Driver_Packet%' OR Name LIKE'%MVR%')];        
           List<Attachment> driverPacketAttachmentList = new List<Attachment>();
        for (Attachment att : [select id,Name from Attachment where ParentId =: contactId and (Name LIKE '%Signed Document%' OR Name LIKE '%Driver_Packet%' OR Name LIKE'%MVR%')]){
            driverPacketAttachmentList.add(att);
        }
        if(driverPacketAttachmentList.size() > 0){
            for(Attachment objPacket: driverPacketAttachmentList ){
                String Name = objPacket.Name;
                if(Name.contains('MVR') ){
                    wrapObj.driverMVR = objPacket.Id;
                } 
                if(Name.contains('Signed Document') || Name.contains('Driver_Packet')) {
                    wrapObj.driverPacketId = objPacket.Id;
                }
            }
        }
        try{
            List<ContentDocumentLink> contentDocLink = [SELECT ContentDocumentId,LinkedEntityId FROM ContentDocumentLink where LinkedEntityId  =: contactId];
            Set<Id> ids = new Set<Id>();
            for(ContentDocumentLink obj:  contentDocLink){
                ids.add(obj.ContentDocumentId);
            }
            ContentDistribution contentDist = [SELECT id,ContentDownloadUrl from ContentDistribution where ContentDocumentId in : ids and Name=: Constants.signedDocument order by createddate desc limit 1];
            wrapObj.obj_content_version = contentDist.ContentDownloadUrl;            
        }catch(Exception e)
            {System.debug('Exception:-->'+e.getmessage()+'--'+e.getLineNumber());}        
          return Json.serialize(wrapObj);
    }
    public class planParameterWrap {        
        public string driverPacketId {get;set;}
        public string driverMVR {get;set;}       
        public string obj_content_version {get;set;}
    }
}