@isTest
public class ManageNotificationControllerTest {

    public static testmethod void testMethod1(){
        SendEmail__c sendEmailCustomSetting1 = TestDataFactory.sendEmailCustomSetting(true,'Send Email For Compliance');
        SendEmail__c sendEmailCustomSetting2 = TestDataFactory.sendEmailCustomSetting(true,'SendMileageReminderforDelta');        
        TriggerConfig__c triggerCustomSetting = TestDataFactory.triggerConfigCustomSetting(true);        
        SendEmailonDeactivation__c objCustom= TestDataFactory.sendEmailCustomSetting(true,'SendMileageReminderforDelta','test@gmail.com');        
        Vehicle_URL_Mapping__c vehicleObj = TestDataFactory.createVehicleData(true,0);
        IRS_Mileage_Rate__c irsRateObj = TestDataFactory.createIRSRate(true,0);        
        daylight_saving_time_config__c customSetting2 =  TestDataFactory.dayLightCustomSetting(true,'2022', System.today(), System.today() + 60);
        TrueDialog_Keys__c tdKeys1 = TestDataFactory.createTrueDialog(true);

        List<IRS_Mileage_Rate__c> obj_IRS_Mileage_Rate =  RecordUtilityClass.insertIrsRate();
        Account acc = new Account();     
        List<Contact> conList = new List<Contact>();
        List<Contact> conAdminList = new List<Contact>();
        List<Contact> conManagerList = new List<Contact>();
        Contact con2 = new Contact();    
        Contact con1 = new Contact();    
        Contact con3 = new Contact();        
        UserRole userRole = TestDataFactory.getUserRole();
        Profile profileObj = TestDataFactory.getUserProfile();
        User admin = TestDataFactory.getSystemAdminUser(userRole.Id);
        User userObj;
        
        System.runAs(admin) {
            Account accountObj = TestDataFactory.createAccount(true,'Test',true);
            Contact contactObj = TestDataFactory.createCICDContact(true,accountObj.Id);
            acc = TestDataFactory.createAccount(true,'Test',true);            
            conAdminList = TestDataFactory.createDriverContact(true, acc.Id, 'Admin', vehicleObj.Name, 'dialog.email', 1);
            conManagerList = TestDataFactory.createDriverContact(true, acc.Id, 'Manager', vehicleObj.Name, 'dialg.email', 1);
            conList = TestDataFactory.createDriverContact(false, acc.Id, 'Driver', vehicleObj.Name, 'test.email', 1);
            conList[0].Manager__c = conManagerList[0].Id;
             conList[0].Notification_Message__c = 'Test Message';
             conList[0].Notification_Date__c = system.today();
            insert conList;
            userObj = TestDataFactory.createUser(true, profileObj.Id, conList[0].Id);
        }
        List<Employee_Reimbursement__c> reimList = TestDataFactory.createPendingReimbursement(true, conList, 10, irsRateObj.id);
        system.assertEquals(11, reimList.size(),true);
        List<Bi_Weekly_Reimbursement__c> biWeeklyReimList = TestDataFactory.createBiweeklyReim(true, conList, system.today().adddays(-14), system.today().addDays(-1), 10, irsRateObj.id);
        Attachment attach = TestDataFactory.createAttachment(true, conList[0].id);
    
        String json = '[{\"name\":\"The White House\",\"address\":\"1600 Pennsylvania Ave NW, Washington, DC 20500\",\"activity\":\"Business\",\"userId\":\"20000649\"},{\"name\":\"The White House\",\"address\":\"1600 Pennsylvania Ave NW, Washington, DC 20500\",\"latitude\":38.683885,\"longitude\":-8.6109719,\"activity\":\"Business\",\"userId\":\"20000649\"}]';
        String json2 = '[{\"name\":\"The White House\",\"Trip_Date\":\"08/31/2021\",\"Trip_Origin\":\"6810 Chimney Hill Rd, Crestwood, KY  40014\",\"Trip_Destination\":\"1610 Deer Run Dr, Burlington, KY 41005\",\"Trip_Status\":\"rejected\",\"Approved_Date\":\"09/30/2021\",\"Actual_Mileage\":\"33\",\"Activity\":\"Business\",\"Contact_Email\":\"jayshah3796@gmail.com\",\"EmployeeId\":\"223344\"},{\"name\":\"The White House\",\"Trip_Date\":\"08/30/2021\",\"Trip_Origin\":\"6810 Chimney Hill Rd, Crestwood, KY  40014\",\"Trip_Destination\":\"1610 Deer Run Dr, Burlington, KY 41005\",\"Trip_Status\":\"Approved\",\"Approved_Date\":\"09/30/2021\",\"Actual_Mileage\":\"22\",\"Activity\":\"Business\",\"Contact_Email\":\"jayshah3796@gmail.com\",\"EmployeeId\":\"223344\"},{\"name\":\"The White House\",\"Trip_Date\":\"08/30/2021\",\"Trip_Origin\":\"6810 Chimney Hill Rd, Crestwood, KY  40014\",\"Trip_Destination\":\"1610 Deer Run Dr, Burlington, KY 41005\",\"Approved_Date\":\"09/30/2021\",\"Actual_Mileage\":\"26\",\"Activity\":\"Business\",\"Contact_Email\":\"jayshah3796@gmail.com\",\"EmployeeId\":\"223344\"}]';
        String json1 = '[{\"contactId\":\" '+con1.id + ' \",\"name\":\"Business\",\"notiMessage\":\"1600 Pennsylvania Ave NW, Washington, DC 20500\"}]';
        String json3 = '[{\"triploguserid\":\"20000339\",\"role\":\"Driver/Admin\",\"notiMessage\":\"Test123gdd\",\"notificationDate\":\"2021-06-30\",\"name\":\"Jaytik\",\"massEmail\":false,\"lastname\":\"Luhar\",\"isEditable\":false,\"insuranceId\":\"00P6s0000077Rj9EAE\",\"insurance\":null,\"fullname\":\"Jaytik Luhar\",\"expirationDate\":null}]';        
        String json4 = '[{"employeeId":"123456","proratedAmount":"100","name":"Divya ","loaEnd":"01/10/2022","loaStart":"01/04/2022"},{"employeeId":"2345","proratedAmount":"200","name":"priyankaben patelben","loaEnd":"01/10/2022","loaStart":"01/05/2022"},{"employeeId":"154641","proratedAmount":"300","name":"Harshad ","loaEnd":"01/10/2022","loaStart":"01/06/2022"},{"employeeId":"123789","proratedAmount":"400.25","name":"Atindnra ","loaEnd":"01/10/2022","loaStart":"01/07/2022"}]';
        Test.startTest();
        System.runAs(userObj) {
            ManageNotificationController mc = new ManageNotificationController();
            ManageNotificationController.NewEmployeeData(Acc.Id,conAdminList[0].Id);
            ManageNotificationController.NewEmployeeData(Acc.Id,conManagerList[0].Id);
            ManageNotificationController.isTestClass = true;
            ManageNotificationController.UploadLocation(json,Acc.Id);
            ManageNotificationController.UploadMileage(json2,Acc.Id,conAdminList[0].Id,'2021-06-30','2021-08-31');        
            ManageNotificationController.sendAllInsuranceEmail(json2, conAdminList[0].Id);
            ManageNotificationController.UploadLocation(json ,Acc.Id);
            ManageNotificationController.getdriverInsurance(attach.id);
            ManageNotificationController.editInlineNewEmployee(json3 ,conAdminList[0].Id);
            ManageNotificationController.UploadLOA(json4,Acc.Id,'2021-06-30','2021-08-31');
            ManageNotificationController.DeleteTrips(conAdminList[0].Id);
            ManageNotificationController.clearMassNotification(Acc.Id);
            ManageNotificationController.clearNotification(conList[0].Id );
            String response = ManageNotificationController.ImportMileage(Acc.Id);
            String json5 = '[{"totalMileage":"0.00","reimbursementId":null,"mpg":null,"maintaincetyre":null,"iseditable":false,"fuelprice":null,"driverName":"Priyanka Gajera","contactId":null,"contactEmail":"test.email1@gmail.com"}]';
            ManageNotificationController.UpdateImportMileage(json5 );
        }
    }    
    /** 
    * ********************************************************
    * test method for Sending Message API callout
    * ********************************************************
    */
    
    
    @isTest
    public static void sendMessageToMultipleContacts(){
      
        TriggerConfig__c triggerCustomSetting = TestDataFactory.triggerConfigCustomSetting(true);
        SendEmail__c sendEmailCustomSetting = TestDataFactory.sendEmailCustomSetting(true, 'Send Email For Compliance');
        IRS_Mileage_Rate__c irsRateObj = TestDataFactory.createIRSRate(true,0);
        List<Address__c> objAddress = TestDataFactory.createAddress(true, 10, 0956);
        //List<Address__c> objAddress = TestDataFactory.createAddress(true, 10);
        TrueDialog_Keys__c tdKeys = TestDataFactory.createTrueDialog(true);

        Vehicle_URL_Mapping__c vehicleType = TestDataFactory.createVehicleData(false, 3);
        vehicleType.Name = '2019 Full-Size Sedan';
        vehicleType.vehicle__c = 'Full-Size Sedan';
        Insert vehicleType;
        
        System.debug('tdKeys in test class'+tdKeys);
      
        Account a = TestDataFactory.createAccount(true, 'demo', false);
        
        Contact c  = TestDataFactory.createCICDContact(false, a.id);
        
        c.email='test@gmail.com';
        c.MobilePhone='+13239638840';
        c.lastName='Veer';
        c.firstName='Sharma';
        c.External_Email__c='test@gmail.com';
        c.TrueDialog_Contact_Id__c='81071892';
        c.MobilePhone='9843223443';
        insert c;
        
        Contact con2 = new Contact();
        con2.FirstName = 'Priyanka';
        con2.LastName = 'Gajera';
        con2.AccountId = a.Id;
        con2.External_Email__c = 'minkegsh.patel1478@gmail.com';
        con2.Deactivated_Date__c = Null;
        con2.Role__c = 'Admin';
        con2.Insurance_Attachment_Id__c = Null;
        con2.Employee_ID__c = '123456';
        con2.MobilePhone='2232316533';
        insert con2;
        
        List<String> lstTDContactId = new List<String>();
        lstTDContactId.add(c.TrueDialog_Contact_Id__c);
        
        String lstTDContactIdJson = JSON.serialize(lstTDContactId);
        
            
        Message__c message = new Message__c();
        message.Message__c='test contact id';
        message.Contacts__c=c.id;
        insert message;

        Attachment attach=new Attachment();     
        attach.Name='Unit Test Attachment';
        Blob bodyBlob=Blob.valueOf('Unit Test Attachment');
        attach.body=bodyBlob;
        attach.parentId=message.id;
        insert attach;

        List<Id> idList =new List<Id>();
        idList.add(c.id);
            
        Test.setMock(HttpCalloutMock.class, new TrueDialogMockCallout());   
        Test.startTest();

        TrueDialogSendMessageAPI.getAllMessageByContact(c.id);
        ManageNotificationController.sendMessageToMultipleContacts(lstTDContactIdJson,'Hello');
        ManageNotificationController.getUnreadMessageCount();
        ManageNotificationController.UpdateUnreadMessageStatus(c.Id);
        ManageNotificationController.TrueDialogContact(a.Id,con2.id);
        Test.stopTest();        
    }    
    
