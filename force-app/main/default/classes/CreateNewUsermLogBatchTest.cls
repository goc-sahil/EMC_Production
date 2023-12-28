@isTest	
public class CreateNewUsermLogBatchTest {
    @isTest
    Public Static void testMethod1 (){
        TriggerConfig__c customEmailSetting =  new TriggerConfig__c();
        customEmailSetting.Name = 'Defaulttrigger';
        customEmailSetting.ContactTriggersendEmailForNewContact__c = true;
        customEmailSetting.ContactTriCommunityReimCreate__c = true;
        insert customEmailSetting;
        TrueDialog_Keys__c tdKeys = TestDataFactory.createTrueDialog(true);
        List<Address__c> objAddress = TestDataFactory.createAddress(true, 2,30304);
        IRS_Mileage_Rate__c irsRateObj = TestDataFactory.createIRSRate(true,0); 
        Vehicle_URL_Mapping__c vehicleType = TestDataFactory.createVehicleData(false, 3);
        vehicleType.Name = '2020 Full-Size Sedan';
        vehicleType.vehicle__c = 'Full-Size Sedan';
        Insert vehicleType;
        
         UserRole userRole_1 = TestDataFactory.getUserRole();
        Profile profile_1 = TestDataFactory.getUserProfile();
        User admin = TestDataFactory.getSystemAdminUser(userRole_1.Id);
        
      	 User user_1;
        User user_2;
        Account obj_Account;
        Contact obj_admincontact;
        List<Contact> obj_Manager_list;
        List<Contact> obj_Driver_list;
        Contact obj_Contact2;
        List<Contact> obj_Driver_list1;
        Contact obj_Manager_list1;
        
        System.runAs(admin) {
            obj_Account = RecordUtilityClass.buildAccount();
            obj_Account.Vehicle_Types__c ='2020 Full-Size Sedan';
            obj_Account.Cell_Phone__c = 'Employee Provide';
            insert obj_Account;
            Contact contact_1 = new Contact(AccountId = obj_Account.Id, LastName = 'xgeek',External_Email__c='abc@gmail.com',Activation_Date__c=system.today());
            insert contact_1;
             obj_admincontact = RecordUtilityClass.buildAdminContact(obj_Account);
            insert obj_admincontact;

            obj_Manager_list = RecordUtilityClass.buildManagerContact(obj_Account,obj_admincontact);
            system.debug('obj_Manager_list=='+obj_Manager_list );
            insert obj_Manager_list;

            obj_Driver_list = TestDataFactory.createDriverContact(false, obj_Account.Id, 'Driver', vehicleType.Name, 'paras.dhanani',  1);
            obj_Driver_list[0].Driving_States__c = 'CA';
            Insert obj_Driver_list[0];
			//RecordUtilityClass.buildDriverContact(obj_Account,obj_Manager_list[0]);
            system.debug('obj_Account=='+ obj_Account);
            obj_Contact2 = obj_Driver_list[0];
            obj_Driver_list1 = new List<Contact>();

            for(Integer i=1;i<obj_Driver_list.size();i++)
            {
            obj_Driver_list1.add(obj_Driver_list[i]);
            }
            insert obj_Driver_list1;

            obj_Manager_list1 = new Contact();
            obj_Manager_list1 = RecordUtilityClass.getManagerContact();
            
            user_1 = new User( 
                Email = 'yourusername@gmail.com',
                ProfileId = profile_1.Id, 
                UserName = 'yourusername@gmail.com', 
                Alias = 'Test',
                TimeZoneSidKey = 'America/New_York',
                EmailEncodingKey = 'ISO-8859-1',
                LocaleSidKey = 'en_US', 
                LanguageLocaleKey = 'en_US',
                ContactId = contact_1.Id,
                PortalRole = 'Manager',
                FirstName = 'Firstname',
                LastName = 'Lastname'
                );
            insert user_1;
        }
        
         List<id> insertedContactIDList = new List<id>();
            for(Contact currentcontact:obj_Driver_list1)
            {
                insertedContactIDList.add(currentcontact.id);
            }
        Test.setMock( HttpCalloutMock.class, new CreateNewUserCalloutMock());
       // test.startTest();
        test.startTest();
        Test.setMock( HttpCalloutMock.class, new CreateNewUserCalloutMock());
        CreateNewUsermLogBatch userCreate = new CreateNewUsermLogBatch();
         Database.executeBatch(userCreate);
        test.stopTest();
    }
}