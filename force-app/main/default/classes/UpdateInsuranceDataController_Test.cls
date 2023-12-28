@isTest
public class UpdateInsuranceDataController_Test {
    public Static testMethod void Method1(){
            
            TriggerConfig__c customEmailSetting =  new TriggerConfig__c();
            customEmailSetting.Name = 'Defaulttrigger';
            customEmailSetting.ContactTriggersendEmailForNewContact__c = true;
            customEmailSetting.ContactTriCommunityReimCreate__c = true;
            insert customEmailSetting;
            
            SendEmail__c customSetting1 =  new SendEmail__c();
            customSetting1.Name = 'Send Email For Compliance';
            customSetting1.Send_email_from_code__c= true;
            insert customSetting1;
            
            List<IRS_Mileage_Rate__c> obj_IRS_Mileage_Rate =  RecordUtilityClass.insertIrsRate();

        
        Vehicle_URL_Mapping__c veh = new Vehicle_URL_Mapping__c();
        veh.URL__c = 'https://cdn2.hubspot.net/hubfs/2511299/iStock-494093356.jpg';
        veh.vehicle__c = 'Full-Size Sedan';
        veh.Year__c = '2019';
        insert veh;
        
        UserRole userRole_1 = [SELECT Id FROM UserRole WHERE DeveloperName = 'EMD' LIMIT 1];
        Profile profile_1 = [SELECT Id FROM Profile WHERE Name = 'Customer Community Login User' LIMIT 1];
        User admin = [SELECT Id, Username, UserRoleId FROM User WHERE Profile.Name = 'System Administrator' AND UserRoleId = :userRole_1.Id LIMIT 1];
        User user_1;
        Account acc = new Account();
        Contact con = new Contact();
        System.runAs(admin) {
            acc.Name = 'PL Marketing';
            acc.Pay_Period_Start_Date__c = Date.parse('07/25/2021');
            acc.Pay_Period_Days__c = 13;
            insert acc;
            Contact contact_1 = new Contact(AccountId = acc.Id, LastName = 'xgeek',External_Email__c='abc@gmail.com');
            insert contact_1;
            con.LastName = 'TestContact';
            con.Role__c = 'Driver';
            con.Car_Image__c = veh.URL__c;
            con.Vehicle_Type__c = veh.Year__c +' '+veh.vehicle__c;
            con.AccountId = acc.Id;
            con.Activation_Date__c = Date.parse('10/01/2021');
            con.Deactivated_Date__c = null;
            con.External_Email__c = 'test@email.com';
            con.Fixed_Amount__c = 371.28;
            con.MailingCity = 'Abilene';
            con.MailingState = 'TX';
            con.Time_Zone__c = 'US/Mountain' ;
            con.Driving_States__c = 'TX';
            con.Fixed_Amount__c = 322.00;
            con.Maintenance_and_Tires__c = 1.2;
            con.MPG__c= 10.00;
            con.Monthly_Mileage_Limit__c = 100.00;
            insert con;
            //added by megha
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
  
            Test.startTest();
           
            ApexPages.CurrentPage().getParameters().put('ID', acc.Id);
            UpdateInsuranceDataController testAccPlan = new UpdateInsuranceDataController();
        	UpdateInsuranceDataController.getComplianceStatus();
            
            list<UpdateInsuranceDataController.ContactWrapper> conWrap = new list<UpdateInsuranceDataController.ContactWrapper>();
           UpdateInsuranceDataController.ContactWrapper wrap = new UpdateInsuranceDataController.ContactWrapper();
            wrap.contactId = con.Id;
            wrap.currentLeval = con.Current_Level__c;
            wrap.expirationDate = String.valueOf(con.Expiration_Date__c);
            wrap.insurance = con.Insurance__c;
            wrap.isEditable = false;
            wrap.meetingMinimum = con.Meeting_Minimum__c;
            wrap.name = con.Name;
            //wrap.vehicleAge = con.Vehicle_Age__c;
            //wrap.vehicleValue = con.Vehicle_Value_Check__c;
            conWrap.add(wrap);
            UpdateInsuranceDataController.editInlineNewEmployee(Json.serialize(conWrap));
            Test.StopTest();
        }
}