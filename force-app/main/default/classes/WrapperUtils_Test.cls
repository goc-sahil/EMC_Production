@isTest
public class WrapperUtils_Test {
    public static testmethod void wrapperUtilstestMethod() {
        TriggerConfig__c triggerCustomSetting = TestDataFactory.triggerConfigCustomSetting(true);
        SendEmail__c triggerCustomSetting1 = TestDataFactory.sendEmailCustomSetting(false,'EmployeeReimbursementTrigger');
        triggerCustomSetting1.Send_email_from_code__c = false;
        insert triggerCustomSetting1;
        WrapperUtils obj_WrapperUtils = new WrapperUtils();
        IRS_Mileage_Rate__c obj_IRS_Mileage_Rate = TestDataFactory.createIRSRate(true,0);
        RecordUtilityClass.sendEmailforCompliance();
        RecordUtilityClass.enableMappingGasPriceTrigger();
        RecordUtilityClass.vehicleUrlMapping();
        TrueDialog_Keys__c tdKeys = TestDataFactory.createTrueDialog(true);
         Vehicle_URL_Mapping__c vehicleType = TestDataFactory.createVehicleData(true, 3);
        
        UserRole userRole_1 = TestDataFactory.getUserRole();
        Profile profile_1 = TestDataFactory.getUserProfile();
        User admin = TestDataFactory.getSystemAdminUser(userRole_1.Id);
        
        User user_1;
        Account obj_Account;
         Account acc = new Account(); 
        Contact obj_admincontact;
        List<Contact> obj_Manager_list;
        List<Contact> obj_Driver_list;
        List<Contact> obj_Driver_list2;
        System.runAs(admin) {
            obj_Account = RecordUtilityClass.buildAccount();
            insert obj_Account;
            
            acc = TestDataFactory.createAccount(true,'Delta',true);

            Contact contactObj = TestDataFactory.createCICDContact(true,obj_Account.Id);
            obj_admincontact = RecordUtilityClass.buildAdminContact(obj_Account);
            insert obj_admincontact;       
    
            obj_Manager_list = RecordUtilityClass.buildManagerContact(obj_Account,obj_admincontact);
            insert obj_Manager_list;
    
            obj_Driver_list = RecordUtilityClass.buildDriverContact(obj_Account,obj_Manager_list[0]);
            insert obj_Driver_list;
             obj_Driver_list2 = TestDataFactory.createDriverContact(true,obj_Account.Id,'Driver', vehicleType.Name, 'Paras.dhnanani', 1);
            obj_Driver_list2[0].firstName = 'paras';
            obj_Driver_list2[0].Employee_ID__c = '1234567';
            obj_Driver_list2[0].Company__c = 'Park';
            obj_Driver_list2[0].Department__c = 'Sales';
            obj_Driver_list2[0].Division__c = 123;
            obj_Driver_list2[0].Dept__c = 'Sales';
            obj_Driver_list2[0].Job_Title__c = 'President';
            obj_Driver_list2[0].Employee_Netchex_Id__c = '34342vcvsd';
            obj_Driver_list2[0].Driving_States__c = 'DC';
            update obj_Driver_list2;
            
            user_1 = TestDataFactory.createUser(true, profile_1.Id, contactObj.Id);
        }       

        Message__c newMessage = new Message__c();
            newMessage.Notification_Message__c = 'Thanks for uploading your insurance, we will evaluate your insurance shortly.';
            newMessage.Unread__c = True;
            newMessage.Contacts__c = obj_Driver_list[0].ID;
            insert newMessage;
        
        list<Employee_Reimbursement__c> obj_Employee_Reimbursement_list = RecordUtilityClass.buildPendingEmployee_Reimbursement(obj_Driver_list);
        insert obj_Employee_Reimbursement_list;       
        
        list<Bi_Weekly_Reimbursement__c> empBIweekReimbursementList1 = RecordUtilityClass.buildPendingBiReimbursement(obj_Driver_list);
        insert empBIweekReimbursementList1;
        
        List<Employee_Mileage__c> obj_Employee_Mileage_list = RecordUtilityClass.buildNoApprovedYetEmployeeMileages(obj_Employee_Reimbursement_list, empBIweekReimbursementList1[0].id);
        insert obj_Employee_Mileage_list;

        //List<Employee_Reimbursement__c> obj_newreimbursements = new List<Employee_Reimbursement__c>();
        List<Employee_Reimbursement__c> obj_newreimbursements = TestDataFactory.createPendingReimbursement(true, obj_Driver_list, 10, obj_IRS_Mileage_Rate.id);   
        
        List<Employee_Mileage__c> obj_Employee_Mileage_list1 = RecordUtilityClass.buildNoApprovedYetEmployeeMileages(obj_newreimbursements, empBIweekReimbursementList1[0].Id);
        insert obj_Employee_Mileage_list1;

        List<Employee_Reimbursement__c> obj_Employee_Reimbursement_List3 = RecordUtilityClass.getEmployee_Reimbursement(obj_Account.id);
        List<EmployeeReimbursementDetailsAdmin> obj_EmployeeReimbursementDetailsAdmin_List = RecordUtilityClass.getListofEmployeeReimbursementDetailsAdmin(obj_Employee_Reimbursement_List3);
        List<Employee_Mileage__c> obj_list_mileages =  RecordUtilityClass.getMileagesList();    

        List<EmployeeMileages> obj_EmployeeMileages_list1=new List<EmployeeMileages>();
        List<EmployeeMileages> obj_EmployeeMileages_list2=new List<EmployeeMileages>();
        List<EmployeeMileages> obj_EmployeeMileages_list6=RecordUtilityClass.getallEmployeeMileages(obj_list_mileages);
        if(obj_EmployeeMileages_list6!=null && obj_EmployeeMileages_list6.size()>0) {
            Integer i=0;
            for(EmployeeMileages obj:obj_EmployeeMileages_list6) {
                if(i==0) {
                    i++;
                    obj.isSelected=true;
                    obj_EmployeeMileages_list2.add(obj);
                } else {
                    i--;
                    obj.isChecked = true;
                    obj_EmployeeMileages_list1.add(obj);
                }                
            }
        }
        List<Employee_Reimbursement__c> obj_Employee_Reimbursement_list_update = new List<Employee_Reimbursement__c>();
        List<string> obj_Employee_Reimbursement_list_update1 = new List<string>();
        for(Employee_Reimbursement__c obj:obj_newreimbursements) {
            obj.Approved_Date__c = system.today();
            obj.Status__c = 'Approved';
            obj_Employee_Reimbursement_list_update.add(obj);
        }
        for(Employee_Reimbursement__c obj:obj_newreimbursements) {            
            obj_Employee_Reimbursement_list_update1.add(obj.id);
        }
        EmployeeReimbursements obj_EmployeeReimbursements = WrapperUtils.getEmployeeReimbursements(obj_Employee_Reimbursement_list[0],23, 1);
        List<EmployeeReimbursements> obj_EmployeeReimbursements_list2 = new List<EmployeeReimbursements>();
        obj_EmployeeReimbursements_list2.add(obj_EmployeeReimbursements);        
        for(Employee_Reimbursement__c obj:obj_Employee_Reimbursement_list) {
            obj.Approved_Date__c = system.today();
            obj.Status__c = 'Approved';
            obj_Employee_Reimbursement_list_update.add(obj);
        }
        update obj_Employee_Reimbursement_list_update;
        WrapperUtils.getChartData(obj_admincontact.id,obj_admincontact.showTeamRecord__c,obj_Account.id,'Driver');
        WrapperUtils.getComplianceCalculation(obj_Driver_list[0].id,String.valueOf(System.Today().year()));
        List<Contact> obj_updated_Driver_list =  new List<Contact>();
        for(Contact obj_contact:obj_Driver_list) {
            obj_contact.Deactivated_Date__c = system.today();
            obj_contact.Last_Pay_Date__c = system.today();
            obj_contact.Driving_States__c='AK;AL;';
            obj_contact.LOA_Fixed_Amount__c=120;
            obj_contact.LOA_Start_Date__c =system.today();
            obj_contact.LOA_End_Date__c =system.today();
            obj_contact.Payroll_Period__c ='text';
            obj_updated_Driver_list.add(obj_contact);
        }
        update obj_updated_Driver_list;       
        WrapperUtils.getChartData(obj_admincontact.id,false,obj_Account.id,'Driver');
        obj_admincontact.showTeamRecord__c = true;
        update obj_admincontact;
        Test.startTest();
            System.runAs(user_1) {
                WrapperUtils.getChartData(obj_admincontact.id,false,obj_Account.id,'Driver');
                EmployeeDetails obj_EmployeeDetails = WrapperUtils.getEmployeeDetails(obj_Driver_list[0],110.50,230.50);
                 EmployeeDetails obj_EmployeeDetails2 = WrapperUtils.getEmployeeDetails(obj_Driver_list2[0],110.50,230.50);
                List<EmployeeDetails> obj_list_EmployeeDetails1 = new List<EmployeeDetails>();
                obj_list_EmployeeDetails1.add(obj_EmployeeDetails);
                
                WrapperUtils.getContact(obj_EmployeeDetails);
                WrapperUtils.getNewContact(obj_EmployeeDetails);
                WrapperUtils.getMonthName('11-2019');
                WrapperUtils.getMonthno('November');
                WrapperUtils.getMonthandYear('November');
                WrapperUtils.getMileagesOfReimbursement(obj_list_mileages[0]);
                WrapperUtils.getLastMonthValue(-1);
            
                WrapperUtils.getPacketandMeetingDetails(obj_Driver_list[0].id);
                List<String> reimbusementidList = new List<String>();
                reimbusementidList.add(obj_Employee_Reimbursement_list_update1[0]);
                WrapperUtils.updateReimbursements(JSON.serialize(reimbusementidList));
                WrapperUtils.updateContactThresholdLimit(JSON.serialize(obj_Employee_Reimbursement_list));
                WrapperUtils.getManager(obj_Driver_list[0].id,obj_admincontact.id);
                WrapperUtils.getadminname(obj_Driver_list[0].id);
                // ManagerDashboard Class Methods
                Attachment att = new Attachment();
                att.parentID = obj_Driver_list[0].Id;
                att.name = 'test';
                att.body = blob.valueOf('Test');
                insert att;
                WrapperUtils.getDriverGasPrice('CA','ON');
                WrapperUtils.getAllReimbursements(String.valueOf(System.today().Year()),String.valueOf(obj_Driver_list[0].id),obj_Account.id);
                WrapperUtils.getReimbursementsList(obj_Driver_list[0].id,'Approved');
                WrapperUtils.getMileages('November','2019',obj_Driver_list[0].id);
                WrapperUtils.getMileages1('November',String.valueOf(system.today().year()),obj_Driver_list[0].id);
                WrapperUtils.getpastYearReimbursement(obj_Driver_list[0].id);
                WrapperUtils.getLast2Years();
                WrapperUtils.getReimbursementsListClone(obj_Driver_list[0].id);
                WrapperUtils.approveReimbursements('2019',obj_Driver_list[0].id,obj_Account.id,JSON.serialize(obj_EmployeeReimbursements_list2));
                WrapperUtils.updateLockDate(obj_Account.id,obj_Driver_list[0].id);
                WrapperUtils.UpdateReimbursementStatus(obj_Employee_Reimbursement_list[0].id);
                WrapperUtils.getMileagesBasedTA('2020-01-01','2021-12-01',obj_Driver_list[0].id);
                
                //WrapperUtils.approveMileagesClone1(JSON.serialize(obj_list_mileages));
                WrapperUtils.TripCallout(obj_Driver_list[0].id,'February','2020','1.0','12',obj_Employee_Reimbursement_list[0].id,'2.1','U');
                WrapperUtils.readFromFileInchunk('test',att.Name,String.valueOf(att.Id),String.valueOf(obj_Driver_list[0].Id),String.valueOf(obj_Account.Id),null);
                WrapperUtils.getEmployeeReimbursementDetails(obj_Employee_Reimbursement_list[0]);
            }
        Test.stopTest();   
    }
    public static testmethod void wrapperUtilstestMethod1() {
        TriggerConfig__c triggerCustomSetting = TestDataFactory.triggerConfigCustomSetting(true);
        SendEmail__c triggerCustomSetting1 = TestDataFactory.sendEmailCustomSetting(false,'EmployeeReimbursementTrigger');
        triggerCustomSetting1.Send_email_from_code__c = false;
        insert triggerCustomSetting1;
        WrapperUtils obj_WrapperUtils = new WrapperUtils();
        IRS_Mileage_Rate__c obj_IRS_Mileage_Rate = TestDataFactory.createIRSRate(true,0);
        RecordUtilityClass.sendEmailforCompliance();
        RecordUtilityClass.enableMappingGasPriceTrigger();
        RecordUtilityClass.vehicleUrlMapping();
        TrueDialog_Keys__c tdKeys = TestDataFactory.createTrueDialog(true);
        UserRole userRole_1 = TestDataFactory.getUserRole();
        Profile profile_1 = TestDataFactory.getUserProfile();
        User admin = TestDataFactory.getSystemAdminUser(userRole_1.Id);
        User user_1;
        Account obj_Account;
        Contact obj_admincontact;
        List<Contact> obj_Manager_list;
        List<Contact> obj_Driver_list;
        System.runAs(admin) {            
            obj_Account = RecordUtilityClass.buildAccount();
            insert obj_Account;
            Contact contactObj = TestDataFactory.createCICDContact(true,obj_Account.Id);
            obj_admincontact = RecordUtilityClass.buildAdminContact(obj_Account);
            insert obj_admincontact;       

            obj_Manager_list = RecordUtilityClass.buildManagerContact(obj_Account,obj_admincontact);
            insert obj_Manager_list;

            obj_Driver_list = RecordUtilityClass.buildDriverContact(obj_Account,obj_Manager_list[0]);
            for(Contact currentContact:obj_Driver_list) {
                currentContact.compliancestatus__c='No – Insurance Card';
            }
            insert obj_Driver_list;
            user_1 = TestDataFactory.createUser(true, profile_1.Id, contactObj.Id);
        }
    
        list<Employee_Reimbursement__c> obj_Employee_Reimbursement_list = RecordUtilityClass.buildPendingEmployee_Reimbursement(obj_Driver_list);
        insert obj_Employee_Reimbursement_list;  
        
        //String myJSON = JSON.serialize(obj_Employee_Reimbursement_list[0] );
        
        list<Bi_Weekly_Reimbursement__c> empBIweekReimbursementList4 = RecordUtilityClass.buildPendingBiReimbursement(obj_Driver_list);
        insert empBIweekReimbursementList4;
        
        List<Employee_Mileage__c> obj_Employee_Mileage_list = RecordUtilityClass.buildNoApprovedYetEmployeeMileages(obj_Employee_Reimbursement_list, empBIweekReimbursementList4[0].id);
        insert obj_Employee_Mileage_list;

        List<Employee_Reimbursement__c> obj_newreimbursements = TestDataFactory.createPendingReimbursement(true, obj_Driver_list, 10, obj_IRS_Mileage_Rate.id);
       
        list<Bi_Weekly_Reimbursement__c> empBIweekReimbursementList5 = RecordUtilityClass.buildPendingBiReimbursement(obj_Driver_list);
        insert empBIweekReimbursementList5;
    
        List<Employee_Mileage__c> obj_Employee_Mileage_list1 = RecordUtilityClass.buildNoApprovedYetEmployeeMileages(obj_newreimbursements, empBIweekReimbursementList5[0].id);
        insert obj_Employee_Mileage_list1;

        List<Employee_Reimbursement__c> obj_Employee_Reimbursement_List3 = RecordUtilityClass.getEmployee_Reimbursement(obj_Account.id);
        List<EmployeeReimbursementDetailsAdmin> obj_EmployeeReimbursementDetailsAdmin_List = RecordUtilityClass.getListofEmployeeReimbursementDetailsAdmin(obj_Employee_Reimbursement_List3);
        
        List<String> milIdList = new List<String>();
        List<Employee_Mileage__c> obj_list_mileages =  RecordUtilityClass.getMileagesList();
        milIdList.add(obj_list_mileages[0].Id);
        
        /*List<string> EmpmilList = new List<string>();
        EmpmilList.add(obj_Employee_Mileage_list[0]); 
        */
        
        List<EmployeeMileages> obj_EmployeeMileages_list1=new List<EmployeeMileages>();
        List<EmployeeMileages> obj_EmployeeMileages_list2=new List<EmployeeMileages>();
        List<EmployeeMileages> obj_EmployeeMileages_list6=RecordUtilityClass.getallEmployeeMileages(obj_list_mileages);
        if(obj_EmployeeMileages_list6!=null && obj_EmployeeMileages_list6.size()>0) {
            Integer i=0;
            for(EmployeeMileages obj:obj_EmployeeMileages_list6) {
                if(i==0) {
                    i++;
                    obj.isSelected=true;
                    obj_EmployeeMileages_list2.add(obj);
                } else {
                    i--;
                    obj.isChecked = true;
                    obj_EmployeeMileages_list1.add(obj);
                }                
            }
        }
    
        List<Employee_Reimbursement__c> obj_Employee_Reimbursement_list_update = new List<Employee_Reimbursement__c>();
        List<string> obj_Employee_Reimbursement_list_update1 = new List<string>();
        for(Employee_Reimbursement__c obj:obj_newreimbursements) {
            obj.Approved_Date__c = system.today();
            obj.Status__c = 'Approved';
            obj_Employee_Reimbursement_list_update.add(obj);
        }
        for(Employee_Reimbursement__c obj:obj_newreimbursements) {            
            obj_Employee_Reimbursement_list_update1.add(obj.id);
        }
        EmployeeReimbursements obj_EmployeeReimbursements = WrapperUtils.getEmployeeReimbursements(obj_Employee_Reimbursement_list[0],23, 1);
        List<EmployeeReimbursements> obj_EmployeeReimbursements_list2 = new List<EmployeeReimbursements>();
        obj_EmployeeReimbursements_list2.add(obj_EmployeeReimbursements);    
        
        for(Employee_Reimbursement__c obj:obj_Employee_Reimbursement_list) {
            obj.Approved_Date__c = system.today();
            obj.Status__c = 'Approved';
            obj_Employee_Reimbursement_list_update.add(obj);
        }
        update obj_Employee_Reimbursement_list_update;
        

        WrapperUtils.getChartData(obj_admincontact.id,obj_admincontact.showTeamRecord__c,obj_Account.id,'Driver');
        WrapperUtils.getComplianceCalculation(obj_Driver_list[0].id,String.valueOf(System.Today().year()));
        List<Contact> obj_updated_Driver_list =  new List<Contact>();
        for(Contact obj_contact:obj_Driver_list) {
            obj_contact.Deactivated_Date__c = system.today();
            obj_contact.Last_Pay_Date__c = system.today();
            obj_contact.Driving_States__c='AK;AL;';
            obj_updated_Driver_list.add(obj_contact);
        }
        update obj_updated_Driver_list;        
        WrapperUtils.getChartData(obj_admincontact.id,false,obj_Account.id,'Driver');
        obj_admincontact.showTeamRecord__c = true;
        update obj_admincontact;
        Test.startTest();
            System.runAs(user_1) {
                WrapperUtils.getChartData(obj_admincontact.id,false,obj_Account.id,'Driver');
                EmployeeDetails obj_EmployeeDetails = WrapperUtils.getEmployeeDetails(obj_Driver_list[0],110.50,230.50);
                List<EmployeeDetails> obj_list_EmployeeDetails1 = new List<EmployeeDetails>();
                obj_list_EmployeeDetails1.add(obj_EmployeeDetails);
                
                WrapperUtils.getContact(obj_EmployeeDetails);
                WrapperUtils.getNewContact(obj_EmployeeDetails);
                WrapperUtils.getMonthName('11-2019');
                WrapperUtils.getMonthno('November');
                WrapperUtils.getMonthandYear('November');
                WrapperUtils.getMileagesOfReimbursement(obj_list_mileages[0]);
                WrapperUtils.getLastMonthValue(-1);
            
                WrapperUtils.getPacketandMeetingDetails(obj_Driver_list[0].id);
                List<String> reimbusementidList = new List<String>();
                reimbusementidList.add(obj_Employee_Reimbursement_list_update1[0]);
                WrapperUtils.updateReimbursements(JSON.serialize(reimbusementidList));
                WrapperUtils.updateContactThresholdLimit(JSON.serialize(obj_Employee_Reimbursement_list));
                WrapperUtils.getManager(obj_Driver_list[0].id,obj_admincontact.id);
                WrapperUtils.getadminname(obj_Driver_list[0].id);
                // ManagerDashboard Class Methods
                Attachment att = new Attachment();
                att.parentID = obj_Driver_list[0].Id;
                att.name = 'test';
                att.body = blob.valueOf('Test');
                insert att;
                WrapperUtils.getDriverGasPrice('CA','ON');
                WrapperUtils.getAllReimbursements(String.valueOf(System.today().Year()),String.valueOf(obj_Driver_list[0].id),obj_Account.id);
                WrapperUtils.getReimbursementsList(obj_Driver_list[0].id,'Approved');
                WrapperUtils.getMileages('November','2019',obj_Driver_list[0].id);
                WrapperUtils.getMileages1('November',String.valueOf(system.today().year()),obj_Driver_list[0].id);
                WrapperUtils.getpastYearReimbursement(obj_Driver_list[0].id);
                WrapperUtils.getLast2Years();
                WrapperUtils.getReimbursementsListClone(obj_Driver_list[0].id);
                WrapperUtils.approveReimbursements('2019',obj_Driver_list[0].id,obj_Account.id,JSON.serialize(obj_EmployeeReimbursements_list2));
                WrapperUtils.updateLockDate(obj_Account.id,obj_Driver_list[0].id);
                WrapperUtils.readFromFileInchunk('test',att.Name,String.valueOf(att.Id),String.valueOf(obj_Driver_list[0].Id),String.valueOf(obj_Account.Id),null);
                WrapperUtils.getUnapprovedReimbursements(String.valueOf(obj_Driver_list[0].Id), String.valueOf(obj_Account.Id), true, 'Driver');
                 WrapperUtils.getDriverFuelVariableRate(String.valueOf(obj_Driver_list[0].Id));
                WrapperUtils.getLastMonthReimbursements(String.valueOf(obj_Driver_list[0].Id), String.valueOf(obj_Account.Id), true, 'Driver');
                WrapperUtils.getLastMonthReimbursements(String.valueOf(obj_Driver_list[0].Id), String.valueOf(obj_Account.Id), true, 'Admin');
                WrapperUtils.getLastMonthReimbursements(String.valueOf(obj_Driver_list[0].Id), String.valueOf(obj_Account.Id), false, 'Admin');
                WrapperUtils.getLastMonthReimbursements(String.valueOf(obj_Driver_list[0].Id), String.valueOf(obj_Account.Id), true, 'Manager');
                WrapperUtils.getLastMonthReimbursements(String.valueOf(obj_Driver_list[0].Id), String.valueOf(obj_Account.Id), false, 'Manager');
                WrapperUtils.updateReimbursements(JSON.serialize(reimbusementidList));
               
                WrapperUtils.UpdateMileages(milIdList,'Not Approved Yet');
                
                String reimbursement = RecordUtilityClass.getUnapprovedReimbursements(obj_admincontact.id,obj_Account.id,true,'Admin');
                List<EmployeeMileagesForCalculation> employeereimbursementList = new List<EmployeeMileagesForCalculation>();
                employeereimbursementList = (List<EmployeeMileagesForCalculation>)JSON.deserialize(reimbursement,List<EmployeeMileagesForCalculation>.Class);
                system.debug('employeereimbursementList=='+ employeereimbursementList);
                
                WrapperUtils.getUnapprovedMileages(JSON.serialize(employeereimbursementList[0]));
                //WrapperUtils.approveMileagesClone1(JSON.serialize(EmpmilList ));
               // WrapperUtils.approveMileagesForAdminDash('true', 'true', 'Not Approved Yet', 'Test Mileages', 'test.email@gmail.com');
            }
        Test.stopTest();   
    }
    public static testmethod void wrapperUtilstestMethod2() {
        TriggerConfig__c triggerCustomSetting = TestDataFactory.triggerConfigCustomSetting(true);
        SendEmail__c triggerCustomSetting1 = TestDataFactory.sendEmailCustomSetting(false,'EmployeeReimbursementTrigger');
        triggerCustomSetting1.Send_email_from_code__c = false;
        insert triggerCustomSetting1;
        WrapperUtils obj_WrapperUtils = new WrapperUtils();
        IRS_Mileage_Rate__c obj_IRS_Mileage_Rate = TestDataFactory.createIRSRate(true,0);
        RecordUtilityClass.sendEmailforCompliance();
        RecordUtilityClass.enableMappingGasPriceTrigger();
        RecordUtilityClass.vehicleUrlMapping();
        TrueDialog_Keys__c tdKeys = TestDataFactory.createTrueDialog(true);
        UserRole userRole_1 = TestDataFactory.getUserRole();
        Profile profile_1 = TestDataFactory.getUserProfile();
        User admin = TestDataFactory.getSystemAdminUser(userRole_1.Id);
        User user_1;
        Account obj_Account;
        Contact obj_admincontact;
        List<Contact> obj_Manager_list;
        List<Contact> obj_Driver_list;
        System.runAs(admin) {            
            obj_Account = RecordUtilityClass.buildAccount();
            insert obj_Account;
            Contact contactObj = TestDataFactory.createCICDContact(true,obj_Account.Id);
            obj_admincontact = RecordUtilityClass.buildAdminContact(obj_Account);
            insert obj_admincontact;       

            obj_Manager_list = RecordUtilityClass.buildManagerContact(obj_Account,obj_admincontact);
            insert obj_Manager_list;

            obj_Driver_list = RecordUtilityClass.buildDriverContact(obj_Account,obj_Manager_list[0]);
            for(Contact currentContact:obj_Driver_list) {
                currentContact.compliancestatus__c='No – Insurance Card';
            }
            insert obj_Driver_list;
            user_1 = TestDataFactory.createUser(true, profile_1.Id, contactObj.Id);
        }
    
        list<Employee_Reimbursement__c> obj_Employee_Reimbursement_list = RecordUtilityClass.buildPendingEmployee_Reimbursement(obj_Driver_list);
        insert obj_Employee_Reimbursement_list;  
        
        //String myJSON = JSON.serialize(obj_Employee_Reimbursement_list[0] );
        
        list<Bi_Weekly_Reimbursement__c> empBIweekReimbursementList4 = RecordUtilityClass.buildPendingBiReimbursement(obj_Driver_list);
        insert empBIweekReimbursementList4;
        
        List<Employee_Mileage__c> obj_Employee_Mileage_list = RecordUtilityClass.buildNoApprovedYetEmployeeMileages(obj_Employee_Reimbursement_list, empBIweekReimbursementList4[0].id);
        insert obj_Employee_Mileage_list;

        List<Employee_Reimbursement__c> obj_newreimbursements = TestDataFactory.createPendingReimbursement(true, obj_Driver_list, 10, obj_IRS_Mileage_Rate.id);
       
        list<Bi_Weekly_Reimbursement__c> empBIweekReimbursementList5 = RecordUtilityClass.buildPendingBiReimbursement(obj_Driver_list);
        insert empBIweekReimbursementList5;
    
        List<Employee_Mileage__c> obj_Employee_Mileage_list1 = RecordUtilityClass.buildNoApprovedYetEmployeeMileages(obj_newreimbursements, empBIweekReimbursementList5[0].id);
        insert obj_Employee_Mileage_list1;

        List<Employee_Reimbursement__c> obj_Employee_Reimbursement_List3 = RecordUtilityClass.getEmployee_Reimbursement(obj_Account.id);
        List<EmployeeReimbursementDetailsAdmin> obj_EmployeeReimbursementDetailsAdmin_List = RecordUtilityClass.getListofEmployeeReimbursementDetailsAdmin(obj_Employee_Reimbursement_List3);
        List<Employee_Mileage__c> obj_list_mileages =  RecordUtilityClass.getMileagesList();
        /*List<string> EmpmilList = new List<string>();
        EmpmilList.add(obj_Employee_Mileage_list[0]); 
        */
        
        List<EmployeeMileages> obj_EmployeeMileages_list1=new List<EmployeeMileages>();
        List<EmployeeMileages> obj_EmployeeMileages_list2=new List<EmployeeMileages>();
        List<EmployeeMileages> obj_EmployeeMileages_list6=RecordUtilityClass.getallEmployeeMileages(obj_list_mileages);
        if(obj_EmployeeMileages_list6!=null && obj_EmployeeMileages_list6.size()>0) {
            Integer i=0;
            for(EmployeeMileages obj:obj_EmployeeMileages_list6) {
                if(i==0) {
                    i++;
                    obj.isSelected=true;
                    obj_EmployeeMileages_list2.add(obj);
                } else {
                    i--;
                    obj.isChecked = true;
                    obj_EmployeeMileages_list1.add(obj);
                }                
            }
        }
    
        List<Employee_Reimbursement__c> obj_Employee_Reimbursement_list_update = new List<Employee_Reimbursement__c>();
        List<string> obj_Employee_Reimbursement_list_update1 = new List<string>();
        for(Employee_Reimbursement__c obj:obj_newreimbursements) {
            obj.Approved_Date__c = system.today();
            obj.Status__c = 'Approved';
            obj_Employee_Reimbursement_list_update.add(obj);
        }
        for(Employee_Reimbursement__c obj:obj_newreimbursements) {            
            obj_Employee_Reimbursement_list_update1.add(obj.id);
        }
        EmployeeReimbursements obj_EmployeeReimbursements = WrapperUtils.getEmployeeReimbursements(obj_Employee_Reimbursement_list[0],23, 1);
        List<EmployeeReimbursements> obj_EmployeeReimbursements_list2 = new List<EmployeeReimbursements>();
        obj_EmployeeReimbursements_list2.add(obj_EmployeeReimbursements);    
        
        for(Employee_Reimbursement__c obj:obj_Employee_Reimbursement_list) {
            obj.Approved_Date__c = system.today();
            obj.Status__c = 'Approved';
            obj_Employee_Reimbursement_list_update.add(obj);
        }
        update obj_Employee_Reimbursement_list_update;
        

        WrapperUtils.getChartData(obj_admincontact.id,obj_admincontact.showTeamRecord__c,obj_Account.id,'Driver');
        WrapperUtils.getComplianceCalculation(obj_Driver_list[0].id,String.valueOf(System.Today().year()));
        List<Contact> obj_updated_Driver_list =  new List<Contact>();
        for(Contact obj_contact:obj_Driver_list) {
            obj_contact.Deactivated_Date__c = system.today();
            obj_contact.Last_Pay_Date__c = system.today();
            obj_contact.Driving_States__c='AK;AL;';
            obj_updated_Driver_list.add(obj_contact);
        }
        update obj_updated_Driver_list;        
        WrapperUtils.getChartData(obj_admincontact.id,false,obj_Account.id,'Driver');
        obj_admincontact.showTeamRecord__c = true;
        update obj_admincontact;
        Test.startTest();
            System.runAs(user_1) {
                WrapperUtils.getChartData(obj_admincontact.id,false,obj_Account.id,'Driver');
                EmployeeDetails obj_EmployeeDetails = WrapperUtils.getEmployeeDetails(obj_Driver_list[0],110.50,230.50);
                List<EmployeeDetails> obj_list_EmployeeDetails1 = new List<EmployeeDetails>();
                obj_list_EmployeeDetails1.add(obj_EmployeeDetails);
                
                WrapperUtils.getContact(obj_EmployeeDetails);
                WrapperUtils.getNewContact(obj_EmployeeDetails);
                WrapperUtils.getMonthName('11-2019');
                WrapperUtils.getMonthno('November');
                WrapperUtils.getMonthandYear('November');
                WrapperUtils.getMileagesOfReimbursement(obj_list_mileages[0]);
                WrapperUtils.getLastMonthValue(-1);
            
                WrapperUtils.getPacketandMeetingDetails(obj_Driver_list[0].id);
                List<String> reimbusementidList = new List<String>();
                reimbusementidList.add(obj_Employee_Reimbursement_list_update1[0]);
                WrapperUtils.updateReimbursements(JSON.serialize(reimbusementidList));
                WrapperUtils.updateContactThresholdLimit(JSON.serialize(obj_Employee_Reimbursement_list));
                WrapperUtils.getManager(obj_Driver_list[0].id,obj_admincontact.id);
                WrapperUtils.getadminname(obj_Driver_list[0].id);
                // ManagerDashboard Class Methods
                Attachment att = new Attachment();
                att.parentID = obj_Driver_list[0].Id;
                att.name = 'test';
                att.body = blob.valueOf('Test');
                insert att;
                WrapperUtils.getDriverGasPrice('CA','ON');
                WrapperUtils.getAllReimbursements(String.valueOf(System.today().Year()),String.valueOf(obj_Driver_list[0].id),obj_Account.id);
                WrapperUtils.getReimbursementsList(obj_Driver_list[0].id,'Approved');
                WrapperUtils.getMileages('November','2019',obj_Driver_list[0].id);
                WrapperUtils.getMileages1('November',String.valueOf(system.today().year()),obj_Driver_list[0].id);
                WrapperUtils.getpastYearReimbursement(obj_Driver_list[0].id);
                WrapperUtils.getLast2Years();
                WrapperUtils.getReimbursementsListClone(obj_Driver_list[0].id);
                WrapperUtils.approveReimbursements('2019',obj_Driver_list[0].id,obj_Account.id,JSON.serialize(obj_EmployeeReimbursements_list2));
                WrapperUtils.updateLockDate(obj_Account.id,obj_Driver_list[0].id);
                WrapperUtils.readFromFileInchunk('test',att.Name,String.valueOf(att.Id),String.valueOf(obj_Driver_list[0].Id),String.valueOf(obj_Account.Id),null);
                WrapperUtils.getUnapprovedReimbursements(String.valueOf(obj_Driver_list[0].Id), String.valueOf(obj_Account.Id), true, 'Driver');
                WrapperUtils.getUnapprovedReimbursements(String.valueOf(obj_Driver_list[0].Id), String.valueOf(obj_Account.Id), true, 'Admin');
                WrapperUtils.getUnapprovedReimbursements(String.valueOf(obj_Driver_list[0].Id), String.valueOf(obj_Account.Id), false, 'Admin');
                WrapperUtils.getUnapprovedReimbursements(String.valueOf(obj_Driver_list[0].Id), String.valueOf(obj_Account.Id), true, 'Manager');
                WrapperUtils.getUnapprovedReimbursements(String.valueOf(obj_Driver_list[0].Id), String.valueOf(obj_Account.Id), false, 'Manager');
                 WrapperUtils.getDriverFuelVariableRate(String.valueOf(obj_Driver_list[0].Id));
                WrapperUtils.getLastMonthReimbursements(String.valueOf(obj_Driver_list[0].Id), String.valueOf(obj_Account.Id), true, 'Driver');
                WrapperUtils.updateReimbursements(JSON.serialize(reimbusementidList));
                //WrapperUtils.getUnapprovedMileages(JSON.serialize(obj_EmployeeReimbursements_list2));
                //WrapperUtils.approveMileagesClone1(JSON.serialize(EmpmilList ));
                //WrapperUtils.approveMileagesForAdminDash('Checked', 'selected', 'Not Approved Yet', 'Test Mileages', 'test.email@gmail.com');
            }
        Test.stopTest();   
    }
}