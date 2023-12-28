/**
@author Natavar Ghodasara
@date 26th Feb 2019
@description RosterController is used to show/edit Employee details.
*/
global without sharing class RosterController 
{
    public static String query;
    public static string jsonSubset;
    /**
@author Natavar Ghodasara
@date 26th Feb 2019
@description RosterController is Default Constructor.    
*/
    public date accPayperiodStart {get; set;}
    public string accPayDays {get; set;}
    public boolean accTrueDialog {get; set;}
    public RosterController() 
    {
        query='';
        for(Account acc : [SELECT id, Pay_Period_Start_Date__c, 
                           Pay_Period_Days__c, True_Dialog__c 
                           FROM Account 
                           WHERE id =: getAccountid() ]){
                               accPayperiodStart = acc.Pay_Period_Start_Date__c != null ? acc.Pay_Period_Start_Date__c : null;
                               accPayDays = string.valueOf(acc.Pay_Period_Days__c);
                               accTrueDialog = acc.True_Dialog__c != null ? acc.True_Dialog__c : false;
                           }
    }
    public static String getAccountid() {
        if (ApexPages.currentPage().getParameters().containsKey('accid') && String.isNotBlank(ApexPages.currentPage().getParameters().get('accid'))) {
            return ApexPages.currentPage().getParameters().get('accid');
        } else {
            return '';
        }
    }
    public static String getContactid() {
        if (ApexPages.currentPage().getParameters().containsKey('id') && String.isNotBlank(ApexPages.currentPage().getParameters().get('id'))) {
            return ApexPages.currentPage().getParameters().get('id');
        } else {
            return '';
        }
    }
    public static PageReference getRedirected() {
        
        if (getContactid() != '' && getAccountid() != '') {
            return null;
        } else {
            return null;
        }
        
    }   
    /**
@author Natavar Ghodasara
@date 26th Feb 2019
@description editNewEmployee is used to edit Employee to the system.
@param String employee details. 
*/
    //@RemoteAction
    @AuraEnabled
    public static String editInlineNewEmployee(String listofemployee,String accid,String contactid)
    {
        ResultResponse result = new ResultResponse();
        result.hasError = false;
        result.message = '';
        
        if(listofemployee!=null)
        {
            system.debug('inside roster controller');
            query='';
            List<EmployeeDetails> employeeList = new List<EmployeeDetails>();
            employeeList = (List<EmployeeDetails>)Json.deserialize(listofemployee,List<EmployeeDetails>.class);
            List<Contact> updateEmployeeList = new List<Contact>();
            List<String> deactivatedEmployees = new List<String>();
            MAP<Id,Contact> contactMap = new MAP<Id,Contact>();
            for(EmployeeDetails currentEmployee : employeeList)
            {
                System.debug('currentEmployee '+currentEmployee );
                Contact currentContact = new Contact();
                currentContact = WrapperUtils.getContact(currentEmployee);
                if(currentContact.Deactivated_Date__c != null && currentContact.IsDeactivated__c!=true && currentContact.Deactivated_Date__c.date()<=System.today())
                {
                    deactivatedEmployees.add(currentContact.id);
                }
                System.debug('currentContact='+currentContact);
                updateEmployeeList.add(currentContact);
            }
            contactMap.putall(updateEmployeeList);
            if(contactMap.size()>0)
            {
                try{
                    System.debug('updateEmployeeList'+updateEmployeeList);
                    update contactMap.values();
                } catch (System.DmlException e){
                    //string type = name;
                    result.hasError = true;
                    for (Integer i = 0; i < e.getNumDml(); i++) {
                        system.debug('-------+++++++++getDmlId+++++++'+e.getDmlId(i));
                        system.debug('-------++++++++getDmlMessage++++++++'+e.getDmlType(i));
                        system.debug('-------++++++++getDmlMessage++++++++'+e.getDmlMessage(i));
                        if(e.getDmlType(i) == System.StatusCode.CANNOT_INSERT_UPDATE_ACTIVATE_ENTITY){
                            result.message = e.getDmlId(i)+'=='+'User is deactivated so you can not create a reimbursement';
                        }else {
                            result.message = e.getDmlId(i)+'=='+e.getDmlMessage(i);
                        }
                    }
                    return JSON.Serialize(result);
                }
            }
            
            if(deactivatedEmployees.size()>0)
            {
                Database.executeBatch(new DeActivatedUserBatch(deactivatedEmployees),1);
            }
        }
        return JSON.Serialize(result);
    }
    
    public static void sendExceptionMails(String message,string convertedmsg){
        Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
        List<Messaging.SingleEmailMessage> massEmailMessageList = new List<Messaging.SingleEmailMessage>();
        EmailTemplate templateId = [Select id, subject, body, HTMLValue from EmailTemplate where name = 'ExceptionEmailTemplate' Limit 1];
        
        String addressLabel = Label.Test_emailAddress;
        List<String> obj_toaddresses = new List<String>();
        if(addressLabel.contains(',')){
            List<String> addresslist = new List<String>();
            addresslist = addressLabel.split(',');
            for(String s : addresslist)
            {
                obj_toaddresses.add(s);
            }
        }
        else
        {
            obj_toaddresses.add(addressLabel);
        }
        
        email.setToAddresses(obj_toaddresses);
        string bodyOftemp = templateId.body;
        bodyOftemp = bodyOftemp.replace('{!exceptionmessage}',message);
        bodyOftemp = bodyOftemp.replace('{!convertedexceptionmessage}',convertedmsg);
        
        email.setTemplateID(templateId.Id); 
        email.setSubject(templateId.subject); 
        email.setPlainTextBody(bodyOftemp); 
        massEmailMessageList.add(email);
        if(massEmailMessageList.size()>0 && !Test.IsRunningTest())
        {                        
            Messaging.sendEmail(massEmailMessageList);
        }
    }
    
    @AuraEnabled
    public static String getPickListValuesIntoList(String accid)
    {         
        List<String> vehicleList = new List<String>();
        List<Account> currentAccountList = [select id,Vehicle_Types__c,CreatedDate from Account where id =: accid Limit 1];        
        vehicleList.add(String.valueOf(currentAccountList[0].CreatedDate));
        for(Account currentAccount : currentAccountList) {
            if(currentAccount.Vehicle_Types__c!=null && currentAccount.Vehicle_Types__c!='') {
                vehicleList.add(currentAccount.Vehicle_Types__c);
            }
        }        
        return Json.serialize(vehicleList);
    }
    /**
@author Natavar Ghodasara
@date 26th Feb 2019
@description editNewEmployee is used to edit Employee to the system.
@param String employee details. 
*/
    //@RemoteAction
    @AuraEnabled
    public static String manageEmployee(String addNewEmployee,String accid,String contactid)
    {
    system.debug('addNewEmployee==' + addNewEmployee);
        system.debug('accid==' + accid);
            system.debug('contactid==' + contactid);
        ResultResponse result = new ResultResponse();
        result.hasError = false;
        result.message = '';
        
        List<EmployeeDetails> employeeList = new List<EmployeeDetails>();
        employeeList = (List<EmployeeDetails>)Json.deserialize(addNewEmployee,List<EmployeeDetails>.class);
         system.debug('employeeList.size()==' + employeeList.size());
        if(employeeList.size() > 0) 
        {
            employeeList[0].accountId = accid;
            Contact newContact = new Contact();
            newContact = WrapperUtils.getNewContact(employeeList[0]);
           
            if(employeeList[0].userid != null)
            {
                newContact.id = employeeList[0].userid;
                try
                {   
                    update newContact;
                }
                catch(System.DmlException e)
                {                        
                    result.hasError = true;                      
                    result.message = e.getDmlMessage(0);
                    return Json.Serialize(result);                       
                }
                if(employeeList[0].resetReimbursementLink==true)
                {
                    System.ResetPasswordResult currectUserResult = System.resetPassword(((User)(getUser(newContact.id))).id, true);     
                }
            }
            else
            {
                system.debug('inside else conn');
                newContact.AccountId = accid;
                try
                {   
                    insert newContact; 
                }
                catch(System.DmlException e)
                {                        
                    result.hasError = true;
                    result.message = e.getDmlMessage(0);
                    return Json.Serialize(result);                                     
                }
                // New Code added by natavar on 21/11/2019
                List<id> newListContactids = new List<id>();
                if(newContact.role__c != null && newContact.role__c != 'Admin' && newContact.role__c !='Manager')
                {
                    newListContactids.add(newContact.id);
                }
                
               /* if(newListContactids.size()>0 && !Test.isRunningTest())
                {
                    postHTTPCreateNewUserTriplog(newListContactids); 
                } */
            }
            system.debug('outside');                
            result.result = getlistAllEmployees(accid,contactid); 
        }
             system.debug('result==' + result);      
        return Json.Serialize(result);
        
    }
    
    public static string getExcetionTypes(String name,String message, Integer lineNumber ){
        
        if(name == 'TypeException'){
            system.debug('inside type exception');
            if(message.trim().toUpperCase() == ('Invalid decimal: .').trim().toUpperCase()){
                sendExceptionMails(message+String.valueOf(lineNumber),getCustomExceptionMessage('1'));
                return getCustomExceptionMessage('1');
            }
        }
        else if (name == 'System.DmlException') {
            
            if(message.trim().toUpperCase().Contains('UPDATE FAILED') || message.trim().toUpperCase().Contains('INSERT FAILED')){
                String msg = message.trim().toUpperCase();
                if(msg.Contains('[')){
                    string fied = msg.substringBetween('[',']');
                }
                
                sendExceptionMails(message+String.valueOf(lineNumber),getCustomExceptionMessage('2'));
                return getCustomExceptionMessage('2');
            }
        }
        else if (name == 'QueryException') {
            if(message.trim().toUpperCase().Contains('List has no rows')){
                String msg = message.trim().toUpperCase();
                if(msg.Contains('[')){
                    string fied = msg.substringBetween('[',']');
                }
                sendExceptionMails(message+String.valueOf(lineNumber),getCustomExceptionMessage('3'));
                return getCustomExceptionMessage('3');
            }
        }
        else if(name == 'NullPointerException'){
            if(message.trim().toUpperCase().Contains('Attempt to de-reference')){
                String msg = message.trim().toUpperCase();
                if(msg.Contains('[')){
                    string fied = msg.substringBetween('[',']');
                }
                sendExceptionMails(message+String.valueOf(lineNumber),getCustomExceptionMessage('4'));
                return getCustomExceptionMessage('4');
            }
        }
        
        return Label.ExceptionLabel;
    }
    
    public static string getCustomExceptionMessage(String namevalue){
        system.debug('getCustomExceptionMessage');
        EmailExceptionMessages__c customSetValue = EmailExceptionMessages__c.getValues(namevalue); 
        if(customSetValue != null){
            return customSetValue.Message__c;
        }
        else{
            return Label.ExceptionLabel;
        }
    }
    
    public static User getUser(String passedContactId)
    {
        User currentUser = [Select id from User where ContactId=:passedContactId limit 1];
        return currentUser;
    }
    @Future(callout = true)
    webservice static void postHTTPCreateNewUserTriplog(List<Id> newListContact) 
    {
        String MLOGACCOUNT = System.Label.Triplog_New_URL  + ',' + System.Label.Triplog_New_URL2;
        //String url = 'https://triplogmileage.com/web/api/users';
        Http h;
        HttpRequest req;
        HttpResponse res;
        List<Contact> contacts = new List<Contact>([SELECT Id, 
                                                    FirstName,
                                                    LastName,
                                                    Phone,
                                                    External_Email__c,
                                                    Triplog_UserID__c,
                                                    Driving_States__c,
                                                    isCommunityUser__c,
                                                    Account.Triplog_API__c 
                                                    FROM Contact 
                                                    WHERE Id IN: newListContact]);
        List<Contact> listToUpdate = new List<Contact>();
        for(Contact newContact : contacts) {
            JSONGenerator gen = JSON.createGenerator(true);
            gen.writeStartObject();
            if(newContact.FirstName != null){
                gen.writeStringField('firstName', newContact.FirstName);
            }            
            gen.writeStringField('lastName', newContact.LastName);
            gen.writeStringField('email', newContact.External_Email__c);
            gen.writeStringField('phone', (newContact.Phone != null) ? newContact.Phone :'');
            gen.writeStringField('isDriver', 'true');
            if(newContact.Driving_States__c != null || newContact.Driving_States__c == '') {
                String x = newContact.Driving_States__c;
                x = x.replaceAll(';', ',');
                gen.writeStringField('territory', (x != null) ? x :'');
            }
            gen.writeEndObject();
            String jsonstringconvert = gen.getAsString();
            String baseURL = !MLOGACCOUNT.Contains(newContact.Account.Triplog_API__c) ? StaticValues.TRIPLOG_BASEURL : StaticValues.MLOG_BASEURL;
            // HTTP request
            h = new Http();
            req = new HttpRequest();
            req.setEndpoint(baseURL + StaticValues.DEACTIVATE_USER_SUFFIX);
            system.debug('baseURL-->'+baseURL + StaticValues.DEACTIVATE_USER_SUFFIX);
            req.setMethod('POST');
            req.setTimeout(120000);
            req.setbody(jsonstringconvert);
            req.setHeader('Content-Type', 'application/json');
            req.setHeader('Authorization', 'apikey '+ newContact.Account.Triplog_API__c);
            if(!Test.isRunningTest()){
                res = h.send(req);
                if(res.getStatusCode() == 200) {
                    TripLogJSONPost tripLogRes = TripLogJSONPost.parse(res.getBody());
                    newContact.isCommunityUser__c = true;
                    newContact.Triplog_UserID__c = String.valueOf(tripLogRes.user.id);
                    listToUpdate.add(newContact);
                    system.debug('getbody'+res.getBody());
                } else {
                    ApexPages.Message errorMessage = new ApexPages.Message(ApexPages.Severity.ERROR, 'User not create in Triplog');
                }
            }
        }
        if(!listToUpdate.isEmpty()){
            
            try{
                update listToUpdate;
            } catch (Exception e){
                //string type = name;
                //String message = return getExcetionTypes(e.getTypeName(),e.getMessage(),e.getlinenumber());
                
            }
        }
    } 
    @AuraEnabled
    public static string getAllManagers(String accID)
    {
        query='';       
        query = 'Select id,Name from Contact where ( accountid=\''+accID+'\'and Deactivated_Date__c = null and (Role__c=\'Manager'+'\' OR Role__c=\'Driver/Manager'+'\' OR Role__c=\'Admin'+'\' OR Role__c = \''+StaticValues.roleAdminDriver+'\' ))';
        List<Contact> managerlist = (List<Contact>)ExecuteQueryUtil.getListFromMap(ExecuteQueryUtil.getRecordMapWithSinglesObject(query));
        return JSON.serialize(managerlist);
    }
    //@RemoteAction   
    @AuraEnabled
    public static String getlistAllEmployees(String accid,String contactid)
    {   
        Map<Id, Decimal> reimTotalMap = new Map<Id, Decimal>();
        Map<Id, Decimal> mileageTotalMap = new Map<Id, Decimal>();
        for(AggregateResult ar : [SELECT Contact_Id__c cid, AVG(Monthly_Reimbursement_Total__c) rtotal,
                                  AVG(Total_Mileage__c) mtotal
                                  FROM Employee_Reimbursement__c
                                  WHERE Contact_Id__r.AccountId =: accid
                                  AND Month__c In: getMonths(System.today().Month())
                                  GROUP BY Contact_Id__c]) {
                                      reimTotalMap.put((Id)ar.get('cid'), (Decimal) ar.get('rtotal'));
                                      mileageTotalMap.put((Id)ar.get('cid'), (Decimal) ar.get('mtotal'));
                                  }
        
        List<EmployeeDetails> employeeList = new List<EmployeeDetails>();
        for(Contact currentContact:[SELECT id,Accountid,FirstName,Lastname,
                                    Email,External_Email__c,Deactivated_Date__c,
                                    Role__c,Manager__c,Manager__r.Name,
                                    MailingPostalCode,Driving_States__c,Hello_Sign_Status__c,
                                    MailingState,MailingCity,Employee_ID__c,Hello_Sign_Request_Id__c,
                                    Activation_Date__c,Vehicle_Type__c,Last_Pay_Date__c,
                                    Monthly_Mileage_Limit__c,Added_Date__c,Fixed_Amount__c,
                                    compliancestatus__c,Total_Reimbursement__c,IsDeactivated__c,
                                    Monthly__c,Sage_100_ID__c,GL_Code__c,App__c,Company__c,
                                    MobilePhone,Phone,Branch_Number__c,Branch_Name__c,
                                    Freeze__c,Driver_Type__c,Territory__c,Code__c,District__c,
                                    Department__c,Job_Title__c,Employee_Netchex_Id__c,Dept__c,
                                    Average_Mileage__c,Average_Reimbursement__c,Deactivated_By__c,
                                    Division__c,Department,LOA_Start_Date__c,LOA_End_Date__c,LOA_Fixed_Amount__c,
                                    Payroll_Period__c,Final_Payroll_Amount__c,First_Payroll__c,AM__c,AN__c,Account.Cell_Phone__c, Account.Reimbursement_Frequency__c,
                                    Monthly_Reimbursement__c, Biweek_Reimbursement__c, Time_Attandance__c,Cost_Code__c,Last_Synced__c,App_Settings__c,Mileage_for_deduct__c,BP_Code__c,Reimbursement_Frequency__c,Cell_Phone__c
                                    FROM Contact 
                                    WHERE Accountid=:accid]) //Branch_Number__c,Branch_Name__c 
        {                
            //employeeList.add(WrapperUtils.getEmployeeDetails(currentContact, reimTotalMap.get(currentContact.id), mileageTotalMap.get(currentContact.id)));
            employeeList.add(WrapperUtils.getEmployeeDetails(currentContact, currentContact.Average_Reimbursement__c,currentContact.Average_Mileage__c));
        }
        
        return JSON.serialize(employeeList);     
    }
    @AuraEnabled
    public static String getRoles()
    {
        List<String> roleList = new List<String>();
        Schema.DescribeFieldResult fieldResult = Contact.Role__c.getDescribe();
        List<Schema.PicklistEntry> pickListEntries = fieldResult.getPicklistValues();
        for(Schema.PicklistEntry currentEntries : pickListEntries)
        {
            roleList.add(currentEntries.getValue());
        }
        return JSON.serialize(roleList);     
    }
    @AuraEnabled
    public static String getDriverType()
    {
        List<String> driverTypeList = new List<String>();
        Schema.DescribeFieldResult fieldResult = Contact.Driver_Type__c.getDescribe();
        List<Schema.PicklistEntry> pickListEntries = fieldResult.getPicklistValues();
        for(Schema.PicklistEntry currentEntries : pickListEntries)
        {
            driverTypeList.add(currentEntries.getValue());
        }
        return JSON.serialize(driverTypeList);     
    }
    
    @AuraEnabled
    public static String getDrivingStates()
    {
        List<String> drivingStateList = new List<String>();
        Schema.DescribeFieldResult fieldResult = Contact.Driving_States__c.getDescribe();
        List<Schema.PicklistEntry> pickListEntries = fieldResult.getPicklistValues();
        for(Schema.PicklistEntry currentPickListEntry : pickListEntries)
        {
            drivingStateList.add(currentPickListEntry.getValue());
        }
        return JSON.serialize(drivingStateList);     
    }
    @AuraEnabled
    public static String getJobTitle()
    {
        List<String> jobTitleList = new List<String>();
        Schema.DescribeFieldResult fieldResult = Contact.Job_Title__c.getDescribe();
        List<Schema.PicklistEntry> pickListEntries = fieldResult.getPicklistValues();
        for(Schema.PicklistEntry currentPickListEntry : pickListEntries)
        {
            jobTitleList.add(currentPickListEntry.getValue());
        }
        return JSON.serialize(jobTitleList);     
    }
    @AuraEnabled
    public static String getDepartment()
    {
        List<String> departmentList = new List<String>();
        Schema.DescribeFieldResult fieldResult = Contact.Department__c.getDescribe();
        List<Schema.PicklistEntry> pickListEntries = fieldResult.getPicklistValues();
        for(Schema.PicklistEntry currentPickListEntry : pickListEntries)
        {
            departmentList.add(currentPickListEntry.getValue());
        }
        return JSON.serialize(departmentList);     
    }
    @AuraEnabled
    public static String getCompany() {
        List<String> companyList = new List<String>();
        Schema.DescribeFieldResult fieldResult = Contact.Company__c.getDescribe();
        List<Schema.PicklistEntry> pickListEntries = fieldResult.getPicklistValues();
        for(Schema.PicklistEntry currentEntries : pickListEntries) {
            companyList.add(currentEntries.getValue());
        }
        return JSON.serialize(companyList);     
    }
    
    //@RemoteAction
    @AuraEnabled
    public static Id readFromFile(String file,String accountId, String adminId) {
        Id batchId;
        System.debug('file:: '+file );     
        System.debug('accountId:: '+accountId );
        System.debug('AdminId:: '+adminId );
        
        ImportContactdatafromCSVController batch = new ImportContactdatafromCSVController(file, accountId, adminId);
        
        batchId = Database.executebatch(batch);
        return batchId;
    }

    @AuraEnabled
    public static string CheckStatus(id batchId) {
        AsyncApexJob aaj = [SELECT Id, Status, JobItemsProcessed, TotalJobItems, NumberOfErrors
                    FROM AsyncApexJob WHERE ID =: batchid];
        PollarResponse res = new PollarResponse();
        res.enablePollar = true;
        if(aaj != null) {
            if(aaj.status == 'Completed' || aaj.status == 'Failed'){
                res.enablePollar = false;
            }             
            res.message = aaj.status;
        }
        return Json.Serialize(res);
    }
    
    //AI-000433
    //@RemoteAction
    @AuraEnabled
    public static String massFreeze(String listofemployee,Boolean freezeProperty){        
        ResultResponse result = new ResultResponse();
        result.hasError = false;
        result.message = '';
        
        List<String> contactIds = new List<String>();
        List<Contact> conList = new List<Contact>();
        Set<Id> UserIds = new Set<ID> ();
        List<UserLogin> userLogins = new List<UserLogin>();
        contactIds = (List<String>) System.JSON.deserialize(listofemployee, List<String>.class);        
        for(User currentUser: [SELECT id,ContactId FROM User WHERE ContactId IN: contactIds]) {
            UserIds.add(currentUser.Id);
        }        
        for(UserLogin ulogin : [SELECT Id, IsFrozen, UserId From UserLogin Where UserId =: UserIds]){
            if(freezeProperty == true){
                ulogin.IsFrozen = true;
            }
            else {
                system.debug('freezeProperty'+freezeProperty);
                ulogin.IsFrozen = false;
            }
            userLogins.add(ulogin);
        }
        
        for(Contact conObj : [SELECT id,Freeze__c 
                              FROM Contact WHERE ID =: contactIds ]){
                                  if(freezeProperty == true){                                      
                                      conObj.Freeze__c = System.today();
                                  }
                                  else {                                    
                                      conObj.Freeze__c = null;
                                  }
                                  conList.add(conObj);
                              }
        
        if(userLogins.size() > 0 && conList.size() > 0)
        {
            try{               
                update userLogins;
                update conList;
            } catch (Exception e){
                result.hasError = true;
                result.message = getExcetionTypes(e.getTypeName(),e.getMessage(),e.getlinenumber());
                return JSON.Serialize(result);
            }
        }        
        return JSON.Serialize(result) ;
    }
    
    //AI-000580 
    //@RemoteAction
    @AuraEnabled
    public static string updateLockDate(String accountId, String lockDate,String reiMonth){
        if(accountId != null && lockDate != null){
        system.debug('lockDate =='+lockDate );
            List<String> lastPaydateSplitted = new List<String>();
            if(lockDate.contains('/')) {
                lastPaydateSplitted = lockDate.split('/');                
            }
            
            List<Employee_Reimbursement__c> reimbursementList = new List<Employee_Reimbursement__c>();
            for(Employee_Reimbursement__c objReimb : [SELECT ID,Mileage_Lock_Date__c, Status__c FROM Employee_Reimbursement__c WHERE Status__c = 'Pending' AND Contact_Id__r.AccountId =: accountId and month__c =: reiMonth]){
                objReimb.Mileage_Lock_Date__c = Date.newInstance(Integer.valueOf(lastPaydateSplitted[2]), Integer.valueOf(lastPaydateSplitted[0]), Integer.valueOf(lastPaydateSplitted[1]));
                //objReimb.Mileage_Lock_Date__c = Date.valueOf(lockDate);
                system.debug('objReimb.Mileage_Lock_Date__c =='+objReimb.Mileage_Lock_Date__c );
                reimbursementList.add(objReimb);
            }
            
            List<Report_Accessibility__c> reportList = new List<Report_Accessibility__c>();
            
            for(Report_Accessibility__c objReport : [SELECT id,Mileage_Lock_Date__c 
                                                     FROM Report_Accessibility__c 
                                                     WHERE (Custom_Report__r.Name = 'Fixed and Variable Report' 
                                                            OR Custom_Report__r.Name = 'Variable Reimbursement Report') 
                                                     AND User__r.Contact.AccountId =: accountId]){
                                                         //customReportIds.add(objReport.Custom_Report__c);
                                                         objReport.Mileage_Lock_Date__c = String.valueOf(Date.newInstance(Integer.valueOf(lastPaydateSplitted[2]), Integer.valueOf(lastPaydateSplitted[0]), Integer.valueOf(lastPaydateSplitted[1])));
                                                         //objReport.Mileage_Lock_Date__c = lockDate;
                                                          system.debug('objReport.Mileage_Lock_Date__c =='+objReport.Mileage_Lock_Date__c );
                                                         reportList.add(objReport);
                                                     }
             system.debug('reimbursementList =='+reimbursementList);
              system.debug('reportList =='+reportList );
            if(!reimbursementList.isEmpty() ){
                update reimbursementList;
            }
            
            if(!reportList.isEmpty() ){
                update reportList;
            }
        }
        return 'Success';
    }
    
    //@RemoteAction
    @AuraEnabled
    public static String editEmployeeDetails(String editUserID) {
        Contact loggedinContact = new Contact();
        query = 'Select id,Name,Company__c,Account.Cell_Phone__c, Account.Reimbursement_Frequency__c,Hello_Sign_Status__c,Hello_Sign_Request_Id__c,FirstName,Lastname,Email,External_Email__c, Division__c,Final_Payroll_Amount__c,First_Payroll__c,Department,Deactivated_Date__c,Role__c,Manager__c,Manager__r.Name,MailingPostalCode,Driving_States__c,MailingState,MailingCity,Employee_ID__c,Activation_Date__c,Vehicle_Type__c,Last_Pay_Date__c,Monthly_Mileage_Limit__c,Added_Date__c,Fixed_Amount__c,compliancestatus__c,Total_Reimbursement__c,IsDeactivated__c,Monthly__c,Sage_100_ID__c,GL_Code__c,App__c,MobilePhone,Phone,Branch_Name__c,Branch_Number__c,Freeze__c,Driver_Type__c,Territory__c,Code__c,District__c,Department__c,Dept__c,Job_Title__c,Employee_Netchex_Id__c,Deactivated_By__c,LOA_Start_Date__c,LOA_End_Date__c,LOA_Fixed_Amount__c,Payroll_Period__c,Monthly_Reimbursement__c, Biweek_Reimbursement__c, Time_Attandance__c,AM__c,AN__c,Cost_Code__c,App_Settings__c,Last_Synced__c,Mileage_for_deduct__c,BP_Code__c,Cell_Phone__c,Reimbursement_Frequency__c from Contact where id=\''+editUserID+'\''; 
        List<EmployeeDetails> employeeList = new List<EmployeeDetails>();
        List<Contact> managerlist = (List<Contact>)ExecuteQueryUtil.getRecordListFromsObject(query);
        
        Map<Id, Decimal> reimTotalMap = new Map<Id, Decimal>();
        Map<Id, Decimal> mileageTotalMap = new Map<Id, Decimal>();
        for(AggregateResult ar : [SELECT Contact_Id__c cid, AVG(Monthly_Reimbursement_Total__c) rtotal,
                                  AVG(Total_Mileage__c) mtotal
                                  FROM Employee_Reimbursement__c
                                  WHERE Contact_Id__c =: editUserID
                                  AND Month__c In: getMonths(System.today().Month())
                                  GROUP BY Contact_Id__c]) {
                                      reimTotalMap.put((Id)ar.get('cid'), (Decimal) ar.get('rtotal'));
                                      mileageTotalMap.put((Id)ar.get('cid'), (Decimal) ar.get('mtotal'));
                                  }
        for(Contact currentManager : managerlist)
        {           
            employeeList.add(WrapperUtils.getEmployeeDetails(currentManager, reimTotalMap.get(currentManager.id), mileageTotalMap.get(currentManager.id)));
        }
        return JSON.serialize(employeeList).replace('null','""');
    }
    
    //@RemoteAction
    @AuraEnabled
    public static String getCity(String city,String zipcode) {
        if(city != null && city != '' && zipcode != null && zipcode != ''){
            List<Address__c> addressList  = new List<Address__c>();
            addressList = [SELECT id,name,State__c,City__c,Abbreviation__c,ZIP_Code__c 
                           FROM Address__c 
                           WHERE City__c =: city 
                           AND ZIP_Code__c =: zipcode];
            if(addressList.size() > 0) {
                return JSON.serialize(addressList); 
            }
        }
        return '';
    }
    
    //@RemoteAction
    @AuraEnabled
    public static String getCountryStateCity(String zipcode)
    {
        if(zipcode != null && zipcode != '')
        {
            List<Address__c> addressList  = new List<Address__c>();
            addressList = [SELECT id,name,State__c,City__c,Abbreviation__c,ZIP_Code__c 
                           FROM Address__c 
                           WHERE ZIP_Code__c =: zipcode];
            if(addressList.size() > 0) {
                return JSON.serialize(addressList); 
            }
        }
        return '';
    }
    // @RemoteAction
    @AuraEnabled
    public static String getContactByEmailAddress(String emailId)
    {
        List<Contact> queryContactbyemailaddress = new List<Contact>();
        String query = 'Select id,FirstName,Lastname,accountid from Contact where email=\''+emailid+'\'';
        queryContactbyemailaddress = ((List<Contact>)ExecuteQueryUtil.getRecordListFromsObject(query));
        if(queryContactbyemailaddress.size()>0)
        {
            return queryContactbyemailaddress[0].id;
        }
        return 'Fail';
    }
    
    //AI-000439
    //@RemoteAction
    @AuraEnabled
    public static string putHTTP(String accountID,String empEmail) {
        
        system.debug('accountID=='+accountID);
        system.debug('empEmail=='+empEmail);
        
        String MLOGACCOUNT = System.Label.Triplog_New_URL + ',' + System.Label.Triplog_New_URL2;
        
        String body, apiToken;
        List<Account> accountList = [SELECT id,Triplog_API__c  
                                     FROM Account 
                                     WHERE Triplog_API__c != null 
                                     AND Id =: accountID];
        apiToken = accountList[0].Triplog_API__c;
        
        String baseURL = !MLOGACCOUNT.Contains(apiToken) ? StaticValues.TRIPLOG_BASEURL : StaticValues.MLOG_BASEURL;
        String rosterURL = baseURL + StaticValues.WELCOME_SUFFIX;
        body = '{"emails":[';
        body = body + String.valueof(empEmail) +']}';
        system.debug('body'+body);
        /*HttpRequest putReq = new HttpRequest();
        Http putHTTP = new Http();
        HttpResponse putRes = new HttpResponse();
        
        putReq.setEndpoint(rosterURL);
        putReq.setMethod('PUT');                 
        putReq.setBody(body);
        putReq.setTimeout(120000);
        putReq.setHeader('Authorization', 'apikey ' + apiToken);
        putReq.setHeader('Content-Type', 'application/json');
        TriplogPutCall__c objTriplog = TriplogPutCall__c.getValues('RosterControllerPutCall');
        if(!Test.isRunningTest()){
            if(objTriplog.TriplogPut__c == true){
                putRes = putHTTP.send(putReq);
                system.debug('putRes'+putRes.getBody());
            }
         }
         String jsonSubset = 'aaaaa';
         */
         
        String jsonSubset;
        TriplogPutCall__c objTriplog = TriplogPutCall__c.getValues('RosterControllerPutCall');
        try {
            if(!Test.isRunningTest() && objTriplog.TriplogPut__c == true) {
                System.debug('inside if before http');
                HttpResponse res = ApiCalloutUtility.executeCallout(apiToken,'PUT',rosterURL,'',body);
                Map<String,Object> jsonMap = (Map<String, Object>)JSON.deserializeUntyped(res.getBody());
                jsonSubset = JSON.serialize(jsonMap.get('message'));
                system.debug('jsonSubset'+jsonSubset);
            }
        } catch(System.CalloutException er) {
            System.debug('Exception : '+er);
        }
        return jsonSubset;
    }
    
    //AI-000439
    //@RemoteAction
    @AuraEnabled
    public static string putHTTPConcurConnect(String accountID,String empEmail) {
        system.debug('putHTTPConcurConnect accountID'+accountID);
        system.debug('putHTTPConcurConnect empEmail='+empEmail);
        String MLOGACCOUNT = System.Label.Triplog_New_URL  + ',' + System.Label.Triplog_New_URL2;
        
        String body, apiToken;
        List<Account> accountList = [SELECT id,Triplog_API__c  
                                     FROM Account 
                                     WHERE Triplog_API__c != null 
                                     AND Id =: accountID];
        apiToken = accountList[0].Triplog_API__c;
        
        String baseURL = !MLOGACCOUNT.Contains(apiToken) ? StaticValues.TRIPLOG_BASEURL : StaticValues.MLOG_BASEURL;
        //String baseURL = StaticValues.Concer_Quick_Connect;
        baseURL = (baseURL + '/api/sendEmail/concurConnect');
        body = '{"emails":'+ empEmail +'}';
        System.debug('body'+body);
        HttpResponse res;
        TriplogPutCall__c objTriplog = TriplogPutCall__c.getValues('RosterControlllerputHTTPConcurConnect');
        try {
            if(!Test.isRunningTest() && objTriplog.TriplogPut__c == true) {
                res = ApiCalloutUtility.executeCallout(apiToken,'PUT',baseURL,'',body);
                system.debug('res'+res);
            }
        } catch(System.CalloutException er) {}
        if(!Test.isRunningTest() && res.getStatus() != '' && res.getStatus() != null ){
            return string.valueOf(res.getStatus());
        } else {
             return null;
        }
        
    }
    
    //@RemoteAction
    @AuraEnabled
    public static String getLoginAsData(String accid) {
        
        List<Contact> adminContact = new List<Contact>();
        adminContact = [SELECT id, Name, Email, Accountid,Role__c 
                        FROM Contact 
                        WHERE Accountid =: accid  
                        AND (Role__c='Manager' OR Role__c='Driver/Manager' OR Role__c = 'Driver')];
        return String.escapeSingleQuotes(JSON.serialize(adminContact));
    }
    
    //@RemoteAction
    @AuraEnabled
    public static string resetPassword(String contactID) {
    System.debug('contactID'+contactID);
        if(contactID != null){
            List<User> userList = new List<User>();
            userList = [SELECT id FROM User WHERE ContactId =: contactID limit 1];
            if(!userList.isEmpty()){
                System.ResetPasswordResult currectUserResult = System.resetPassword(((User)(getUser(contactID))).id, true);   
                System.debug('currectUserResult   '+currectUserResult   );
            }
            else {
                List<Contact> conlist = new List<Contact>();
                conlist = [SELECT Id,name,Role__c,IsCreatedFromCommunity__c,FirstName,LastName,External_Email__c,Email 
                           FROM Contact 
                           WHERE id =: contactID];
                if(conlist[0].IsCreatedFromCommunity__c != true){
                    conlist[0].IsCreatedFromCommunity__c = true;
                    update conlist;
                }
                ContactTriggerHelper.CommunityUserCreate(conlist);
            }
        }
        return 'Success';
    }
    //Use for a mass reset password
    //@RemoteAction
    @AuraEnabled
    public static string massResetPassword(String contactListID) {
        System.debug('-----------'+contactListID);
        List<String> contactIds = new List<String>();
        contactIds = (List<String>) System.JSON.deserialize(contactListID, List<String>.class);
        System.debug('------contactIds -----'+contactIds );
        if(!contactIds.isEmpty()){
            for(String conIds : contactIds){
                System.ResetPasswordResult currectUserResult = System.resetPassword(((User)(getUser(conIds))).id, true);   
            }
        }
        return 'Success';
    }
    
    //AI-000327
    //This method is used to create a community user.
    //@RemoteAction
    @AuraEnabled
    public static string massEnableUser(String contactListID){      
        List<String> contactIds = new List<String>();
        List<Contact> contactList = new List<Contact>();
        contactIds = (List<String>) System.JSON.deserialize(contactListID, List<String>.class);        
        for(Contact conObj : [SELECT Id,IsCreatedFromCommunity__c,Role__c,FirstName,LastName,External_Email__c FROM Contact WHERE Id In : contactIds AND IsCreatedFromCommunity__c = false AND Deactivated_Date__c = null]){
            
            conObj.IsCreatedFromCommunity__c = true ;
            contactList.add(conObj);
        }
       
        if(!contactList.isEmpty()){           
            update contactList;             
            ContactTriggerHelper.CommunityUserCreate(contactList);
        }
        return 'Success';
    }
    
    @AuraEnabled
    public static string deleteTrips(String accountId,String month){
        
        if(accountId != null){
            delete [SELECT id 
                    FROM Employee_Mileage__c 
                    WHERE Trip_Status__c = 'Not Approved Yet' 
                    AND EmployeeReimbursement__r.Contact_Id__r.AccountId =: accountId
                    AND EmployeeReimbursement__r.Month__c =: month
                    AND EmployeeReimbursement__r.Status__c = 'Pending'];
        }
        return 'deleted';
    }
    
    //@RemoteAction
    @AuraEnabled
    public static void MassSyncTrips(String accountId,String startDate,String endDate,String month,String tripStatus){
        System.debug('startDate'+startDate+'=======endDate'+endDate+'accountId'+accountId);
        MassSyncTrips  obj = new MassSyncTrips(accountId,startDate,endDate,month,tripStatus,false);
        Database.executeBatch (obj,1);
    }
    public static List<String> getMonths(Integer month) {
        List<String> monthList = new List<String>();
        for(Integer i = 1; i < month; i++) {
            monthList.add( ( i < 10 ? '0' : '' ) + i + '-' + system.today().year());
        }
        return monthList;
    }
    
    //@RemoteAction
    @AuraEnabled
    public static String SaveLOA(String addNewEmployee)
    {
        System.debug('addNewEmployee='+addNewEmployee);
        ResultResponse result = new ResultResponse();
        result.hasError = false;
        result.message = '';
        List<LOAWrapper> employeeList = new List<LOAWrapper>();
        employeeList = (List<LOAWrapper>)Json.deserialize(addNewEmployee,List<LOAWrapper>.class);
        System.debug('employeeList='+employeeList);
        List<Bi_Weekly_Reimbursement__c> biWeekList = new List<Bi_Weekly_Reimbursement__c>();
        for(LOAWrapper objWrap : employeeList){
            Bi_Weekly_Reimbursement__c objBiweek = new Bi_Weekly_Reimbursement__c();
            objBiweek.id = objWrap.BiweekId;
            if(objWrap.LOAStartDate != null){
                objBiweek.LOA_Start_Date__c = Date.valueOf(objWrap.LOAStartDate);
            } else {
                objBiweek.LOA_Start_Date__c = null;
            }
            if(objWrap.LOAEndDate != null){
                objBiweek.LOA_End_Date__c = Date.valueOf(objWrap.LOAEndDate);
            }  else {
                objBiweek.LOA_End_Date__c = null;
            }       
            if(objWrap.HalfFixedAmount != null){
                objBiweek.Fixed_Amount__c = (objWrap.HalfFixedAmount * 26)/12;
            } else {
                objBiweek.Fixed_Amount__c = 0;
            }
            biWeekList.add(objBiweek);
        }
        if(biWeekList.size() > 0){
            try{
                update biWeekList;
            } catch (System.DmlException e){
                result.hasError = true;
                for (Integer i = 0; i < e.getNumDml(); i++) {
                    result.message = e.getDmlId(i)+'=='+e.getDmlMessage(i);
                }
                return JSON.Serialize(result);
            }
        }     
        return JSON.Serialize(result);   
    }
    
    /*This method is use for Hello sign integration.It will send driver packet to Driver */
    //@RemoteAction
    @AuraEnabled
    public static string sendSignatureRequestForDriver(String accountID){
        /*String contactEmails;
        List<String> driverEmail = new List<String>();
        driverEmail = (List<String>) System.JSON.deserialize(contactEmails, List<String>.class);
        if(driverEmail.size() > 0 ){
            Set<String> newUserEmailSet = new Set<String>();    
            newUserEmailSet.addAll(driverEmail);   
            HelloSignIntegrationHandler.sendSignatureRequestForDriver(newUserEmailSet);
        }*/    
        Set<String> newUserEmailSet = new Set<String>();
        for(Contact con : [SELECT id,name,Email 
                                FROM Contact 
                                WHERE Packet__c != 'Completed' 
                                    AND Hello_Sign_Request_Id__c = null 
                                    AND AccountId =: accountID 
                                    AND Deactivated_Date__c = null 
                                    AND Role__c != 'Admin' 
                                    AND Role__c != 'Manager' ]){
            newUserEmailSet.add(con.Email);
        }        
        if(newUserEmailSet.size() > 0){
        system.debug('check');
            HelloSignIntegrationHandler.sendSignatureRequestForDriver(newUserEmailSet);
        } 
        return 'success';
    }
    
    //@RemoteAction
    @AuraEnabled
    public static List<LOAWrapper> BiweekReimRecord(String startdate,String enddate,String accID)
    {
        system.debug('startdate line 937=='+ startdate);
        system.debug('enddate=='+ enddate);
        system.debug('accID=='+ accID);
        List<LOAWrapper> biWeekWrapList = new List<LOAWrapper>();
        for(Bi_Weekly_Reimbursement__c biweekReim : [SELECT id,Contact_Id_Name__c, Contact_Email__c,
                                                     LOA_Start_Date__c, LOA_End_Date__c,
                                                     Half_Fixed_Amount__c,name 
                                                     FROM Bi_Weekly_Reimbursement__c 
                                                     WHERE Contact__r.AccountId =:accID 
                                                     AND Start_Date__c >=: Date.valueOf(startdate) 
                                                     and End_Date__c <=: Date.valueOf(enddate) ]){
                                                         LOAWrapper objWrap = new LOAWrapper();  
                                                         objWrap.BiweekId = biweekReim.id;
                                                         objWrap.ContactEmail = biweekReim.Contact_Email__c;
                                                         //objWrap.LOAStartDate = String.valueOf(biweekReim.LOA_Start_Date__c);
                                                         //objWrap.LOAEndDate = String.valueOf(biweekReim.LOA_End_Date__c);
                                                         if(biweekReim.LOA_Start_Date__c != null){
                                                             objWrap.LOAStartDate = String.valueOf(biweekReim.LOA_Start_Date__c.month())+'/'+String.valueOf(biweekReim.LOA_Start_Date__c.day())+'/'+String.valueOf(biweekReim.LOA_Start_Date__c.year());
                                                         }
                                                         if(biweekReim.LOA_End_Date__c != null){
                                                             objWrap.LOAEndDate = String.valueOf(biweekReim.LOA_End_Date__c.month())+'/'+String.valueOf(biweekReim.LOA_End_Date__c.day())+'/'+String.valueOf(biweekReim.LOA_End_Date__c.year());
                                                         }
                                                         objWrap.HalfFixedAmount = biweekReim.Half_Fixed_Amount__c;
                                                         objWrap.ContactName = biweekReim.Contact_Id_Name__c;
                                                         biWeekWrapList.add(objWrap);
                                                         //2022-01-05
                                                         //m/dd/yyyy
                                                         
                                                     }
        return biWeekWrapList;
    }
    //@RemoteAction
    @AuraEnabled
    public static void  deleteMonthlyReim (string conId, date deactionDate) {
       string convDate = string.valueOf(deactionDate);
        string[] sliptDate = convDate.split('-');
        string currentMonthYear = sliptDate[1] + '-' + sliptDate[0];
        system.debug('currentMonthYear==' + currentMonthYear);
        date firstdate = date.valueOf( sliptDate[0] + '-' + sliptDate[1] + '-' + 1);
        system.debug('firstdate==' + firstdate);
        List<Employee_Reimbursement__c> reimListforDelete = new List<Employee_Reimbursement__c>();
        List<Employee_Reimbursement__c> updateReimList = new List<Employee_Reimbursement__c>();
        List<Employee_Mileage__c> milListToTransfer = new List<Employee_Mileage__c>();
        Set<Id> reimIdList = new Set<Id>();
        ID reimId ;

        for (Employee_Reimbursement__c reim : [SELECT id,name,Month__c,Contact_Id__r.External_Email__c,Total_Approved_Pending_Mileage__c,Total_Approved__c,First_day__c  
                                                FROM Employee_Reimbursement__c  
                                                WHERE Contact_Id__c =: conId order by First_day__c desc  limit 1 ]){
                       reimId = reim.Id;
                                                    system.debug('reim==' + reim);
        }
        
        for (Employee_Mileage__c mil : [SELECT id,name,EmployeeReimbursement__r.Total_Pending__c,EmployeeReimbursement__r.Total_Approved__c,EmployeeReimbursement__c,Trip_Status__c   
                                            FROM Employee_Mileage__c 
                                            WHERE EmployeeReimbursement__r.Month__c =: currentMonthYear and EmployeeReimbursement__r.Contact_Id__c =:  conId] ){                                   
            if(mil.EmployeeReimbursement__r.Total_Pending__c > 0 && mil.Trip_Status__c == 'Not Approved Yet' ){
                    mil.EmployeeReimbursement__c = reimId;
                    milListToTransfer.add(mil);
                } else if (mil.EmployeeReimbursement__r.Total_Approved__c > 0){
                    reimIdList.add(mil.EmployeeReimbursement__c);
                }
            } 
        system.debug('milListToTransfer==' + milListToTransfer);
        system.debug('reimIdList==' + reimIdList);
        if(!milListToTransfer.isEmpty()){
            update milListToTransfer;
        }
        for(String obj : reimIdList){
            Employee_Reimbursement__c reim = new Employee_Reimbursement__c();
            reim.Id = obj;
            reim.Status__c = 'Approved';
            reim.Approved_Date__c = system.today();
            updateReimList.add(reim);
        }
        if (!updateReimList.isEmpty()){
            update updateReimList;
        }
        for(Employee_Reimbursement__c reim : [SELECT id,name,Month__c,Total_Approved_Pending_Mileage__c,Total_Approved__c,First_day__c,Total_Mileage__c  
                                                FROM Employee_Reimbursement__c  
                                                WHERE Status__c = 'pending' and Contact_Id__c =: conId and (First_day__c >=: deactionDate OR Month__c =: currentMonthYear) ]){
       
            if(reim.Total_Mileage__c == 0 ){
                reimListforDelete.add(reim);      
            } 
        }
        if(!reimListforDelete.isEmpty()){
            delete reimListforDelete;
        }
    }
    public class ResultResponse {
        public Boolean hasError { get; set;}
        public string message { get; set;}
        public String result { get; set;}
    }
    public class LOAWrapper {
        public String BiweekId {get;set;} 
        public String ContactEmail {get;set;} 
        public String LOAStartDate {get;set;} 
        public String LOAEndDate {get;set;} 
        public Decimal HalfFixedAmount {get;set;} 
        public String ContactName {get;set;} 
        //public String Contact {get;set;} 
        //public String Name {get;set;}
    }
    public class PollarResponse {
        public Boolean enablePollar;
        public String Message;
    }

    @AuraEnabled(cacheable=true)
    public static List<EmployeeFieldSetting__c> getCustomEmployeeTableSettings() {
        return EmployeeFieldSetting__c.getAll().values();
    }

    @AuraEnabled(cacheable=true)
    public static List<AddEmployeeFieldSetting__c> getCustomAddEmployeeSettings() {
        return AddEmployeeFieldSetting__c.getAll().values();
    }

    @AuraEnabled(cacheable=true)
    public static List<LoginAsRedirectSetting__c> getCustomRedirectURLSettings() {
        return LoginAsRedirectSetting__c.getAll().values();
    }
    
    @AuraEnabled
    public static String getPicklistValues()
    {
        Map<String,String> pickListValues = new Map<String,String>();
        pickListValues.put('Role__c',getRoles());
        pickListValues.put('Driver_Type__c',getDriverType());
        pickListValues.put('Driving_States__c',getDrivingStates());
        pickListValues.put('Job_Title__c',getJobTitle());
        pickListValues.put('Department__c',getDepartment());
        pickListValues.put('Company__c',getCompany());
        return JSON.serialize(pickListValues);    
    }
    
    @AuraEnabled
    public static string putHTTPMassWlcmMail(String accountID,String empEmail) {
        List<String> contactEmail = new List<String>();
        contactEmail = (List<String>) System.JSON.deserialize(empEmail, List<String>.class);
        
        String MLOGACCOUNT = System.Label.Triplog_New_URL + ',' + System.Label.Triplog_New_URL2;
        String body, apiToken;
        List<Account> accountList = [SELECT id,Triplog_API__c  
                                     FROM Account 
                                     WHERE Triplog_API__c != null 
                                     AND Id =: accountID];
        apiToken = accountList[0].Triplog_API__c;
        
        String baseURL = !MLOGACCOUNT.Contains(apiToken) ? StaticValues.TRIPLOG_BASEURL : StaticValues.MLOG_BASEURL;
        String rosterURL = baseURL + StaticValues.WELCOME_SUFFIX;
        if(contactEmail.size() > 0 ){
            body = '{"emails":[';
            for(String s : contactEmail){
                body = body + String.valueof(s)+ ',';
            }
            body = body.removeEnd(',');
            body = body + +']}';
            TriplogPutCall__c objTriplog = TriplogPutCall__c.getValues('RosterControllerPutCall');
            try {
                if(!Test.isRunningTest() && objTriplog.TriplogPut__c == true) {
                    HttpResponse res = ApiCalloutUtility.executeCallout(apiToken,'PUT',rosterURL,'',body);
                    Map<String,Object> jsonMap = (Map<String, Object>)JSON.deserializeUntyped(res.getBody());
                    jsonSubset = JSON.serialize(jsonMap.get('message'));
                    system.debug('jsonSubset'+jsonSubset);
                }
            } catch(System.CalloutException er) {
                System.debug('Exception : '+er);
            }
        }
        return jsonSubset;
    }
@AuraEnabled
    public static String getAccountData(String AccId)
    {
        if(AccId != null && AccId != '')
        {
            List<Account> AccountList  = new List<Account>();
            AccountList = [SELECT id,Reimbursement_Frequency__c,Cell_Phone__c FROM Account WHERE Id =: AccId];
            
            if(AccountList.size() > 0) {
                return JSON.serialize(AccountList); 
            }
        }
        return '';
    }
}