    @isTest
    public static void sendMessageToMultipleContacts1(){
      
        TriggerConfig__c triggerCustomSetting = TestDataFactory.triggerConfigCustomSetting(true);
        SendEmail__c sendEmailCustomSetting = TestDataFactory.sendEmailCustomSetting(true, 'Send Email For Compliance');
        IRS_Mileage_Rate__c irsRateObj = TestDataFactory.createIRSRate(true,0);
        List<Address__c> objAddress = TestDataFactory.createAddress(true, 10,0986);
        //List<Address__c> objAddress = TestDataFactory.createAddress(true, 10);
        TrueDialog_Keys__c tdKeys = TestDataFactory.createTrueDialog(true);

        Vehicle_URL_Mapping__c vehicleType = TestDataFactory.createVehicleData(false, 3);
        vehicleType.Name = '2019 Full-Size Sedan';
        vehicleType.vehicle__c = 'Full-Size Sedan';
        Insert vehicleType;
        
        System.debug('tdKeys in test class'+tdKeys);
      
        Account a = TestDataFactory.createAccount(true, 'demo', false);
        
        Contact c  = TestDataFactory.createCICDContact(false, a.id);
        
        c.email='test@gmail.com';
        c.MobilePhone='+13239638840';
        c.lastName='Veer';
        c.firstName='Sharma';
        c.External_Email__c='test@gmail.com';
        c.TrueDialog_Contact_Id__c='81071892';
        c.MobilePhone='9843223443';
        insert c;
        
        Contact con2 = new Contact();
        con2.FirstName = 'Priyanka';
        con2.LastName = 'Gajera';
        con2.AccountId = a.Id;
        con2.External_Email__c = 'minkegsh.patel1478@gmail.com';
        con2.Deactivated_Date__c = Null;
        con2.Role__c = 'Admin';
        con2.Insurance_Attachment_Id__c = Null;
        con2.Employee_ID__c = '123456';
        con2.MobilePhone='2232316533';
        insert con2;
        
        List<String> lstTDContactId = new List<String>();
        lstTDContactId.add(c.TrueDialog_Contact_Id__c);
        
        String lstTDContactIdJson = JSON.serialize(lstTDContactId);        
            
        Message__c message = new Message__c();
        message.Message__c='test contact id';
        message.Contacts__c=c.id;
        insert message;
        
        Attachment attach=new Attachment();     
        attach.Name='Unit Test Attachment';
        Blob bodyBlob=Blob.valueOf('Unit Test Attachment');
        attach.body=bodyBlob;
        attach.parentId=message.id;
        insert attach;

        List<Id> idList =new List<Id>();
        idList.add(c.id);
            
        Test.setMock(HttpCalloutMock.class, new TrueDialogMockCallout());   
        Test.startTest();

        ManageNotificationController.sendImageToMultipleContacts(lstTDContactIdJson,'Unit Test Attachment','att1.jpg','Test  Message');
        Test.stopTest();   
    }    
}