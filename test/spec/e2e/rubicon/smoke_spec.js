var browserMob = require('../custom-setup/browserMobHelper');

module.exports = {
  before: browserMob.setupBrowserMob,
  after: browserMob.tearDownProxy,
  // 'dummy' : function (browser) {
  //   browser
  //     .startHar()
  //     .end();
  // },
  'Test Consent Module: CMP: On, AllowAuction: False, Timeout: 750' : function (browser) {
    browser
      .startHar()
      .pause(500)
      .startHar()
      .pause(500)
      .url('http://localhost:9999/test/spec/e2e/gpt-examples/gdpr_test_01.html?pbjs_debug=true')
      .waitForElementVisible("body")
      .waitHttpRequest('fastlane.rubiconproject.com')
      .getLog('browser', function(result) {
        console.log(result);
      })
      .end();
  }
};