var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

function synchronousWait(ms) {
  var start = Date.now(),
    now = start;
  while (now - start < ms) {
    now = Date.now();
  }
}

function getHarEntries() {
  var request = new XMLHttpRequest();
  request.open('GET', 'http://localhost:8080/proxy/10800/har', false);
  request.send(null);
  harData = JSON.parse(request.responseText);
  if (harData && harData.log) {
    return harData.log.entries;
  }
  else {
    return [];
  }
}

exports.assertion = function(requestUrlMatch, timeout=10000, msg) {

  this.message = msg || 'Waiting and Verifying that a url like ' + requestUrlMatch + ' is fired.';

  this.expected = true;

  this.pass = value => value === this.expected;

  this.value = result => result.value

  this.command = callback => {
    const self = this
    // Now we wait until it is fired or timeouts
    function getHarEntries() {
      var request = new XMLHttpRequest();
      request.open('GET', 'http://localhost:8080/proxy/10800/har', false);
      request.send(null);
      harData = JSON.parse(request.responseText);
      if (harData && harData.log) {
        return harData.log.entries;
      }
      else {
        return [];
      }
    };
    var start = Date.now();
    var done = false;
    var found = false;
    console.log('MATCH URL TO CHECK: ' + requestUrlMatch);
    while (!done) {
      httpEntries = getHarEntries();
      for (let httpEntry of httpEntries) {  // using 'for let of' instead of 'forEach' so we can break without looping through all
        if (httpEntry.request.url.indexOf(requestUrlMatch) >= 0) {
          console.log("FOUND A MATCH! URL: " + httpEntry.request.url);
          done = true;
          found = true;
          break;
        }
      }
      var now = Date.now();
      if (now - start > timeout) {
        // Took too long bail
        console.log('NEVER FOUND A MATCH FOR REQUEST URL: ' + requestUrlMatch);
        done = true;
      }
      if (!done) {
        synchronousWait(200);  // poll interval
      }
    }
    result => { callback.call(self, result) };
  };

  return this;
}