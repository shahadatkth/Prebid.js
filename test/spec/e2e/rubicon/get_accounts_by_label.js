var deepAccess = function (obj, path) {
  if (!obj) {
    return;
  }
  path = String(path).split('.');
  for (let i = 0; i < path.length; i++) {
    obj = obj[path[i]];
    if (typeof obj === 'undefined') {
      return;
    }
  }
  return obj;
}

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
path = require('path');

var requestUrl = 'http://cfg-svc.las1.fanops.net/config/api/data/Configuration?query=configurationType==dm_account_config;itemType==account_wrapper_env;itemId==*&version=2'

var request = new XMLHttpRequest();
request.open('GET', requestUrl, false);
request.send(null);




var responseData = JSON.parse(request.responseText);

let labelConfig = {};
responseData['entries'].forEach(function(entry) {
  let label = deepAccess(entry, 'jsonConfiguration.label');
  if (!labelConfig.hasOwnProperty(label)) {
    labelConfig[label] = {'count': 0,"wrappers": []};
  }
  labelConfig[label]['wrappers'].push(entry['itemId'])
  labelConfig[label]['count']++;
})

console.log(JSON.stringify(labelConfig, null, 2));