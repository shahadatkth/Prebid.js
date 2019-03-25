var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
path = require('path');

var host = 'http://frpp-web9000.las1.fanops.net/prebid/'

var files = {
  "1001.js": "1001-7.js",
  "14062.js": "14062-7.js",
  "1001-HPv2-Display.js": "1001-HPv2-Display-7.js",
  "12212_EL_prod.js": "12212_EL_prod-7.js",
  "12212_ON_prod.js": "12212_ON_prod-6.js",
  "12494_tokubai.js": "12494_tokubai-13.js",
  "18214_general_prod.js": "18214_general_prod-5.js",
  "10306.js": "10306-4.js",
  "19576_general_prod.js": "19576_general_prod-5.js",
  "18866_v2_prod.js": "18866_v2_prod-7.js",
  "19178_wear_prod.js": "19178_wear_prod-5.js",
  "10077_prod.js": "10077_prod-4.js",
  "19434_natalie_prod.js": "19434_natalie_prod-7.js",
  "19632_general_prod.js": "19632_general_prod-5.js",
  "19722_twinavi_prod.js": "19722_twinavi_prod-5.js",
  "10306_teads_test.js": "10306_teads_test-4.js",
  "12212_EL_test.js": "12212_EL_test-7.js",
  "12212_ON_test.js": "12212_ON_test-7.js",
  "19722_citrus_prod.js": "19722_citrus_prod-5.js",
  "18866_v2_test.js": "18866_v2_test-6.js",
  "10306_test.js": "10306_test-13.js",
  "12154_kmag_prod.js": "12154_kmag_prod-4.js",
  "19434_natalie_test.js": "19434_natalie_test-6.js",
  "15932_HC_prod.js": "15932_HC_prod-5.js",
  "12272_sweeps.js": "12272_sweeps-4.js",
  "12272_sweeps_test.js": "12272_sweeps_test-13.js",
  "9607_pb.js": "9607_pb-4.js",
  "11964_prod.js": "11964_prod-6.js",
  "12354_general_prod.js": "12354_general_prod-5.js",
  "13748_general_prod.js": "13748_general_prod-5.js",
  "12354_general_test.js": "12354_general_test-5.js",
  "19178_wear_test.js": "19178_wear_test-7.js",
  "12040_prod.js": "12040_prod-10.js",
  "11990_v2.js": "11990_v2-4.js",
  "16934_prod.js": "16934_prod-5.js",
  "18214_general_test.js": "18214_general_test-5.js",
  "12162_jprime_prod.js": "12162_jprime_prod-5.js",
  "12272_fpedl.js": "12272_fpedl-6.js",
  "12354_pc_prod.js": "12354_pc_prod-6.js",
  "12354_sp_prod.js": "12354_sp_prod-6.js",
  "10306_appclient.js": "10306_appclient-4.js",
  "12272_lotto.js": "12272_lotto-6.js",
  "12272_keno.js": "12272_keno-6.js",
  "12272_restOfPch.js": "12272_restOfPch-6.js",
  "10306_markets.js": "10306_markets-7.js",
  "11834_prod.js": "11834_prod-4.js",
  "10306_lanes.js": "10306_lanes-4.js",
  "12272_lotto_test.js": "12272_lotto_test-15.js",
  "19632_general_test.js": "19632_general_test-5.js",
  "19890_general_prod.js": "19890_general_prod-5.js",
  "12272_keno_test.js": "12272_keno_test-10.js",
  "12272_restOfPch_test.js": "12272_restOfPch_test-9.js",
  "12272_fpedl_test.js": "12272_fpedl_test-14.js",
  "12154_kmag_test.js": "12154_kmag_test-6.js",
  "16934_dm_prod.js": "16934_dm_prod-5.js",
  "19722_citrus_test.js": "19722_citrus_test-5.js",
  "12494_TRN_prod.js": "12494_TRN_prod-6.js",
  "16434_general_prod.js": "16434_general_prod-6.js",
  "12028_general_prod.js": "12028_general_prod-5.js",
  "12354_pc_test.js": "12354_pc_test-6.js",
  "12354_sp_test.js": "12354_sp_test-6.js",
  "11166.js": "11166-24.js",
  "20344_general_prod.js": "20344_general_prod-5.js",
  "19576_pc_prod.js": "19576_pc_prod-4.js",
  "19576_sp_prod.js": "19576_sp_prod-4.js",
  "autotrader_dm_test.js": "autotrader_dm_test-4.js",
  "19704_RSJ.js": "19704_RSJ-4.js",
  "13640_BoomUpWiki.js": "13640_BoomUpWiki-4.js",
  "99999_test_test.js": "99999_test_test-3.js",
  "99999_test2_test.js": "99999_test2_test-3.js",
  "19864_JTO.js": "19864_JTO-5.js",
  "19924_byoinnavi.js": "19924_byoinnavi-2.js",
  "19924_eknavi.js": "19924_eknavi-4.js",
  "11166_general_test.js": "11166_general_test-7.js",
  "1001_AlexWrapperAwesome_test.js": "1001_AlexWrapperAwesome_test-3.js",
  "1001_AlexWrapperAwesome.js": "1001_AlexWrapperAwesome-3.js",
  "ccs_connection_test_autotrader.js": "ccs_connection_test_autotrader-3.js",
  "8059_blah_test.js": "8059_blah_test-3.js",
  "ATtesting.js": "ATtesting-3.js",
  "99999_general_test.js": "99999_general_test-3.js",
  "999998_general_test.js": "999998_general_test-1.js",
  "9898998_general_test.js": "9898998_general_test-3.js",
  "97979797_general_test.js": "97979797_general_test-3.js",
  "96969696_general_test.js": "96969696_general_test-3.js",
  "90909090_general_test.js": "90909090_general_test-3.js",
  "95959595_general_test.js": "95959595_general_test-3.js",
  "1001_Coolio_test.js": "1001_Coolio_test-10.js",
  "1001_Coolio.js": "1001_Coolio-5.js",
  "1001_asf_test.js": "1001_asf_test-4.js",
  "1001_asf.js": "1001_asf-4.js",
  "1001_general_test.js": "1001_general_test-4.js"
};

function account_from_file_name(filename) {
  const name_slices = path.parse(filename).name.split('-');
  return path.parse(filename).name.split('-').slice(0, name_slices.length - 1).join('-');
}

var expectedVersion = '2.6.0';

var versionRegex = /\/* prebid.js v(\d+\.\d+\.\d+[-pre]*)/;

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
