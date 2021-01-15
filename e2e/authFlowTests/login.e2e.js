describe('Login', () => {

    beforeEach(async () => {
      await device.reloadReactNative();
    });
  
    
    it('log in', async () => {
      await device.disableSynchronization();
  
      //Login.js
      await waitFor(element(by.id('email'))).toBeVisible().withTimeout(5000);
      await element(by.id('email')).typeText('detoxtest@test.com');
  
      await waitFor(element(by.id('password'))).toBeVisible().withTimeout(2000);
      await element(by.id('password')).typeText('test123');
  
      await waitFor(element(by.id('login'))).toBeVisible().withTimeout(2000);
  
      await (element(by.text('Login')).atIndex(1)).tap();
  
  
      //ChooseAccount.js
      await waitFor(element(by.id('Who\'s Watching ThinkStation?'))).toBeVisible().withTimeout(5000);
      await waitFor(element(by.id('tester'))).toBeVisible().withTimeout(2000);
      await element(by.id('tester')).tap();
  
  
      //Channels.js
      await waitFor(element(by.id('Detox Test Channel'))).toBeVisible().withTimeout(5000);
      await element(by.id('Detox Test Channel')).tap();
  
  
      //Classroom.js
      await waitFor(element(by.id('waitingForClass'))).toBeVisible().withTimeout(5000);
  
    });
  });
  