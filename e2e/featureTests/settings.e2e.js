describe('Settings Page Features', () => {

    beforeEach(async () => {
        await device.reloadReactNative();
    });


    it('settings page features should work properly', async () => {
        await device.disableSynchronization();

        //Login.js
        await waitFor(element(by.id('email'))).toBeVisible().withTimeout(5000);
        await element(by.id('email')).typeText('detoxtest@test.com');

        await waitFor(element(by.id('password'))).toBeVisible().withTimeout(2000);
        await element(by.id('password')).typeText('test123');

        await waitFor(element(by.id('login'))).toBeVisible().withTimeout(2000);

        await element(by.text('Login')).atIndex(1).tap();


        //ChooseAccount.js
        await waitFor(element(by.id('Who\'s Watching ThinkStation?'))).toBeVisible().withTimeout(5000);
        await waitFor(element(by.id('parentPage'))).toBeVisible().withTimeout(2000);
        await element(by.id('parentPage')).tap();

        try {

            // android-specific: enter text into the password prompt
            //  (unfortunately we cannot give it a testID unless we fork the prompt repository and add it in ourselves)
            await waitFor(element(by.type('android.widget.EditText'))).toBeVisible().withTimeout(5000);
            await element(by.type('android.widget.EditText')).typeText('test123');

        } catch (e) {

            // iOS-specific type to enter text into the password prompt
            // disclaimer: i haven't tested if this works iOS, might need to use a different type
            await waitFor(element(by.type('_UIAlertControllerTextField'))).toBeVisible().withTimeout(5000);
            await element(by.type('_UIAlertControllerTextField')).typeText('test123');
        }

        await element(by.text('OK')).tap();


        //Settings.js

        try {
            // for emulators: must use physical device for push notifications
            await waitFor(element(by.text('OK'))).toBeVisible().withTimeout(5000);
            await expect(element(by.text('OK'))).toBeVisible();
            await element(by.text('OK')).tap();

        } catch (e) {
            // physical device, carry on
        }


        //--manage children--
        await waitFor(element(by.id('settingsAddChildren'))).toBeVisible().withTimeout(5000);
        await element(by.id('settingsAddChildren')).tap();

        try {
            // for emulators: must use physical device for push notifications
            await waitFor(element(by.text('OK'))).toBeVisible().withTimeout(5000);
            await expect(element(by.text('OK'))).toBeVisible();
            await element(by.text('OK')).tap();

        } catch (e) {
            // physical device, carry on
        }

        await waitFor(element(by.id('deletetester'))).toBeVisible().withTimeout(2000);
        await element(by.id('deletetester')).tap();

        await waitFor(element(by.text('Delete'))).toBeVisible().withTimeout(2000);
        await element(by.text('Delete')).tap();

        await waitFor(element(by.id('nickname'))).toBeVisible().withTimeout(2000);
        await element(by.id('nickname')).typeText('tester');
        await element(by.id('saveChildAccounts')).tap();

        await waitFor(element(by.text('Make sure to add a child account'))).toBeVisible().withTimeout(5000);
        await element(by.text('OK')).tap();

        await waitFor(element(by.id('nickname'))).toBeVisible().withTimeout(2000);
        await waitFor(element(by.id('addStudent'))).toBeVisible().withTimeout(2000);
        await element(by.id('addStudent')).tap();

        await element(by.id('saveChildAccounts')).tap();


        //--notifications toggle--
        await waitFor(element(by.id('notifications'))).toBeVisible().withTimeout(5000);


        //--feedback--
        await waitFor(element(by.id('feedback'))).toBeVisible().withTimeout(5000);
        await waitFor(element(by.id('submitFeedback'))).toBeVisible().withTimeout(2000);
        await element(by.id('submitFeedback')).tap();

        // make sure the user cannot submit empty messages
        await waitFor(element(by.text('Please enter a message.'))).toBeVisible().withTimeout(5000);
        await element(by.text('OK')).tap();

        await element(by.id('feedback')).typeText('Detox test feedback');
        await element(by.id('submitFeedback')).tap();
        await waitFor(element(by.text('Thanks for your feedback!'))).toBeVisible().withTimeout(5000);
        await element(by.text('OK')).tap();

        // go back to choose account page
        await waitFor(element(by.id('header-back')).atIndex(0)).toBeVisible().withTimeout(5000);
        await element(by.id('header-back')).atIndex(0).tap();


        //ChooseAccounts.js - see that the child accounts have been accurately updated
        await waitFor(element(by.id('Who\'s Watching ThinkStation?'))).toBeVisible().withTimeout(5000);
        await waitFor(element(by.id('tester'))).toBeVisible().withTimeout(2000);
        await element(by.id('tester')).tap();


    });
});
