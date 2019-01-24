var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
path = require('path');

var host = 'http://frpp-web9000.las1.fanops.net/prebid/'

var files = {
  "12212_EL_prod.js": "12212_EL_prod-6.js",
  "12212_ON_prod.js": "12212_ON_prod-5.js",
  "12494_tokubai.js": "12494_tokubai-3.js",
  "18214_general_prod.js": "18214_general_prod-3.js",
  "10306.js": "10306-12.js",
  "19576_general_prod.js": "19576_general_prod-3.js",
  "18866_v2_test.js": "18866_v2_test-3.js",
  "19178_wear_prod.js": "19178_wear_prod-6.js",
  "10077_prod.js": "10077_prod-4.js",
  "1001.js": "1001-8.js",
  "14062.js": "14062-6.js",
  "1001-HPv2-Display.js": "1001-HPv2-Display-10.js",
  "19434_natalie_prod.js": "19434_natalie_prod-3.js",
  "19632_general_prod.js": "19632_general_prod-5.js",
  "19722_twinavi_prod.js": "19722_twinavi_prod-3.js",
  "12272_video_test.js": "12272_video_test-0.js",
  "10306_teads_test.js": "10306_teads_test-3.js",
  "12212_EL_test.js": "12212_EL_test-4.js",
  "12212_ON_test.js": "12212_ON_test-3.js",
  "19722_citrus_prod.js": "19722_citrus_prod-3.js",
  "18866_v2_prod.js": "18866_v2_prod-3.js",
  "10306_appnexus_test.js": "10306_appnexus_test-6.js",
  "19434_natalie_test.js": "19434_natalie_test-4.js",
  "15932_HC_prod.js": "15932_HC_prod-0.js",
  "12154_kmag_prod.js": "12154_kmag_prod-4.js",
  "10306_test.js": "10306_test-5.js",
  "9607_pb.js": "9607_pb-0.js",
  "11964_prod.js": "11964_prod-6.js",
  "13748_general_prod.js": "13748_general_prod-0.js",
  "12354_general_test.js": "12354_general_test-1.js",
  "12354_general_prod.js": "12354_general_prod-1.js",
  "2002.js": "2002-1.js",
  "19178_wear_test.js": "19178_wear_test-0.js",
  "12040_prod.js": "12040_prod-0.js",
  "12272_sweeps.js": "12272_sweeps-1.js"
};

function account_from_file_name(filename) {
  const name_slices = path.parse(filename).name.split('-');
  return path.parse(filename).name.split('-').slice(0, name_slices.length - 1).join('-');
}

var expectedVersion = '1.37.0';

var versionRegex = /prebid_prebid_(\d+\.\d+\.\d+[-pre]*)/;

var results = {};

var numErrors = 0;
Object.keys(files).forEach(function(file) {
  console.log("\n==========================================================\n");
  console.log("Checking version for " + file);
  requestUrl = host + account_from_file_name(files[file]) + '.js';

  var request = new XMLHttpRequest();
  request.open('GET', requestUrl, false);
  request.send(null);

  var versionFound = request.responseText.match(versionRegex);
  var isMatch = expectedVersion === versionFound[1];

  if (!isMatch) {
    numErrors++;
    console.log('\x1b[31m', "Does not have expected pbjs version: " + expectedVersion + "\nHas Version: " + versionFound[1] + '\033[0m');
  }
});

console.log("==========================================================");
console.log("\n\nDONE CHECKING FILES");
console.log("\nThere were " + numErrors + " errors!\n");
