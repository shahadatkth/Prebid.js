var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

function synchronousWait(ms) {
  var start = Date.now(),
    now = start;
  while (now - start < ms) {
    now = Date.now();
  }
}

function getHarEntries() {
  console.log("GETTING HAR");
  var request = new XMLHttpRequest();
  request.open('GET', 'http://localhost:8080/proxy/10800/har', false);
  request.send(null);
  console.log("SENT");
  harData = JSON.parse(request.responseText);
  if (harData && harData.log) {
    return harData.log.entries;
  }
  else {
    return [];
  }
}

exports.command = function(requestUrlMatch, timeout=10000) {
  var browser = this;
  browser.perform(function() {
    var count = 0;
    var start = Date.now();
    var done = false;
    while (!done) {
      console.log('TRY NUMBER: ' + count++);
      httpEntries = getHarEntries();
      for (let httpEntry of httpEntries) {
        console.log("URL: " + httpEntry.request.url);
        if (httpEntry.request.url.indexOf(requestUrlMatch) >= 0) {
          console.log("FOUND A MATCH! URL: " + httpEntry.request.url);
          done = true;
          found = true;
          break;
        }
      }
      if (Date.now() - start > timeout) {
        // Took too long bail
        console.log('NEVER FOUND A MATCH FOR REQUEST URL: ' + requestUrlMatch);
        done = true;
      }
      if (!done) {
        synchronousWait(200);
      }
    }
    console.log('hello');
  });

  console.log('END COMMAND');
  

  if (typeof callback === 'function') {
    callback.call(this);
  }

  return this;
}