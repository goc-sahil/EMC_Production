public class ManagerDashboardController 
{
    public static String totalmileages{get;set;}
    public static String totalvariableamount{get;set;}
    public static String nameofEmployee{get;set;}
    public static String emailofEmployee{get;set;}
    public static Boolean showMyTeam {get;set;}
    public static string videoCustom {get;set;}
    public ManagerDashboardController() 
    {
        setEmployeeName();
        NewDashboardVideoLink__c videoCustomSetting = NewDashboardVideoLink__c.getOrgDefaults();
        videoCustom = json.serialize(videoCustomSetting );
    }
    public static String getAccountid()
    {
        if(ApexPages.currentPage().getParameters().containsKey('accid') && String.isNotBlank(ApexPages.currentPage().getParameters().get('accid')))        {
           return ApexPages.currentPage().getParameters().get('accid');
        } else {
            return '';
        } 
    }
    public static String getContactid()
    {
        if(ApexPages.currentPage().getParameters().containsKey('id') && String.isNotBlank(ApexPages.currentPage().getParameters().get('id'))) {
           return ApexPages.currentPage().getParameters().get('id');
        } else {
            return '';
        } 
    }
     public static String getShowTeam() {
        if (ApexPages.currentPage().getParameters().containsKey('showteam') && String.isNotBlank(ApexPages.currentPage().getParameters().get('showteam'))) {
            return ApexPages.currentPage().getParameters().get('showteam');
        } else {
            return '';
        }
    }
    public static PageReference getRedirected()
    {
        if(getContactid()!=''&& getAccountid()!='' && getShowTeam() != '')        {
            setEmployeeName(); // sets the Name of the Employee name and Show team record Values according to Database.
            return null;
        } else {
            // redirect to error page
            return null;
        }
    }
    
    @AuraEnabled(cacheable=true)
    public static String getDriverDetails(String managerId) {            
        List<contact> driverDataList = new List<contact>();
        driverDataList = [SELECT id,Address__r.Location_Lat_Long__Latitude__s,Address__r.Location_Lat_Long__Longitude__s, 
                            MailingCity, MailingState, MailingPostalCode,Map_Country__c,
                            Name, FirstName,External_Email__c,Driver_Type__c,Driving_States__c,Expiration_Date__c,Compliance_Mileage__c, Vehicle_Value__c,Time_Attandance__c,
                                        Fixed_Amount__c, compliancestatus__c, Car_Image__c,Notification_Message__c,Contact_Picture__c,Insurance_Plan__c,Plan_Years__c,Vehicle_Type__c,Insurance_Upload_Date__c,Insurance_Attachment_Id__c,
                                        Total_Approved_Mileages__c,Total_Annual_Reimbursement__c,Total_reimbursment__c,Monthly_Reimbursement__c, Biweek_Reimbursement__c, Bi_Week_Fixed_Amount__c, Monthly_Mileage_Rate__c,Maintenance__c,Tires__c, Insurance_Rate__c, License_Ragistration__c, Taxes__c,
                                        Depreciation__c, Total_Monthly_Costs__c, Business_Use__c,Fixed_Cost_Adjustment__c,Vehicle_Value_Check__c,Mileage_Meet__c,Vehicle_Age__c,Insurance__c, Notification_Date__c, Account.Bodily_Injury__c, Account.Uninsured_Motorist__c, 
                                        Account.Property_Damage__c, Account.Comprehensive__c, Account.Collision__c,Account.Umbrella_Coverage__c,Triplog_UserID__c,Reimbursement_Type__c,Reimbursement_Frequency__c, Account.Reimbursement_Type__c,Account.Bi_Weekly_Pay_Period__c,MobilePhone,Activation_Date__c,Account.CreatedDate
                             from Contact where Id =: managerId];
      return JSON.serialize(driverDataList ).unescapeHtml4();
    }
    
    @AuraEnabled(cacheable=true)
    public static String getVehicleValue(String accountId) { 
        List<Vehicle_Value__c> vehicleValueList = new List<Vehicle_Value__c>();
        vehicleValueList = [SELECT id,Vehicle_URL_Mapping__r.vehicle__c,Value__c, Plan_Years__c from Vehicle_Value__c where Account__c =: accountId];
        return JSON.serialize(vehicleValueList ).unescapeHtml4();
    }
    public static string getChartData(String did,Boolean showTeam,String accid,String role)
    {       
        return WrapperUtils.getChartData(did,showTeam,accid,role);
    }   
    public static void setEmployeeName() {
        Contact employee= [select Id,Name,showTeamRecord__c,External_Email__c from Contact where id =: getContactid()];
        if(employee!=null) {
            nameofEmployee= String.escapeSingleQuotes(employee.Name); // Name of the Employee
            emailofEmployee = employee.External_Email__c;
            showMyTeam = employee.showTeamRecord__c;
        } else {
            nameofEmployee='';
            emailofEmployee ='';
            showMyTeam = false;            
        }       
    }
    @RemoteAction
    public static string getAllDriversLastMonthUpdatedReimbursements(String did,String accid,boolean showTeamRecord,String role)
    {   
        if(BiWeeklyWrapperUtils.checkBiweekAccount(accid) == true){
            return String.escapeSingleQuotes(BiWeeklyWrapperUtils.getLastMonthReimbursements(did,accid,boolean.valueOf(showTeamRecord),role));
        } else {
            return String.escapeSingleQuotes(WrapperUtils.getLastMonthReimbursements(did,accid,boolean.valueOf(showTeamRecord),role));
        }
    }
    
    @AuraEnabled
    public static string getAllDriversLastMonthReimbursements(String accountId,String contactId,Boolean showTeam,String role)
    {             
        if(BiWeeklyWrapperUtils.checkBiweekAccount(accountId) == true){
            return String.escapeSingleQuotes(BiWeeklyWrapperUtils.getLastMonthReimbursements(contactId,accountId,showTeam,role));
        } else {
            return String.escapeSingleQuotes(WrapperUtils.getLastMonthReimbursements(contactId,accountId,showTeam,role));
        }
    }
    public static string getAllDriversLastMonthUpdatedUnapprovedReimburseclone(String did,String accid,boolean showTeamRecord,String role) 
    {   
        if(BiWeeklyWrapperUtils.checkBiweekAccount(accid) == true){
            return String.escapeSingleQuotes(BiWeeklyWrapperUtils.getUnapprovedReimbursements(did,accid,showTeamRecord,role));
        } else {
            return String.escapeSingleQuotes(WrapperUtils.getUnapprovedReimbursements(did,accid,showTeamRecord,role));
        } 
    }
    
    @RemoteAction
    public static string getAllDriversLastMonthUpdatedUnapprovedReimburseClone1(String did, String accid,string showTeamRecord,String role) 
    {
        if(BiWeeklyWrapperUtils.checkBiweekAccount(accid) == true){
            return String.escapeSingleQuotes(BiWeeklyWrapperUtils.getUnapprovedReimbursements(did,accid,boolean.valueOf(showTeamRecord),role));
        } else {
            return String.escapeSingleQuotes(WrapperUtils.getUnapprovedReimbursements(did,accid,boolean.valueOf(showTeamRecord),role));
        }
    }
    @AuraEnabled
    public static string getAllDriversLastMonthUnapprovedReimbursementsclone(String accountId,String contactId,Boolean showTeam,String role)
    {   
        if(BiWeeklyWrapperUtils.checkBiweekAccount(accountId) == true){
            return String.escapeSingleQuotes(BiWeeklyWrapperUtils.getUnapprovedReimbursements(contactId,accountId,showTeam,role));
        } else {
            return String.escapeSingleQuotes(WrapperUtils.getUnapprovedReimbursements(contactId,accountId,showTeam,role));
        }
    }
    
    @RemoteAction
    public static AsyncApexJob approveReimbursements(String reimbursements,String did,String accid,String showTeamRecord,String updateThreshold)
    {
        List<String> updatedlist = new List<String>();
        if(updateThreshold!=null && String.isNotBlank(updateThreshold))
        {            
            WrapperUtils.updateContactThresholdLimit(updateThreshold);
        }       
        ApproveReimBatch tripBtc = new ApproveReimBatch(reimbursements,BiWeeklyWrapperUtils.checkBiweekAccount(accid));
        ID batchprocessid = Database.executeBatch(tripBtc,1);
        AsyncApexJob aaj = [SELECT Id, Status,ExtendedStatus, JobItemsProcessed, TotalJobItems, NumberOfErrors 
                    FROM AsyncApexJob WHERE ID =: batchprocessid ];
        return aaj;      
    }
    @AuraEnabled
    public static List<String> UpdatedReimList(String did,String accid,String showTeamRecord,String role){
        List<String> updatedlist = new List<String>();
        updatedlist.add(getAllDriversLastMonthUpdatedReimbursements(did,accid,boolean.valueOf(showTeamRecord),role));
        updatedlist.add(getAllDriversLastMonthUpdatedUnapprovedReimburseClone(did,accid,boolean.valueOf(showTeamRecord),role));
        return updatedlist;
    }
    
    @AuraEnabled
    public static String CheckBatchStatus(ID batchprocessid){
        AsyncApexJob aaj = [SELECT Id, Status,ExtendedStatus, JobItemsProcessed, TotalJobItems, NumberOfErrors 
                    FROM AsyncApexJob WHERE ID =: batchprocessid ];        
        if(aaj.Status == 'Failed'){
            return aaj.Status+'='+aaj.ExtendedStatus; 
        }
        return aaj.Status;
    }

    @AuraEnabled
    public static AsyncApexJob approveMileagesClone(String mileages, String did, String accid,String showTeamRecord)
    {
        AsyncApexJob aaj;
        List<String> updatedlist = new List<String>();
        if(mileages!=null)
        {            
            ApproveReimBatch tripBtc = new ApproveReimBatch(mileages,BiWeeklyWrapperUtils.checkBiweekAccount(accid));
             ID batchprocessid = Database.executeBatch(tripBtc,1);
             aaj = [SELECT Id, Status,ExtendedStatus, JobItemsProcessed, TotalJobItems, NumberOfErrors 
                                     FROM AsyncApexJob WHERE ID =: batchprocessid ];
        }
        return aaj;
 }       
    
    @AuraEnabled
    public static String approveMileages(String checked,String selected,String unapprove,String name,String emailaddress)
    {        
        return WrapperUtils.approveMileagesForAdminDash(checked,selected,unapprove,name,emailaddress);
    }

    @AuraEnabled
    public static String getUnapprovedMileages(String reimbursementDetails,String accountId)
    {
        if(BiWeeklyWrapperUtils.checkBiweekAccount(accountId) == true){
            return String.escapeSingleQuotes(BiWeeklyWrapperUtils.getUnapprovedMileages(reimbursementDetails));
        } else{
            return String.escapeSingleQuotes(WrapperUtils.getUnapprovedMileages(reimbursementDetails));
        }
    }
    
    @AuraEnabled(cacheable=true)
    public static object totalNoofDriverforManager(String managerId) {
        AggregateResult[] groupedResults = [select COUNT(id) totalDriver from contact where Deactivated_Date__c = null and Manager__c =:  managerId];
        Object totalNoOfDriver = groupedResults[0].get('totalDriver');   
        return totalNoOfDriver;
    }
   
    @AuraEnabled(cacheable=true)
    public static  string onboardingStatus(String managerId,String accountId,String role) {
            map<String, Decimal>  onBoardingMap = new map<String, Decimal>();
            List<Contact> conList = new List<Contact>();
            Decimal packetCount = 0;
            Decimal insuranceCount = 0;
            Decimal packetandInsCount = 0;
            Decimal osStatusCount = 0;
            Decimal totalDriver = 0;
            Decimal completedCompStatus = 0;
            Decimal notCompletedCompStatus = 0;

            if(role=='Admin'){
                conList = [SELECT id,Packet__c,Insurance_Attachment_Id__c,compliancestatus__c 
                           FROM contact
                           WHERE Deactivated_Date__c = null
                           AND (Role__c != 'Admin' AND  Role__c != 'Manager')
                           AND Accountid =: accountId];
            } else if(role=='Manager'){
                conList = [select id,Packet__c,Insurance_Attachment_Id__c,compliancestatus__c from contact 
                            where Deactivated_Date__c = null
                            AND (Role__c != 'Admin' AND  Role__c != 'Manager') 
                            AND(Manager__c =: managerId 
                            OR (Manager__r.Manager__c =: managerId)
                            OR (Manager__r.Manager__r.Manager__c =: managerId)
                            OR (Manager__r.Manager__r.Manager__r.Manager__c =: managerId)
                            OR (Manager__r.Manager__r.Manager__r.Manager__r.Manager__c =: managerId))];
            }
            
            for(contact con : conList){
                totalDriver++;
                if(con.Packet__c != 'Completed' && con.Insurance_Attachment_Id__c != null){
                    packetCount++;
                }
                Decimal onBordPercentage = ((packetCount*100)/totalDriver);
                onBoardingMap.put('missingpacket', onBordPercentage);
                
                if(con.Packet__c == 'Completed' && con.Insurance_Attachment_Id__c == null){
                    insuranceCount++;
                }
                Decimal insurancePercentage = (insuranceCount*100)/totalDriver;
                onBoardingMap.put('missingInsurance', insurancePercentage);
                
                if(con.Packet__c != 'Completed' && con.Insurance_Attachment_Id__c == null){
                    packetandInsCount++;
                }
                
                Decimal missingpacinsurancePercentage = (packetandInsCount*100)/totalDriver;
                onBoardingMap.put('missingPacketandmissingInsurance', missingpacinsurancePercentage);
                
                if(con.Packet__c == 'Completed' && con.Insurance_Attachment_Id__c != null){
                    osStatusCount++;
                }
                
                Decimal completePercentage = (osStatusCount*100)/totalDriver;
                onBoardingMap.put('Complete', completePercentage);

                if(con.compliancestatus__c == 'Yes'){
                    completedCompStatus++;
                }
                
                Decimal completeCompPercentage = ((completedCompStatus*100)/totalDriver).setScale(1);
                onBoardingMap.put('Compliant', completeCompPercentage);
    
                if(con.compliancestatus__c != 'Yes'){
                    notCompletedCompStatus++;
                }
                
                Decimal notCompleteCompPercentage = ((notCompletedCompStatus*100)/totalDriver).setScale(1);
                onBoardingMap.put('NonCompliant', notCompleteCompPercentage);
            }
        return json.serialize(onBoardingMap);
    }
    
    @AuraEnabled(cacheable=true)
    public Static String insuranceReport(String managerId,String accountId,String role){
        map<String , Integer>  InsuranceMap = new map<String, Integer>();
        List<Contact> conList = new List<Contact>();
            Integer meetingMinimumCount = 0;
            Integer insuranceCardCount = 0;
            Integer underMinimumCount = 0;
            Integer expiredInsCount = 0;
         Integer yesCount = 0;
         Integer noExpirationDateCount = 0;
         
         if(role=='Admin'){
            conList = [SELECT id,Insurance__c,Packet__c  
                       FROM contact 
                       WHERE Deactivated_Date__c = null 
                       AND (Role__c != 'Admin' AND  Role__c != 'Manager')
                       AND Accountid =: accountId];
         } else if(role=='Manager'){
            conList = [select id,Insurance__c,Packet__c  from contact 
                          where Deactivated_Date__c = null
                            AND (Role__c != 'Admin' AND  Role__c != 'Manager')
                            AND(Manager__c =: managerId 
                            OR (Manager__r.Manager__c =: managerId)
                            OR (Manager__r.Manager__r.Manager__c =: managerId)
                            OR (Manager__r.Manager__r.Manager__r.Manager__c =: managerId)
                            OR (Manager__r.Manager__r.Manager__r.Manager__r.Manager__c =: managerId))];
         }
            for(contact con : conList){
                if(con.Insurance__c == 'Not Meeting Plan Minimum'){
                    meetingMinimumCount++;
                }
                InsuranceMap.put('NotMeetingMinimum', meetingMinimumCount);
                
                if(con.Insurance__c == 'Insurance Card' ){
                    insuranceCardCount++;
                }
                InsuranceMap.put('InsuranceCard', insuranceCardCount);
                // Not Submitted value should be change as once client gives the confirmation of picklist field value change.
                if(con.Insurance__c == 'Not Submitted'){
                    underMinimumCount++;
                }
                InsuranceMap.put('NotSubmitted', underMinimumCount);
                
                if(con.Insurance__c == 'Expired'){
                    expiredInsCount++;
                }
                InsuranceMap.put('ExpiredInsurance', expiredInsCount);
                
                 if(con.Insurance__c == 'Yes'){
                    yesCount++;
                }
                InsuranceMap.put('Yes', yesCount);
                
                 if(con.Insurance__c == 'No Expiration Date'){
                    noExpirationDateCount++;
                }
                InsuranceMap.put('noExpirationDate', noExpirationDateCount);
            }
        return json.serialize(InsuranceMap);
    }

    @AuraEnabled
    public static string myTeamDetails(String managerId, String accountId, Boolean showteam,String role){
        List<ContactWrapper> conWrapList = new List<ContactWrapper >();
        List<Contact> contactList = new List<Contact>();
        
        if(showTeam == true && role=='Manager' || showTeam == false && role=='Admin') {
            contactList = [SELECT Id, Name,Fixed_Amount__c, Activation_Date__c, Half_Fixed_Amount__c,Email,Reimbursement_Frequency__c 
                                FROM Contact 
                                WHERE (Manager__c =: managerId 
                                    OR (Manager__r.Manager__c =: managerId)
                                    OR (Manager__r.Manager__r.Manager__c =: managerId)
                                    OR (Manager__r.Manager__r.Manager__r.Manager__c =: managerId)
                                    OR (Manager__r.Manager__r.Manager__r.Manager__r.Manager__c =: managerId))
                                    AND Role__c != 'Admin' AND Role__c != 'Manager' AND  Deactivated_Date__c = null Order by Name asc];
        } else if(showTeam == false && role=='Manager') {
            contactList = [SELECT Id, Name,Fixed_Amount__c, Activation_Date__c, Half_Fixed_Amount__c,Email,Reimbursement_Frequency__c 
                                FROM Contact 
                                WHERE Manager__c =: managerId
                                AND Role__c != 'Admin' AND Role__c != 'Manager' AND  Deactivated_Date__c = null Order by Name asc];
        } else if(showTeam == true && role=='Admin'){
            contactList = [SELECT Id, Name,Fixed_Amount__c, Activation_Date__c, Half_Fixed_Amount__c,Email,Reimbursement_Frequency__c 
                                FROM Contact 
                                WHERE Accountid =: accountId
                                AND Role__c != 'Admin' AND Role__c != 'Manager' AND  Deactivated_Date__c = null Order by Name asc];
        }

        for(Contact conList : contactList){
                ContactWrapper conWrap = new ContactWrapper(); 
                conWrap.id = conList.Id;
                conWrap.name = conList.Name;
                conWrap.activationDate = conList.Activation_Date__c;
               // if(conList.Reimbursement_Frequency__c == 'Monthly Reimbursement'){
                    conWrap.fixedamount = conList.Fixed_Amount__c != null ? conList.Fixed_Amount__c : 0.00;
                /*} else {
                    conWrap.fixedamount = conList.Half_Fixed_Amount__c!= null ? conList.Half_Fixed_Amount__c : 0.00;
                }*/
 
                conWrap.email = conList.Email;
                conWrapList.add(conWrap);
            }
            String wrapjson = JSON.serialize(conWrapList);
            return wrapjson;
    }

    @AuraEnabled
    public static string highRiskDriversDetails(String managerId,String accountId,boolean highMileage, boolean showTeam,String role){
        List<ContactWrapperForMileage> conWrapList = new List<ContactWrapperForMileage >();
        Set<String> contactIds = new Set<String>();
        String lastMonth = Utils.fetchMonths(1, 0)[0];

        String query = 'SELECT id, Name, Month__c, Contact_Id__c, Contact_Id__r.name, Total_Mileage__c, High_Risk_Total_Mileages__c FROM Employee_Reimbursement__c ';
        query += ' WHERE Month__c =\''+ lastMonth + '\'';

        if(showTeam == true && role=='Manager' || showTeam == false && role=='Admin') {
            query += ' AND ((Contact_Id__r.Manager__c = \'' + managerId + '\' )' ;
            query +=   ' OR (Contact_Id__r.Manager__r.Manager__c = \'' + managerId + '\' )' ;
            query +=   ' OR (Contact_Id__r.Manager__r.Manager__r.Manager__c = \'' + managerId + '\' )' ;
            query +=   ' OR (Contact_Id__r.Manager__r.Manager__r.Manager__r.Manager__c = \'' + managerId + '\' ))' ;
        } else if(showTeam == false && role=='Manager') {
            query += ' AND Contact_Id__r.Manager__c = \'' + managerId + '\' ' ;
        } else if(showTeam == true && role=='Admin'){
            query += ' AND Contact_Id__r.Accountid = \'' + accountId + '\' ';
        }

        if(highMileage){
            query += ' AND Total_Mileage__c > 0 ';
            query += ' ORDER BY Total_Mileage__c desc ';
        }else{   
            query += ' AND High_Risk_Total_Mileages__c > 0 ';
            query += ' ORDER BY High_Risk_Total_Mileages__c desc';   
        }
        List<Employee_Reimbursement__c> reimDetail = new List<Employee_Reimbursement__c>();
        try {
            reimDetail = Database.query(query); 
        } catch(System.QueryException qe) {
            System.debug(qe.getMessage());
        }

        for(Employee_Reimbursement__c currentReimbursement : reimDetail) {
            ContactWrapperForMileage conWrap = new ContactWrapperForMileage(); 
                conWrap.id = currentReimbursement.Contact_Id__c;
                conWrap.name = currentReimbursement.Contact_Id__r.Name;
                conWrap.mileage = highMileage == true ? currentReimbursement.Total_Mileage__c : currentReimbursement.High_Risk_Total_Mileages__c;
                conWrapList.add(conWrap);
        }
        if(conWrapList.size() > 0){
            String wrapjson = JSON.serialize(conWrapList);
            return wrapjson;
        }
        else {
            return 'No Trips Found More than 250 miles for this contact';
        }
    }

    @AuraEnabled    
    public static String getNotificationMessageList(String conId,Integer year,String month){  
        return LWCWrapperUtils.getNotificationMessageList(conId,year,month);       
    }   
    
    @AuraEnabled    
    public static string updateNotificationMessage(String msgId,Integer year,String month){         
        return LWCWrapperUtils.updateNotificationMessage(msgId,year,month);        
    }   

    @AuraEnabled    
    public static string reimbursementForHighMileageOrRisk(String managerId,String accountId,String month,boolean showteam,boolean highMileage,String role){         
        return LWCWrapperUtils.reimbursementForHighMileageOrRisk(managerId,accountId,month,showteam,highMileage,role);  
    }   

    @AuraEnabled(cacheable=true)
    public static String managerContactData(String managerId,String accountId,String role){
        List<contact> driverDataList = new List<contact>();
        if(role=='Admin'){
            driverDataList = [SELECT id,Name,Address__r.Location_Lat_Long__Latitude__s,Address__r.Location_Lat_Long__Longitude__s,Fixed_Amount__c, 
                            MailingCity, MailingState,Map_Country__c, MailingPostalCode,Reimbursement_Frequency__c,Half_Fixed_Amount__c
                            from Contact 
                            WHERE Accountid =: accountId and Deactivated_Date__c = null AND (Role__c != 'Admin' AND  Role__c != 'Manager')];
        } else if(role=='Manager'){
            driverDataList = [SELECT id,Name,Address__r.Location_Lat_Long__Latitude__s,Address__r.Location_Lat_Long__Longitude__s,Fixed_Amount__c, 
                            MailingCity, MailingState,Map_Country__c, MailingPostalCode,Reimbursement_Frequency__c,Half_Fixed_Amount__c
                            from Contact 
                            WHERE (Manager__c =: managerId 
                            OR (Manager__r.Manager__c =: managerId)
                            OR (Manager__r.Manager__r.Manager__c =: managerId)
                            OR (Manager__r.Manager__r.Manager__r.Manager__c =: managerId)
                            OR (Manager__r.Manager__r.Manager__r.Manager__r.Manager__c =: managerId)) AND Deactivated_Date__c = null AND (Role__c != 'Admin' AND  Role__c != 'Manager')];
        }       
         return JSON.serialize(driverDataList ).unescapeHtml4();
    }

    @AuraEnabled
    public static string accountMonthList(String accountId){
        return LWCWrapperUtils.accountMonthList(accountId);
    }

    @AuraEnabled
    public static String getMileages(String clickedMonth,string clickedYear,String did) {
        return WrapperUtils.getMileages(clickedMonth,clickedYear,did);
    }

    @AuraEnabled
    public static string contactReimMonthList(String contactId){
        return LWCWrapperUtils.contactReimMonthList(contactId);
    }

    @AuraEnabled
    public static string getLastMonthReimbursements(String accountId,String contactId,Boolean showTeam,String month,String role){
        return LWCWrapperUtils.getLastMonthReimbursements(contactId,accountId,showTeam,role,month);
    }

    @AuraEnabled
    public static string MassSyncTrips(String accountId,String startDate,String endDate,String month,String tripStatus,String activityStatus){
        MassSyncTrips  obj = new MassSyncTrips(accountId,startDate,endDate,month,tripStatus,false);
        Database.executeBatch (obj,1);
        return 'Success';
    }

    @AuraEnabled
    public static string MassSyncTripsForReimbursements(String reimbursements){
        List<String> reimIds = new List<String>();
        reimIds = (List<String>) System.JSON.deserialize(reimbursements, List<String>.class);
        MassSyncTripforCommute obj = new MassSyncTripforCommute(reimIds);
        Database.executeBatch (obj,1);
        return 'Success';
    }
    
    @AuraEnabled
    public static string DeleteMileages(String reimbursements){
        List<String> reimIds = new List<String>();
        reimIds = (List<String>) System.JSON.deserialize(reimbursements, List<String>.class);
        if(!reimIds.isempty()){
        delete [select id  from Employee_Mileage__c where EmployeeReimbursement__c IN :reimIds and Trip_Status__c = 'Not Approved Yet' and Trip_Id__c != null];
        }
        return 'Success';
    }
    
    
    @AuraEnabled
    public static string MassSyncTripsForBiweek(String biWeek,String accID){
        MassSyncTripforCommute obj = new MassSyncTripforCommute(biWeek,accID);
        Database.executeBatch (obj,1);
        return 'Success';
    }
    
    @AuraEnabled
    public static String loginRedirection(String contactId){
        Contact  contactObj = new Contact ();
        contactObj = [SELECT id,Check_OnBoarding__c,
                            Role__c,
                            showTeamRecord__c, 
                            AccountId, 
                            Insurance_Attachment_Id__c, 
                            Driver_Type__c, 
                            Driver_Packet_Status__c, 
                            Insurance_Declaration_Status__c,
                            Plan_Preview__c,
                            Mburse_Dashboard__c,  
                            Watch_Meeting__c
                        FROM Contact
                        WHERE Id =: contactId];
        if(contactObj != null ){
            
            String pageRef;
            if(contactObj.Role__c == StaticValues.ROLE_DRIVERMANAGER){
            
            } else if(contactObj.Role__c == StaticValues.roleAdminDriver){
            
            }
            
        } 
        return 'success';
    }
    
    @AuraEnabled
    Public Static String complRptDownloadtData (String managerId,String accountId,String role){
        List<Contact> conList = new List<Contact>();
        if(role=='Admin'){
            conList = [select id,Name,Email,compliancestatus__c,isActive__c from contact where Deactivated_Date__c = null and Accountid =: accountId and Role__c != 'Admin' and Role__c != 'Manager'];
        } else if(role=='Manager'){
            conList = [select id,Name,Email,compliancestatus__c,isActive__c from contact 
                       where Deactivated_Date__c = null
                       AND (Role__c != 'Admin' AND  Role__c != 'Manager')
                       AND(Manager__c =: managerId 
                           OR (Manager__r.Manager__c =: managerId)
                           OR (Manager__r.Manager__r.Manager__c =: managerId)
                           OR (Manager__r.Manager__r.Manager__r.Manager__c =: managerId)
                           OR (Manager__r.Manager__r.Manager__r.Manager__r.Manager__c =: managerId))];
        }
        string conListJson = JSON.serialize(conList);
        return conListJson;
    }
    
    @AuraEnabled
    Public Static String onboardRptDownloadtData (String managerId,String accountId,String role){
        List<Contact> conList = new List<Contact>();
        if(role == 'Admin'){
            conList = [select Name,Expiration_Date__c,Email,Onboarding_Status__c,Insurance__c,Hello_Sign_Status__c,Hello_Sign_Admin_Status__c,Schedule_Driver_Meeting__c,Activation_Date__c,isActive__c from contact where Deactivated_Date__c = null and Accountid =: accountId and Role__c != 'Admin' and Role__c != 'Manager'];
        } else if(role=='Manager'){
            conList = [select Name,Expiration_Date__c,Email,Onboarding_Status__c,Insurance__c,Hello_Sign_Status__c,Hello_Sign_Admin_Status__c,Schedule_Driver_Meeting__c,Activation_Date__c,isActive__c from contact  
                       where Deactivated_Date__c = null
                       AND (Role__c != 'Admin' AND  Role__c != 'Manager')
                       AND(Manager__c =: managerId 
                           OR (Manager__r.Manager__c =: managerId)
                           OR (Manager__r.Manager__r.Manager__c =: managerId)
                           OR (Manager__r.Manager__r.Manager__r.Manager__c =: managerId)
                           OR (Manager__r.Manager__r.Manager__r.Manager__r.Manager__c =: managerId))];
        }
        string conListJson = JSON.serialize(conList);
        return conListJson;
    }
        
    Public class HighRiskContactWrapper{
        public String id {get;set;}
        public String name {get;set;}
    }

    Public class ContactWrapper{
        public String id {get;set;}
        public String name {get;set;}
        public Date activationDate {get;set;}
        public Decimal fixedamount{get;set;}
        public String email {get;set;}
    }
    Public class ContactWrapperForMileage{
        public String id {get;set;}
        public String name {get;set;}
        public Decimal mileage{get;set;}
    }
}