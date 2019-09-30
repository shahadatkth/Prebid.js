import * as utils from '../src/utils';
import {registerBidder} from '../src/adapters/bidderFactory';
const BIDDER_CODE = 'pof';
let startTimestamp = 0;

export const spec = {
  code: BIDDER_CODE,
  aliases: ['pof'], // short code
  isBidRequestValid: function(bid) {
    if (bid.bidder === 'pof' && typeof bid.params !== 'undefined' && typeof bid.params.adServerURI !== 'undefined' && bid.params.adServerURI !== '' && bid.params.pofSlotID !== 0) {
      return true;
    } else {
      return false;
    }
  },
  buildRequests: function(bidRequests, bidderRequest) {
    startTimestamp = _getTimeStampInMS();
    // For each bid we want to get an ad and append it to data.placements
    let bids = bidRequests || [];
    let adServerURI = '';
    let pofBids = {};
    let pofSlotIDs = [];
    for (let i = 0; i < bids.length; i++) {
      let bid = bids[i];
      // This bid is meant for the pofBidAdapter (actually this is true for all bids that make it here) and there is an adServerURI defined
      adServerURI = bid.params.adServerURI; // + '&bidId=' + bid.bidId;
      pofBids['' + bid.params.pofSlotID] = bid;
      pofSlotIDs.push(bid.params.pofSlotID);
    }
    adServerURI = adServerURI + '&slots=' + pofSlotIDs.join('|');

    return {
      method: 'POST',
      url: adServerURI,
      data: pofBids
    };
  },
  interpretResponse: function(serverResponse, pofBids) {
    let timeNow = _getTimeStampInMS();
    let timeToFetch = Math.round((timeNow - startTimestamp) * 100) / 100;
    utils.logInfo('PofBidAdapter: Response from Ad Server returned in ' + timeToFetch + 'ms');

    const bidResponses = [];
    try {
      // Read in the JSON response from the POF Ad Server
      var pofServerBids = pofBids.data;

      for (let pofSlotID in pofServerBids) {
        let bid = pofServerBids[pofSlotID];
        let response = serverResponse.body[pofSlotID];

        if (response.cpm > 0 && response.html) {
          let bidResponse = {
            requestId: bid.bidId,
            cpm: response.cpm,
            width: response.width,
            height: response.height,
            ad: response.html,
            ttl: 360,
            creativeId: bid.bidder,
            netRevenue: true,
            currency: 'USD'
          }
          bidResponses.push(bidResponse);
        }
      }
      utils.logInfo('PofBidAdapter bidResponses: ', bidResponses);
      let timeNow = _getTimeStampInMS();
      let timeToFetch = Math.round((timeNow - startTimestamp) * 100) / 100;
      utils.logInfo('PofBidAdapter: Finished Bid Responses in ' + timeToFetch + 'ms');

      return bidResponses;
    } catch (error) {
      utils.logInfo('PofBidAdapter: error in response', error);
      _bidFailed(pofServerBids);
      utils.logError(error);
    }
  },
  getUserSyncs: function(syncOptions) {
    if (syncOptions.iframeEnabled) {
      return [{
        type: 'iframe',
        url: '//acdn.adnxs.com/ib/static/usersync/v3/async_usersync.html'
      }];
    }
  },
  onTimeout: function(timeoutData) {
    utils.logInfo('PofBidAdapter timed out: ', timeoutData);
  }
}

function _getTimeStampInMS() {
  return window.performance && window.performance.now && window.performance.timing && window.performance.timing.navigationStart ? window.performance.now() + window.performance.timing.navigationStart : Date.now();
}

registerBidder(spec);
