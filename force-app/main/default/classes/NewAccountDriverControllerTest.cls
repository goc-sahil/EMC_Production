@istest
public class NewAccountDriverControllerTest {
     
    
    @isTest
    public static void newAccountDriverControllerTestMethod() {
        System.debug('inside test class 1');
        NewDashboardMessage__c newMsgCustomSetting = TestDataFactory.newMsgCustomSetting(True);
        TriggerConfig__c triggerCustomSetting = TestDataFactory.triggerConfigCustomSetting(true);
        TrueDialog_Keys__c tdKeys = TestDataFactory.createTrueDialog(true);
        Vehicle_URL_Mapping__c vehicleType = TestDataFactory.createVehicleData(true, 3);
        IRS_Mileage_Rate__c irsRateObj = TestDataFactory.createIRSRate(true,0);
        SendEmail__c sendEmailCustomSetting = TestDataFactory.sendEmailCustomSetting(True, 'ConfirmTripTimeERMIController');
        SendEmail__c sendEmailSetting = TestDataFactory.sendEmailCustomSetting(True, 'Send Email For Compliance');
        NewDashboardVideoLink__c videoCustomSetting  = TestDataFactory.NewDashboardVideoLink(true);
        Account accData;
        Account accData1;

        List<Contact> conList;
        List<Contact> conList1;
        List<Contact> conList2;
        List<Contact> conList3;
        List<Contact> conList4;
        List<Contact> conList5;
        List<Contact> conList6;

        UserRole userRole = TestDataFactory.getUserRole();
        Profile profileObj = TestDataFactory.getUserProfile();
        User admin = TestDataFactory.getSystemAdminUser(userRole.Id);
        User userObj;

        System.runAs(admin) {

            accData = TestDataFactory.createAccount(False, 'Test Account', False);
            accData.Bodily_Injury__c = '100,000/300,000';
            accData.Property_Damage__c = 50000;
            accData.Collision__c = 1000;
            accData.Comprehensive__c = 1000;
            accData.MburseDashboardRedirect__c=true;
            Insert accData;
            
            accData1 = TestDataFactory.createAccount(False, 'Test1 Account1', False);
            accData1.Bodily_Injury__c = '100,000/300,000';
            accData1.Property_Damage__c = 50000;
            accData1.Collision__c = 1000;
            accData1.Comprehensive__c = 1000;
            accData1.MburseDashboardRedirect__c=false;
            Insert accData1;

           

            conList = TestDataFactory.createDriverContact(False, accData.Id, 'Driver', vehicleType.Name, 'Paras.Patel', 1);
            conList[0].IsCreatedFromCommunity__c = false;
            conList[0].Driver_Packet_Status__c='Uploaded';
            conList[0].Insurance_Declaration_Status__c='Uploaded';
            conList[0].App__c='x1';
            Insert conList[0];
            TestDataFactory.createUser(true, profileObj.Id, conList[0].Id );
            system.assertEquals(1, conList.size(), true);

            conList1  = TestDataFactory.createDriverContact(False, accData.Id, 'Driver/Manager', vehicleType.Name, 'xxx1xxx11', 1);
            conList1[0].IsCreatedFromCommunity__c = false;
            conList1[0].Driver_Packet_Status__c='Uploaded';
            conList1[0].Insurance_Declaration_Status__c='Uploaded';
            conList1[0].App__c='x1';
            Insert conList1[0];
            User testuser= TestDataFactory.createUser(false, profileObj.Id, conList1[0].Id );
            testuser.UserName='xxxxx1xx1x@gmail.com';
            insert testuser;
            system.assertEquals(1, conList1.size(), true);

            conList2  = TestDataFactory.createDriverContact(False, accData.Id, 'Driver/Admin', vehicleType.Name, 'xxx2xxx2', 1);
            conList2[0].IsCreatedFromCommunity__c = false;
            conList2[0].Driver_Packet_Status__c='Uploaded';
            conList2[0].Insurance_Declaration_Status__c='Uploaded';
            conList2[0].App__c='x1';
            Insert conList2[0];
            User testuser2= TestDataFactory.createUser(false, profileObj.Id, conList2[0].Id );
            testuser2.UserName='xxxxx2xx2x@gmail.com';
            insert testuser2;
            system.assertEquals(1, conList2.size(), true);

            conList3  = TestDataFactory.createDriverContact(False, accData.Id, 'Manager', vehicleType.Name, 'xxx3xxx3', 1);
            conList3[0].IsCreatedFromCommunity__c = false;
            conList3[0].Driver_Packet_Status__c='Uploaded';
            conList3[0].Insurance_Declaration_Status__c='Uploaded';
            conList3[0].App__c='x1';
            Insert conList3[0];
            User testuser3= TestDataFactory.createUser(false, profileObj.Id, conList3[0].Id );
            testuser3.UserName='xxxxx3xx3x@gmail.com';
            insert testuser3;
            system.assertEquals(1, conList3.size(), true);

            conList4  = TestDataFactory.createDriverContact(False, accData.Id, 'Admin', vehicleType.Name, 'xxx4xxx4', 1);
            conList4[0].IsCreatedFromCommunity__c = false;
            conList4[0].Driver_Packet_Status__c='Uploaded';
            conList4[0].Insurance_Declaration_Status__c='Uploaded';
            conList4[0].App__c='x1';
            Insert conList4[0];
            User testuser4= TestDataFactory.createUser(false, profileObj.Id, conList4[0].Id );
            testuser4.UserName='xxxxx4xx4x@gmail.com';
            insert testuser4;
            system.assertEquals(1, conList4.size(), true);

            conList5 = TestDataFactory.createDriverContact(False, accData1.Id, 'Driver/Admin', vehicleType.Name, 'xxx5xxx5', 1);
            conList5[0].IsCreatedFromCommunity__c = false;
            conList5[0].Driver_Packet_Status__c='Uploaded';
            conList5[0].Insurance_Declaration_Status__c='Uploaded';
            conList5[0].App__c='x1';
            Insert conList5[0];
            User testuser5= TestDataFactory.createUser(false, profileObj.Id, conList5[0].Id );
            testuser5.UserName='xxxxx5xx5x@gmail.com';
            insert testuser5;
            system.assertEquals(1, conList5.size(), true);

            conList6 = TestDataFactory.createDriverContact(False, accData1.Id, 'Driver/Manager', vehicleType.Name, 'xxx6xxx6', 1);
            conList6[0].IsCreatedFromCommunity__c = false;
            conList6[0].Driver_Packet_Status__c='Uploaded';
            conList6[0].Insurance_Declaration_Status__c='Uploaded';
            conList6[0].App__c='x1';
            Insert conList6[0];
            User testuser6= TestDataFactory.createUser(false, profileObj.Id, conList6[0].Id );
            testuser6.UserName='xxxxx6xx6x@gmail.com';
            insert testuser6;
            system.assertEquals(1, conList6.size(), true);

        }

        List<Bi_Weekly_Reimbursement__c> biWeeklyReimList = TestDataFactory.createBiweeklyReim(true, conList, system.today().adddays(-15), system.today().addDays(-2), 2, irsRateObj.id);
        List<Bi_Weekly_Reimbursement__c> biWeeklyReimList1 = TestDataFactory.createBiweeklyReim(true, conList1, system.today().adddays(-15), system.today().addDays(-2), 2, irsRateObj.id);
        List<Bi_Weekly_Reimbursement__c> biWeeklyReimList2 = TestDataFactory.createBiweeklyReim(true, conList2, system.today().adddays(-15), system.today().addDays(-2), 2, irsRateObj.id);
        List<Bi_Weekly_Reimbursement__c> biWeeklyReimList3 = TestDataFactory.createBiweeklyReim(true, conList3, system.today().adddays(-15), system.today().addDays(-2), 2, irsRateObj.id);
        List<Bi_Weekly_Reimbursement__c> biWeeklyReimList4 = TestDataFactory.createBiweeklyReim(true, conList4, system.today().adddays(-15), system.today().addDays(-2), 2, irsRateObj.id);
        List<Bi_Weekly_Reimbursement__c> biWeeklyReimList5 = TestDataFactory.createBiweeklyReim(true, conList5, system.today().adddays(-15), system.today().addDays(-2), 2, irsRateObj.id);
        List<Bi_Weekly_Reimbursement__c> biWeeklyReimList6 = TestDataFactory.createBiweeklyReim(true, conList6, system.today().adddays(-15), system.today().addDays(-2), 2, irsRateObj.id);

        system.debug('biWeeklyReimList== ' + biWeeklyReimList);
        Attachment attach = TestDataFactory.createAttachment(true, conList[0].id);
        List<Attachment> attachments = [select id, name from Attachment where parent.id =: conList[0].id];
        List<NewAccountDriverController.ContactWrapper> conWrapList = new List<NewAccountDriverController.ContactWrapper>();
        NewAccountDriverController.ContactWrapper conWrap = new NewAccountDriverController.ContactWrapper();
        conWrap.contactId = string.valueOf(conList[0].Id);
        conWrap.contactName = conList[0].Name;
            conWrap.insuranceId = attach.Id;
            conWrap.contactEmail = conList[0].External_Email__c;
            conWrap.cellPhone = string.valueOf(conList[0].Phone);
            conWrap.accountStatus = 'New Account';
            conWrap.insuranceStatus = 'Uploaded';
            conWrap.driverPacketStatus = 'Uploaded'; 
            conWrap.scheduleLink = 'www.gmeetSchedule.com';
            conWrap.bodilyInjury = '100,000/300,000';
            conWrap.unInsuranceMotorist = '1000';
            conWrap.propertyDamage = 50000;
            conWrap.comprehensive = 1000;
            conWrap.collision = 1000;
            conWrap.umbrella = 1000;
            conWrap.mlogApp = true;
            conWrap.checkActivationDate = true;
            conWrap.daysBetweenActivation = 30;
            conWrap.planPreview = true;
            conWrapList.add(conWrap);
        Test.startTest();
        NewAccountDriverController.getContactDetail(string.valueOf(conList[0].Id));
        NewAccountDriverController.getDriverDetailsClone(string.valueOf(conList[0].Id));
        NewAccountDriverController.updateContactDetail(JSON.serialize(conWrapList),false);
        NewAccountDriverController.loginRedirection(string.valueOf(conList[0].Id));
        NewAccountDriverController.loginRedirection(string.valueOf(conList1[0].Id));
        NewAccountDriverController.loginRedirection(string.valueOf(conList2[0].Id));
        NewAccountDriverController.loginRedirection(string.valueOf(conList3[0].Id));
        NewAccountDriverController.loginRedirection(string.valueOf(conList4[0].Id));

        NewAccountDriverController.loginRedirectionADMD(string.valueOf(conList[0].Id),true);
        NewAccountDriverController.loginRedirectionADMD(string.valueOf(conList[0].Id),false);

        NewAccountDriverController.loginRedirectionADMD(string.valueOf(conList1[0].Id),true);
        NewAccountDriverController.loginRedirectionADMD(string.valueOf(conList1[0].Id),false);

        NewAccountDriverController.loginRedirectionADMD(string.valueOf(conList2[0].Id),true);
        NewAccountDriverController.loginRedirectionADMD(string.valueOf(conList2[0].Id),false);

        NewAccountDriverController.loginRedirectionADMD(string.valueOf(conList3[0].Id),true);
        NewAccountDriverController.loginRedirectionADMD(string.valueOf(conList3[0].Id),false);

        NewAccountDriverController.loginRedirectionADMD(string.valueOf(conList4[0].Id),true);
        NewAccountDriverController.loginRedirectionADMD(string.valueOf(conList4[0].Id),false);

        NewAccountDriverController.loginRedirectionADMD(string.valueOf(conList5[0].Id),true);
        NewAccountDriverController.loginRedirectionADMD(string.valueOf(conList5[0].Id),false);

        NewAccountDriverController.loginRedirectionADMD(string.valueOf(conList6[0].Id),true);
        NewAccountDriverController.loginRedirectionADMD(string.valueOf(conList6[0].Id),false);


        NewAccountDriverController.sendInsuranceEmail(string.valueOf(conList[0].Id),'Test', 'test.account@gmail.com' );
        NewAccountDriverController.sendEmailToDriver( JSON.serialize(conWrapList) , 'Test', string.valueOf(conList[0].Id));
        NewAccountDriverController.sendSignatureRequestForDriver('Paras.dhanani@getoncrm.com', 'Test',string.valueOf(conList[0].Hello_Sign_Request_Id__c), string.valueOf(conList[0].Id));
        NewAccountDriverController.getCustomSettings();
        NewAccountDriverController.getCustomSettingsForMessage();
        NewAccountDriverController.sendWelcomeEmail(accData.Id, conList[0].External_Email__c);
         NewAccountDriverController.fakeMethod2();
        //NewAccountDriverController.readFromFileInchunk(attach.Body, attach.Name, attach.Id, conList[0], accData.Id, attachments[0].Id);   
        Test.stopTest();

    }
}