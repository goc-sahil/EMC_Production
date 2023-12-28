@isTest
public class LWCWrapperUtilsTest {
    @isTest
    public static void lwcWrapperTest(){
        TriggerConfig__c customEmailSetting = TestDataFactory.triggerConfigCustomSetting(true);
        TrueDialog_Keys__c trueDialogCustom = TestDataFactory.createTrueDialog(true);
        Vehicle_URL_Mapping__c veh = TestDataFactory.createVehicleData(true,0);
        
        IRS_Mileage_Rate__c irsRate = TestDataFactory.createIRSRate(true,2023);
       

        Gas_Prices__c gasprice = new Gas_Prices__c();
        gasprice.City__c = 'Atlanta';
        gasprice.Fuel_Price__c = 3;
        gasprice.Month_Year__c = Date.today().adddays(-12);
        gasprice.State__c = 'AK';
        insert gasprice;
        
        Gas_Prices__c gasprice1 = new Gas_Prices__c();
        gasprice1.City__c = 'Atlanta';
        gasprice1.Fuel_Price__c = 3;
        gasprice1.Month_Year__c = Date.today().adddays(-40);
        gasprice1.State__c = 'AK';
        insert gasprice1;

        UserRole uRole = TestDataFactory.getUserRole();
        Profile profileObj = TestDataFactory.getUserProfile();
        User admin = TestDataFactory.getSystemAdminUser(uRole.Id);
        User userObj;
        
        Account acc;
        Contact con1 = new Contact();
        Contact con2 = new Contact();
        
        System.runAs(admin) {
            acc = TestDataFactory.createAccount(false,'Test',true);
            acc.Name = 'Test Accounts';
            acc.Last_Reimbursement_Created__c = '04-2023';
            acc.isUsingTriplog__c = true;
            insert acc;
            system.debug('accId==' + acc.Id);
            con1.FirstName = 'Tom';
            con1.LastName = 'Honkus';
            con1.AccountId = acc.Id;
            con1.Activation_Date__c = system.today();
            con1.External_Email__c = 'minkesjhh.patel1478@gmail.com';
            con1.Deactivated_Date__c = Null;
            con1.Role__c = 'Driver';
            con1.Insurance_Attachment_Id__c = Null;
            con1.Vehicle_Type__c = '2023 Mileage Rate';
            con1.Employee_ID__c = '234343456';

            con1.Time_Zone__c = 'US/Mountain';
            con1.Driver_Type__c = 'Driver - Full Time';
            con1.Deactivated_Date__c = null;
            con1.Insurance_Attachment_Id__c = Null; 
            con1.compliancestatus__c = 'Yes';
            con1.ReimbursementStatementBatch__c = true;            
            con1.Manager__c = null;   
            con1.Monthly_Mileage_Limit__c = -1;  
            con1.MailingState = 'AK';
            con1.MailingCity = 'Atlanta';
            con1.Cell_Phone__c = 'Company Provide';
            insert con1;
            
            con2.FirstName = 'Paras';
            con2.LastName = 'Dhanani';
            con2.AccountId = acc.Id;
            //con1.Account.name = 'PL Marketing';
            con2.External_Email__c = 'minkesjhh.pate@gmail.com';
            con2.Deactivated_Date__c = Null;
            con2.Role__c = 'Driver';
            con2.Activation_Date__c = system.today();
            con2.Insurance_Attachment_Id__c = Null;
            con2.Vehicle_Type__c = '2023 Mileage Rate';
            con2.Employee_ID__c = '234343456';

            con2.Time_Zone__c = 'US/Mountain';
            con2.Driver_Type__c = 'Driver - Full Time';
            con2.Deactivated_Date__c = null;
            con2.Insurance_Attachment_Id__c = Null; 
            con2.compliancestatus__c = 'Yes';
            con2.ReimbursementStatementBatch__c = true;            
            con2.Manager__c = null;   
            con2.Monthly_Mileage_Limit__c = -1;  
            con2.MailingState = 'AK';
            con2.MailingCity = 'Atlanta';
            con2.Cell_Phone__c = 'Company Provide';
            insert con2;
        }

        List<Contact> conList = TestDataFactory.createDriverContact(true,acc.Id,'Driver/Manager',veh.Name,'niraj',2);
        
        
        
        
        List<Employee_Reimbursement__c> reimbursement = TestDataFactory.createPendingReimbursement(false,conList,2,irsRate.Id);
        reimbursement[0].Month__c = '04-2023';
        //reimbursement[0].Total_Mileage__c = 100;
        // reimbursement[1].Month__c = '02-2023';
        system.debug('Total_Mileage__c ==' + reimbursement[0].Total_Mileage__c );
        insert reimbursement[0];
        system.debug('reimbursement==' + reimbursement);
        
        // insert reimbursement[1];
        List<Bi_Weekly_Reimbursement__c> biReim = TestDataFactory.createBiweeklyReim(true,conList,Date.valueOf('2022-12-25'),Date.valueOf('2023-01-07'),2,irsRate.Id);
        List<Employee_Mileage__c> mileages = TestDataFactory.getEmpMileage(false,2,reimbursement,biReim);
        mileages[0].Trip_Date__c = Date.valueOf('2022-11-25');
         mileages[0].EMP_Mileage__c = 100;
         mileages[0].Activity__c = 'Business';
        insert mileages[0] ;
        
        Message__c msg = new Message__c();
        msg.Contacts__c = con1.id ; 
        msg.Notification_Message__c = 'Please submit your insurance card';
        msg.Unread__c = true;
       // system.debug('msg.User.Name==' + msg.User.Name);
        insert msg;
        
        Message__c msg1 = new Message__c();
        msg1.Contacts__c = con2.id ; 
        msg1.Notification_Message__c = 'Please submit your insurance card';
        msg1.Unread__c = true;
       // system.debug('msg.User.Name==' + msg.User.Name);
        insert msg1;

        LWCWrapperUtils.monthList('2023',true);
        LWCWrapperUtils.monthList('2023',false);
        LWCWrapperUtils.monthList('2022',false);
        LWCWrapperUtils.accountMonthList(string.valueOf(acc.Id));
        LWCWrapperUtils.contactReimMonthList(string.valueOf(con1.id));
        LWCWrapperUtils.getLastMonthReimbursements(string.valueOf(con1.id), string.valueOf(acc.Id), true, 'Admin', 'April');
        LWCWrapperUtils.getLastMonthReimbursements(string.valueOf(con1.id), string.valueOf(acc.Id), false, 'Admin', 'April');
        LWCWrapperUtils.getLastMonthReimbursements(string.valueOf(con1.id), string.valueOf(acc.Id), true, 'Manager', 'April');
        LWCWrapperUtils.getLastMonthReimbursements(string.valueOf(con1.id), string.valueOf(acc.Id), false, 'Manager', 'April');
        LWCWrapperUtils.getReimbursementData(con1.Id);
        LWCWrapperUtils.getDriverGasPrice('AK','Atlanta');
        LWCWrapperUtils.getNotificationMessageList(string.valueOf(con1.id), 2022, 'April');
        LWCWrapperUtils.getNotificationMessageList(string.valueOf(con2.id), 2022, 'April');
        LWCWrapperUtils.updateNotificationMessage(string.valueOf(msg.id), 2023, 'April');
        LWCWrapperUtils.reimbursementForHighMileageOrRisk(string.valueof(conList[0].Id), string.valueOf(acc.Id), 'April', false, true, 'Admin');
        LWCWrapperUtils.reimbursementForHighMileageOrRisk(string.valueof(conList[0].Id), string.valueOf(acc.Id), 'April', true, true, 'Admin');
        LWCWrapperUtils.reimbursementForHighMileageOrRisk(string.valueof(conList[0].Id), string.valueOf(acc.Id), 'April', false, true, 'Driver/Manager');
        LWCWrapperUtils.reimbursementForHighMileageOrRisk(string.valueof(conList[0].Id), string.valueOf(acc.Id), 'April', true, true, 'Driver/Manager');     
    }
}