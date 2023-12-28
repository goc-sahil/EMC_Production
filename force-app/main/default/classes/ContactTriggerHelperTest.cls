@isTest
public class ContactTriggerHelperTest {
    @isTest
    static void sendEmailOnDriverCreateTest() {
        
        TriggerConfig__c triggerCustomSetting = TestDataFactory.triggerConfigCustomSetting(true);
        SendEmail__c sendEmailCustomSetting = TestDataFactory.sendEmailCustomSetting(true, 'Send Email For Compliance');
        TrueDialog_Keys__c tdKeys = TestDataFactory.createTrueDialog(true);
        IRS_Mileage_Rate__c irsRateObj = TestDataFactory.createIRSRate(true,0);
        List<Address__c> objAddress = TestDataFactory.createAddress(true, 10,12345);
        Vehicle_URL_Mapping__c vehicleType = TestDataFactory.createVehicleData(false, 3);
        vehicleType.Name = '2020 Full-Size Sedan';
        vehicleType.vehicle__c = 'Full-Size Sedan';
        Insert vehicleType;
        
        UserRole uRole = TestDataFactory.getUserRole();
        Profile profileObj = TestDataFactory.getUserProfile();
        User admin = TestDataFactory.getSystemAdminUser(uRole.Id);
        User userObj;
        
        Account acc;
        Set<String> accIdList = new Set<String>();
        Set<String> conIdList = new Set<String>();
        List<Contact> con2List;
        List<Contact> conList;
        List<Contact> con1List;
        List<Vehicle_Value__c> vehValue;
         
        System.runAs(admin) {
            Account accountObj = TestDataFactory.createAccount(true,'Test',true);
            Contact contactObj = TestDataFactory.createCICDContact(true,accountObj.Id);
            acc = TestDataFactory.createAccount(true,'Test',true);
            acc.Pay_Period_Start_Date__c = System.today().addDays(-100);
            acc.Vehicle_Types__c = '2020 Full-Size Sedan';
            update acc;
            accIdList.add(acc.Id);           
            vehValue = TestDataFactory.createVehicleValue(true, acc.Id, vehicleType.Id);
            
            con1List = TestDataFactory.createDriverContact(false, acc.Id, 'Driver', vehicleType.Name, 'paras.patel',  1);
            con1List[0].compliancestatus__c = 'No – Vehicle Age';
            con1List[0].Deactivated_Date__c = system.today();
            con1List[0].Vehicle_Type__c = '2020 Full-Size Sedan';
            con1List[0].Vehicle_Value__c = vehValue[0].Value__c;
            con1List[0].Activation_Date__c = system.today();
            con1List[0].Email = 'Testn@mailinator.com';
            con1List[0].MailingPostalCode='99501';
            con1List[0].Map_Country__c = 'USA';
            Insert con1List[0];
            
            con1List[0].compliancestatus__c = 'Yes';
            con1List[0].Deactivated_Date__c =null;   
            con1List[0].Email = 'Testn@mailinator.com';
            con1List[0].Activation_Date__c = system.today().adddays(-20);
            con1List[0].MailingPostalCode='382028';        
            update con1List[0];
            
            conList = TestDataFactory.createDriverContact(false, acc.Id, 'Driver', vehicleType.Name, 'paras.dhanani',  1);
            conList[0].Deactivated_Date__c = system.today();
            conList[0].Vehicle_Value__c = vehValue[0].Value__c;
            conList[0].Vehicle_Type__c = vehicleType.Name;
            conList[0].Activation_Date__c = system.today().adddays(-9);   
            Insert conList[0];
            conIdList.add(conList[0].Id);

            checkRecursive.setting_run( true);
            conList[0].compliancestatus__c = 'No – Vehicle Age';
            update conList[0];
            
            system.assertEquals(1, conList.size(), true);
            userObj = TestDataFactory.createUser(True, profileObj.Id, contactObj.Id);
            
            ContentVersion contentVersion = new ContentVersion(
                Title          = 'Driver Agreement',
                PathOnClient   = 'Driver Agreement.docx',
                VersionData    = Blob.valueOf('Test Content'),
                FirstPublishLocationId = acc.Id,                
                IsMajorVersion = true);
            insert contentVersion;
            
            List<ContentDocument> documents = [SELECT Id, Title, LatestPublishedVersionId FROM ContentDocument WHERE Id =: acc.Id];
            if(!documents.isEmpty()){
                ContentDocumentLink cdl = new ContentDocumentLink();
                cdl.LinkedEntityId = con1List[0].ID;
                cdl.ContentDocumentId = documents[0].Id;
                cdl.ShareType = 'I';
                cdl.Visibility = 'AllUsers';
                insert cdl;
            }
        }     
        Test.startTest();
        
        System.runAs(userObj) {
            Map<String,String> contactInfo = new Map<String,String>();
            Map<String,String> accountInfo = new Map<String,String>();
            contactInfo.put(con1List[0].Triplog_UserID__c, con1List[0].Phone);
            accountInfo.put(con1List[0].Triplog_UserID__c, acc.Triplog_API__c);
            ContactTriggerHelper.putHTTPEnableUserTriplog(con1List[0].Id,false);
            ContactTriggerHelper.putHTTPUpdateUserPhoneTriplog(contactInfo,accountInfo);
            List<Contact> newCon = new List<Contact>();
            newCon.add(con1List[0]);
            Map<ID, Contact> conOldMap = new Map<ID, Contact>();
            Map<ID, Contact> connewMap = new Map<ID, Contact>();
            conOldMap.put(con1List[0].Id,con1List[0]);
            connewMap.put(con1List[0].Id,con1List[0]);
            ContactTriggerHelper.createReimRecord(newCon ,conOldMap );
            ContactTriggerHelper.updateComplianceStatus(newCon,conOldMap);
            ContactTriggerHelper.TrackHistory(conOldMap,newCon ,accountInfo );
            ContactTriggerHelper.CreateUserFromCommunity (newCon[0], profileObj.ID);
            ContactTriggerHelper.insertDriverAggrementFile (connewMap);
            ContactTriggerHelper.updatePlanParameter(conIdList, accIdList);
            
            ContactTriggerHelper.updateComplianceStatus(newCon,conOldMap);
            ContactTriggerHelper.updateMapCountry(conIdList);
            
            con1List[0].Role__c='Manager';
            update con1List;
            
            List<Contact> newCon1 = new List<Contact>();
            newCon1.add(con1List[0]);
            
            checkRecursive.setting_run(true);
            con1List[0].Role__c='Driver/Manager';
            update con1List;

            checkRecursive.setting_run(true);
            con1List[0].External_Email__c='Testn123@mailinator.com';
            update con1List;
                
            Map<ID, Contact> conOldMap1 = new Map<ID, Contact>();
            conOldMap1.put(con1List[0].Id,con1List[0]);
            
            con1List[0].Map_Country__c = 'CANADA';
            update con1List[0];
            
            ContactTriggerHelper.creatuserreimbermentrecrds(newCon1,conOldMap1);
            //ContactTriggerHelper.updtcanadianmil(newCon1,conOldMap1);
            ContactTriggerHelper.updateUser(String.valueOf(con1List[0].Id),'Driver');
            ContactTriggerHelper.updateUserInMlog(con1List[0].Id);
        }
        Test.stopTest();
    }
   
}