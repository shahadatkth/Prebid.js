/**
 * rubicon.js - Rubicon Prebid Analytics Adapter
 */
import { ajax } from 'src/ajax';
import adapter from 'AnalyticsAdapter';
import CONSTANTS from 'src/constants.json';

const utils     = require('../../utils');
const url       = "//estats.aws.rubiconproject.com/v1/s/hbms";

const analyticsType = 'endpoint';
const timeoutLength = 2000;  // FL-734 When batching requests this should be set to a larger number

const BID_REQUESTED  = CONSTANTS.EVENTS.BID_REQUESTED;
const BID_RESPONSE   = CONSTANTS.EVENTS.BID_RESPONSE;
const BID_WON        = CONSTANTS.EVENTS.BID_WON;
const DEVICE_DESKTOP = 'desktop';
const DEVICE_TABLET  = 'tablet';
const DEVICE_PHONE   = 'phone';

function fmt(str) {
  return "RP-prebid-analytics: " + str;
}

var baseAdapter = adapter({
  url,
  analyticsType
});

export default Object.assign({}, baseAdapter,
  {
    // store a window object
    _window : false,

    // store a document object
    _document : false,

    // store domain name
    _domain : false,

    // these two must be passed as options
    _accountId: null,
    _sampleRate: 1,

    // Save request IDs for matching responses to log unavailable data
    bidderRequests : {},

    // Events array to batch request events.
    events: [],

    // Call back to handle single request batch after 'timeoutLength' time
    eventTrackingCallback: false,

    enableAnalytics: function(config) {
      if(typeof config === 'object' && typeof config.options === 'object' && config.options.accountId) {
        this._accountId = config.options.accountId;
        this._sampleRate = config.options.sampling || this._sampleRate;

        ['getLatencyTier', 'getCpmRange'].forEach(type => {
          if(typeof config.options[type] === 'function') {
            this[type] = config.options[type];
          }
        });

        baseAdapter.enableAnalytics.apply(this, arguments);
      } else {
        utils.logError(fmt('Missing required analytics option, accountId.  Rubicon analytics not enabled.'));
      }
    },

    /**
     * track       Override AnalyticsAdapter functions by supplying custom methods
     *
     * @param trackingParams
     */
    track({eventType, args}) {
      if (eventType !== BID_REQUESTED && eventType !== BID_RESPONSE && eventType !== BID_WON) {
        utils.logInfo(fmt('Untracked Event'), eventType);
      } else {
        this.batchTrackEvent(eventType, args);
        utils.logInfo(fmt('Tracking Event - ' + eventType), args);
      }
    },

    /**
     * @param oBidReq
     *
     * Format example auction/rubicon/1001/prebid.local/300x250/desktop/rppb/test-div
     *
     * @returns {string}
     */
    formatAuctionEvent(oBidReq) {
      let platform    = this.getDevicePlatform();
      let domain      = this.getDomain();
      let accountId   = this.getAccountId();
      let adapterCode = oBidReq.bidderCode;
      let integration = this.getIntegration();
      let requestId   = oBidReq.requestId;
      let bids        = oBidReq.bids;
      let logEntries  = [];
      let sampleRate  = this._sampleRate;

      for (let i = 0; i < bids.length; i++) {
        let dimensions    = '-';
        let oBidResponse = bids[i];
        let adUnitCode   = encodeURIComponent(oBidResponse.placementCode);

        logEntries.push(this.logEntry(
          'auction',
          adapterCode, accountId, domain, dimensions, platform, integration, adUnitCode, sampleRate
        ));
      }

      // Store values needed for response logging by request ID
      this.bidderRequests[requestId] = oBidReq;

      return logEntries.join('|');
    },

    /**
     * @param oBidResponse
     *
     * Format example response/rubicon/1001/prebid.local/300x250/desktop/rppb/test-div/45677/87654/0/1/3000/289/200-300ms/ok/xhr
     *
     * @returns {string}
     */
    formatResponseEvent(oBidResponse) {
      // Get and parse tracking details
      let requestId   = oBidResponse.requestId;
      let bidderRequest = this.bidderRequests[requestId];

      let adUnitCode     = encodeURIComponent(oBidResponse.adUnitCode);
      let statusCode     = oBidResponse.getStatusCode();
      let responseStatus = this.getResponseStatus(statusCode);
      let siteId         = (oBidResponse.rubiconSlotMapping && oBidResponse.rubiconSlotMapping.site_id) || 0;
      let zoneId         = (oBidResponse.rubiconSlotMapping && oBidResponse.rubiconSlotMapping.zone_id) || 0;
      let fitFlag        = (statusCode === 1 ? 1 : 0);
      let latency        = oBidResponse.timeToRespond;
      let latencyTier    = this.getLatencyTier(latency);
      let platform       = this.getDevicePlatform();
      let integration    = this.getIntegration();
      let domain         = this.getDomain();
      let dimensions     = oBidResponse.getSize();
      let adapterCode    = oBidResponse.bidderCode;
      let accountId      = this.getAccountId();
      let timeoutValue   = 0;
      let timedoutFlag   = oBidResponse.timedOut ? 1 : 0;
      let sampleRate     = this._sampleRate;
      let cpm            = oBidResponse.cpm;
      let cpmRange       = this.getCpmRange(cpm);
      let hasDeal        = oBidResponse.dealId ? 1 : 0;

      if (bidderRequest && bidderRequest.timeout) {
        timeoutValue = bidderRequest.timeout;
      }

      return this.logEntry(
        'response', adapterCode, accountId, domain, dimensions, platform, integration, adUnitCode,
        siteId, zoneId, timedoutFlag, fitFlag, timeoutValue, latency, latencyTier, responseStatus, sampleRate,
        cpmRange, hasDeal
      );
    },

    formatRenderEvent(oBidResponse) {
      let adapterCode    = oBidResponse.bidderCode;
      let accountId      = this.getAccountId();
      let domain         = this.getDomain();
      let dimensions     = oBidResponse.getSize();
      let platform       = this.getDevicePlatform();
      let integration    = this.getIntegration();
      let adUnitCode     = encodeURIComponent(oBidResponse.adUnitCode);
      let siteId         = (oBidResponse.rubiconSlotMapping && oBidResponse.rubiconSlotMapping.site_id) || 0;
      let zoneId         = (oBidResponse.rubiconSlotMapping && oBidResponse.rubiconSlotMapping.zone_id) || 0;
      let sampleRate     = this._sampleRate;
      let cpm            = oBidResponse.cpm;
      let hasDeal        = oBidResponse.dealId ? 1 : 0;

      return this.logEntry(
        'render', adapterCode, accountId, domain, dimensions, platform, integration, adUnitCode, siteId, zoneId,
        sampleRate, cpm, hasDeal
      );
    },

    /**
     * Batches tracking of an event
     *
     * @param eventType   {string}    Prebid constant-defined event type
     * @param data        {object}    Event data
     */
    batchTrackEvent(eventType, args) {
      utils.logInfo(fmt(`Add event ${eventType} to batch`));

      let entry = [eventType, args];

      this.events.push(entry);

      // Ignore if the callback is currently set
      if (this.eventTrackingCallback) {
        return;
      }

      utils.logInfo(fmt('Scheduling flush callback in ' + timeoutLength));

      this.eventTrackingCallback = setTimeout(() => {
        utils.logInfo(fmt('Flushing events'));

        let logEvents = [];
        let callbacks = {
          [BID_REQUESTED]: this.formatAuctionEvent,
          [BID_RESPONSE]: this.formatResponseEvent,
          [BID_WON]: this.formatRenderEvent
        };

        this.events.forEach((event) => {
          let [entryType, entryData] = event;

          if (!callbacks.hasOwnProperty(entryType)) {
            utils.logError(fmt(`Invalid event type : ${entryType}`));
          } else {
            logEvents.push(
                callbacks[entryType].apply(this, [entryData])
            );
          }
        });

        this.events = [];

        if (logEvents.length) {
          this.sendLogRequest(logEvents.join('|'));
        }

        // Reset batch params for next batch
        this.eventTrackingCallback = false;

      }, timeoutLength);
    },

    /**
     * Gets the prebid version information
     *
     * @returns {string}
     */
    getIntegration() {
      return 'pbjs-$prebid.version$';
    },

    /**
     * Gets the most root domain that allows a cookie for logging.
     * Browsers will block cookies for all TLDs and some commonly used domains (AWS) by default.
     *
     * @returns {string}
     */
    getDomain() {
      if (this._domain) {
        return this._domain;
      }

      let cookieExpires = ';expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      let cookieName    = 'prebid_get_top_level_domain=cookie';
      let doc           = this.getDocument();
      let location      = doc.location || {};
      let hostname      = location.hostname || '';
      let hostnameParts = hostname.split('.');

      for(let i = hostnameParts.length-1; i >= 0; i--) {
        let entry  = hostnameParts.slice(i).join('.');
        let cookie = cookieName + ';domain=.' + entry + ';';

        doc.cookie = cookie;

        if(doc.cookie.indexOf(cookieName) === -1){
          continue;
        }

        this._domain = entry;
        doc.cookie     = cookieName.split('=')[0] + '=;domain=.' + entry + cookieExpires;

        return this._domain;
      }

      this._domain = 'unknown-domain';

      return this._domain;
    },

    /**
     * getDevicePlatform    gets the device platform by the max height or width
     * @returns {string}
     */
    getDevicePlatform() {
      // Take the highest of the two, in case we are in portrait mode with a phone
      let win      = this.getWindow();
      let height   = win.screen.height || 1025;
      let width    = win.screen.width || 1025;
      let maxWidth = Math.max(height, width);

      // Phones are 736px wide or less (iphone 6 = 667px, 6+ = 736px)
      if (maxWidth <= 736) {
        return DEVICE_PHONE;
      }

      // Tables are 1024 pixels wide or less
      if (maxWidth <= 1024) {
        return DEVICE_TABLET;
      }

      return DEVICE_DESKTOP;
    },

    /**
     * Format response code
     *
     * @returns {string}
     */
    getResponseStatus(code) {
      switch (code) {
        case 0:
          return 'pending';
        case 1:
          return 'ok';
        case 2:
          return 'error';
        case 3:
          return 'timedout';
        default:
          return 'unknown';
      }
    },

    /**
     * Format response code
     *
     * @returns {string}
     */
    getLatencyTier(time) {
      switch (true) {
        case (time < 100):
          return '0-100ms';
        case (time < 200):
          return '100-200ms';
        case (time < 300):
          return '200-300ms';
        case (time < 400):
          return '300-400ms';
        case (time < 500):
          return '400-500ms';
        case (time < 600):
          return '500-600ms';
        case (time < 800):
          return '600-800ms';
        case (time < 1000):
          return '800-1000ms';
        case (time < 1200):
          return '1000-1200ms';
        case (time < 1500):
          return '1200-1500ms';
        case (time < 2000):
          return '1500-2000ms';
        default:
          return '2000ms-above';
      }
    },
      
    getCpmRange(cpm) {
      var range;
      if (cpm >= 0 && cpm < 0.5) {
        range = '0-0.5';
      } else if (cpm >= 0.5 && cpm < 1) {
        range = '0.5-1';
      } else if (cpm >= 1 && cpm < 1.5) {
        range = '1-1.5';
      } else if (cpm >= 1.5 && cpm < 2) {
        range = '1.5-2';
      } else if (cpm >= 2 && cpm < 2.5) {
        range = '2-2.5';
      } else if (cpm >= 2.5 && cpm < 3) {
        range = '2.5-3';
      } else if (cpm >= 3 && cpm < 4) {
        range = '3-4';
      } else if (cpm >= 4 && cpm < 6) {
        range = '4-6';
      } else if (cpm >= 6 && cpm < 8) {
        range = '6-8';
      } else if (cpm >= 8) {
        range = '8 above';
      }
    
      return range;
    },

    /**
     * @param parts
     *
     * @returns {string}
     */
    logEntry(...parts) {
      return parts.join("/");
    },

    /**
     * gets primary rubicon Account Id
     * @returns {boolean}
     */
    getAccountId() {
      return this._accountId;
    },

    /**
     * Callback handling log request response
     *
     * @param result
     * @param event
     */
    callEventsCallback(result, event) {
      // Only 204 allowed. result/event vars filled by ajax logic
      if (result.status === 204 || event.status === 204) {
        return;
      }

      utils.logError(fmt('Call failed: ' + result.status));
    },

    /**
     * Calls ajax for batched events
     *
     * @param payload {string} Request body
     */
    sendLogRequest(payload) {
      var options = {
        method: "POST"
      };

      utils.logInfo(fmt(`Sending log request ${url}`), payload);

      ajax(
        url,
        undefined,
        payload,
        options
      );
    },

    /**
     * @param win {object} window object
     */
    setWindow(win) {
      this._window = win;
    },

    /**
     * @returns {object} the window object
     */
    getWindow() {
      return this._window || window;
    },

    /**
     * @param doc {object} document object
     */
    setDocument(doc) {
      this._document = doc;
    },

    /**
     * @returns {object} the document object
     */
    getDocument() {
      return this._document || document;
    }

  }
);
