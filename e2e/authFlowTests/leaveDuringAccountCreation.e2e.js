describe('User Leaves During Account Creation', () => {


    beforeEach(async () => {
        await device.reloadReactNative();
    });

    it('leave during account creation', async () => {

        await device.disableSynchronization();

        //Login.js
        await waitFor(element(by.id('email'))).toBeVisible().withTimeout(5000);
        await waitFor(element(by.id('password'))).toBeVisible().withTimeout(2000);
        await waitFor(element(by.id('login'))).toBeVisible().withTimeout(2000);
        await waitFor(element(by.id('createAccount'))).toBeVisible().withTimeout(2000);

        await element(by.id('createAccount')).tap();

        // privacy policy will pop up
        await waitFor(element(by.id('privacyPolicy'))).toBeVisible().withTimeout(2000);
        await element(by.text('Continue')).tap();

        try {
            // for emulators: must use physical device for push notifications
            await waitFor(element(by.text('OK'))).toBeVisible().withTimeout(2000);
            await expect(element(by.text('OK'))).toBeVisible();
            await element(by.text('OK')).tap();

        } catch (e) {
            // physical device, carry on
        }

        //Welcome.js
        await waitFor(element(by.id('welcomeText1'))).toBeVisible().withTimeout(5000);
        await waitFor(element(by.id('welcomeText2'))).toBeVisible().withTimeout(2000);
        await waitFor(element(by.id('continueToSignup'))).toBeVisible().withTimeout(2000);
        await element(by.id('continueToSignup')).tap();

        //SignUp.js
        await waitFor(element(by.id('createParentAccount'))).toBeVisible().withTimeout(5000);

        await waitFor(element(by.id('parentName'))).toBeVisible().withTimeout(2000);
        await element(by.id('parentName')).typeText('Bob Test');

        await expect(element(by.id('companyEmail'))).toBeVisible();
        await element(by.id('companyEmail')).typeText('deleteme@test.com');

        await expect(element(by.id('createParentPassword'))).toBeVisible();
        await element(by.id('createParentPassword')).typeText('test123');

        await expect(element(by.id('retypeParentPassword'))).toBeVisible();
        await element(by.id('retypeParentPassword')).typeText('test123');

        await waitFor(element(by.id('gotoCreateChildAccounts'))).toBeVisible().withTimeout(2000);
        await element(by.id('gotoCreateChildAccounts')).tap();

        //AddChildAccount.js
        await waitFor(element(by.id('nickname'))).toBeVisible().withTimeout(5000);

        // user leaves during the signup process after entering their email
        await device.reloadReactNative();


        // user opens the app again
        //AddChildAccount.js
        await waitFor(element(by.id('saveChildAccounts'))).toBeVisible().withTimeout(10000);
        await element(by.id('saveChildAccounts')).tap();

        //dismiss the alert: make sure user can't proceed without adding children
        await waitFor(element(by.text('OK'))).toBeVisible().withTimeout(2000);
        await element(by.text('OK')).tap();

        await element(by.id('nickname')).typeText('junior');
        await waitFor(element(by.id('addStudent'))).toBeVisible().withTimeout(2000);
        await element(by.id('addStudent')).tap();

        await waitFor(element(by.text('junior'))).toBeVisible().withTimeout(5000);
        await expect(element(by.text('junior'))).toBeVisible();

        await element(by.id('saveChildAccounts')).tap();

        //ChooseAccount.js (logged in)
        await waitFor(element(by.id('Who\'s Watching ThinkStation?'))).toBeVisible().withTimeout(5000);
        await waitFor(element(by.id('junior'))).toBeVisible().withTimeout(2000);
        await element(by.id('junior')).tap();

    });
});
