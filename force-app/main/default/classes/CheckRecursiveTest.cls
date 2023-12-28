@isTest
public class CheckRecursiveTest {

    @isTest
    static void testRunOnce() {
        System.assertEquals(true, checkRecursive.runOnce());
        System.assertEquals(false, checkRecursive.runOnce());
        System.assertEquals(true, checkRecursive.runSecondFlag());
        System.assertEquals(false, checkRecursive.runSecondFlag());
        System.assertEquals(true, checkRecursive.getting_SetLatLondAddressFlag());
        checkRecursive.setting_SetLatLondAddressFlag(false);
        System.assertEquals(false, checkRecursive.getting_SetLatLondAddressFlag());
        checkRecursive.setting_SetLatLondAddressFlag(true);
        System.assertEquals(true, checkRecursive.getting_SetLatLondAddressFlag());
        checkRecursive.setting_run(false);
        System.assertEquals(false, checkRecursive.runOnce());
        checkRecursive.setting_run(true);
        System.assertEquals(true, checkRecursive.runOnce());
    }

    
}