var MobProxy = require('browsermob-proxy-api');

// Basically what we are doing is attaching our proxy object to the nightwatch client so it can be used throughout e2e tests
// We also initialize the proxy at this time
function setupBrowserMob(nightwatch, callback, port='8080', host='localhost', proxyPort=10800) {
  // initializing and attaching the proxy object onto the night watch object
  nightwatch.proxy = new MobProxy({'host': host, 'port': port});

  console.log("STARTING PROXY AT PORT: " + proxyPort);
  nightwatch.perform(function(done) {
    nightwatch.proxy.startPort(proxyPort, done);
    nightwatch.proxy.stopPort(nightwatch.proxyPort, done);
    nightwatch.proxy.startPort(proxyPort, done);
  });

  // attach the proxy object to the desired capabilities
  // nightwatch.options.desiredCapabilities.proxy = { httpProxy: host + ':' +  proxyPort, prixyType: "manual" };
  nightwatch.proxyPort = proxyPort;

  // exec callback if needed
  if (typeof callback === "function") {
    callback();
  }
};

function tearDownProxy(nightwatch) {
  console.log("STOPPING PROXY AT PORT: " + nightwatch.proxyPort);
  nightwatch.perform(function(done) {
    nightwatch.proxy.stopPort(nightwatch.proxyPort, done);
  });
};

function initializeHar(nightwatch) {
  nightwatch.perform(function(done) {
    nightwatch.proxy.createHAR(this.proxyPort, { captureContent: 'True', captureHeaders: 'True', initialPageRef: 'foo' }, function() {
      console.log('when is this happening');
      done();
    });
  });
};

module.exports = {
  setupBrowserMob: setupBrowserMob,
  tearDownProxy: tearDownProxy,
  initializeHar: initializeHar
};