import { assert } from 'chai';
import CONSTANTS from 'src/constants.json';
import rubiconAnalytics from 'src/adapters/analytics/rubicon';
import adapterManager from '../../../../../src/adaptermanager';

const BID_REQUESTED = CONSTANTS.EVENTS.BID_REQUESTED;
const BID_RESPONSE = CONSTANTS.EVENTS.BID_RESPONSE;

function mockScreenSize(adapter, height, width) {
  adapter.setWindow({
    screen : {
      height: height,
      width: width
    }
  });
}

function mockHostname(adapter, hostname) {
  adapter.setDocument({
    location : {
      hostname: hostname
    }
  });
}

describe("Rubicon Analytics API - \n", () => {

  describe("Tests data format functions", () => {

    var adapter = require("src/adapters/analytics/rubicon").default;

    it("should format latency tier", () => {
      assert.equal(adapter.getLatencyTier(0), '0-100ms');
      assert.equal(adapter.getLatencyTier(99), '0-100ms');
      assert.equal(adapter.getLatencyTier(150), '100-200ms');
      assert.equal(adapter.getLatencyTier(287), '200-300ms');
      assert.equal(adapter.getLatencyTier(301), '300-400ms');
      assert.equal(adapter.getLatencyTier(401), '400-500ms');
      assert.equal(adapter.getLatencyTier(501), '500-600ms');
      assert.equal(adapter.getLatencyTier(601), '600-800ms');
      assert.equal(adapter.getLatencyTier(801), '800-1000ms');
      assert.equal(adapter.getLatencyTier(1111), '1000-1200ms');
      assert.equal(adapter.getLatencyTier(1300), '1200-1500ms');
      assert.equal(adapter.getLatencyTier(1700), '1500-2000ms');
      assert.equal(adapter.getLatencyTier(129800), '2000ms-above');
    });

    it("should format response status", () => {
      assert.equal(adapter.getResponseStatus(0), 'pending');
      assert.equal(adapter.getResponseStatus(1), 'ok');
      assert.equal(adapter.getResponseStatus(2), 'error');
      assert.equal(adapter.getResponseStatus(3), 'timedout');
      assert.equal(adapter.getResponseStatus(123), 'unknown');
      assert.equal(adapter.getResponseStatus(undefined), 'unknown');
    });

    it("should detect device type", () => {
      mockScreenSize(adapter, 568, 320);
      assert.equal(adapter.getDevicePlatform(), 'phone');

      mockScreenSize(adapter, 920, 750);
      assert.equal(adapter.getDevicePlatform(), 'tablet');

      mockScreenSize(adapter, 800, 1280);
      assert.equal(adapter.getDevicePlatform(), 'desktop');
    });
  });

  describe("event format", () => {
    let getAccountIdStub;

    // let extensions = require("src/extensions");
    let adapter   = require("src/adapters/analytics/rubicon").default;

    mockScreenSize(adapter, 800, 1280);
    mockHostname(adapter, 'localhost');

    beforeEach(() => {
      getAccountIdStub = sinon.stub(adapter, "getAccountId", () => {
        return 1234;
      });
    });

    afterEach(function () {
      getAccountIdStub.restore();
    });

    it("should format auction event", () => {
      let data = {
        "bidderCode": "rubicon",
        "requestId": "82d17022-d42d-4479-a576-a0f2d2686b3a",
        "timeout": 3000,
        "bids": [
          {
            "bidder": "rubicon",
            "params": {
              "accountId": "1234",
              "sizes": [15, 57]
            },
            "placementCode": "div-id",
            "sizes": [
              [300,250], [970, 250]
            ],
            "bidId": "115cbdce51eca9e",
            "requestId": "82d17022-d42d-4479-a576-a0f2d2686b3a"
          }
        ]
      };

      let actual   = adapter.formatAuctionEvent(data);
      let expected = 'auction/rubicon/1234/localhost/-/desktop/pbjs-$prebid.version$/div-id/1';

      assert.equal(actual, expected);
    });

    it("should format response event", () => {

      let data = {
        site_id: "1111",
        zone_id: "2222",
        bidderCode: "rubicon",
        adUnitCode: "div-id",
        requestId: "a119f454-f19e-42e0-be61-7d10ef1cde92",
        timeToRespond: 489,
        cpm: 1.2,

        getStatusCode: () => 1,
        getSize: () => '250x300'
      };

      let actual   = adapter.formatResponseEvent(data);
      let expected = 'response/rubicon/1234/localhost/250x300/desktop/pbjs-$prebid.version$/div-id/1111/2222/1/1/0/489/400-500ms/ok/1/1-1.5';

      assert.equal(actual, expected);
    });

  });

  describe("Tests Adapter batch functionality", () => {

    var clock;
    // adapterManager.registerAnalyticsAdapter({adapter: rubiconAnalytics, code: 'rubicon'});
    var rpAnalytics = rubiconAnalytics;
    var trackSpy;
    var getAccountIdSpy;
    var batchTrackEventSpy;
    var sendLogRequestSpy;
    var formatAuctionEventSpy;
    var formatResponseEventSpy;
    var getDomainSpy;

    beforeEach(function () {
      clock = sinon.useFakeTimers();
      trackSpy = sinon.spy(rpAnalytics, "track");
      getDomainSpy = sinon.spy(rpAnalytics, "getDomain");
      getAccountIdSpy = sinon.spy(rpAnalytics, "getAccountId");
      sendLogRequestSpy = sinon.spy(rpAnalytics, "sendLogRequest");
      batchTrackEventSpy = sinon.spy(rpAnalytics, "batchTrackEvent");
      formatAuctionEventSpy = sinon.spy(rpAnalytics, "formatAuctionEvent");
      formatResponseEventSpy = sinon.spy(rpAnalytics, "formatResponseEvent");
    });

    afterEach(function () {
      trackSpy.restore();
      getDomainSpy.restore();
      getAccountIdSpy.restore();
      sendLogRequestSpy.restore();
      batchTrackEventSpy.restore();
      formatAuctionEventSpy.restore();
      formatResponseEventSpy.restore();
      clock.tick(5000);   // makes sure the timeout function is called and the current test requests are cleaned up
      clock.restore();
    });

    const eventType = BID_REQUESTED;
    const args = {
      "bidderCode": "rubicon",
      "requestId": "a119f454-f19e-42e0-be61-7d10ef1cde92",
      "bidderRequestId": "43df0e2669d2b9",
      "bids": [
        {
          "bidder": "rubicon",
          "params": {
            "accountId": "14062",
            "siteId": "70608",
            "zoneId": "335918",
            "userId": "12346",
            "keywords": ["a", "b", "c"],
            "inventory": {},
            "visitor": {},
            "position": "atf",
            "sizes": [2, 55]
          },
          "placementCode": "/19968336/header-bid-tag1",
          "sizes": [
            [728, 90],
            [970, 90]
          ],
          "bidId": "525291dd8baa58",
          "bidderRequestId": "43df0e2669d2b9",
          "requestId": "a119f454-f19e-42e0-be61-7d10ef1cde92",
          "complete": true
        }
      ],
      "start": 1474490574948,
      "timeout": 4000
    };
    const bidResponseEventType = BID_RESPONSE;
    const bidResponseArgs = {
      "bidderCode": "rubicon",
      "width": 728,
      "height": 90,
      "statusMessage": "Bid available",
      "adId": "525291dd8baa58",
      "cpm": 10,
      "ad": "<script type=\"text/javascript\">;(function (rt, fe) { rt.renderCreative(fe, \"/19968336/header-bid-tag1\", \"2\"); }((parent.window.rubicontag || window.top.rubicontag), (document.body || document.documentElement)));</script>",
      "requestId": "a119f454-f19e-42e0-be61-7d10ef1cde92",
      "responseTimestamp": 1474495469936,
      "requestTimestamp": 1474490574948,
      "bidder": "rubicon",
      "adUnitCode": "/19968336/header-bid-tag1",
      "timeToRespond": 489,

      getStatusCode: () => 1,
      getSize: () => '728x90'
    };

    it("THEN calls correct tracking and batch functions", () => {

      rpAnalytics.track({eventType, args});
      rpAnalytics.track({
        eventType: bidResponseEventType,
        args: bidResponseArgs
      });
      // Call track on two events
      sinon.assert.callCount(trackSpy, 2);

      // Call batching twice
      sinon.assert.callCount(batchTrackEventSpy, 2);
    });

    it("THEN should call event request after timeout", () => {

      rpAnalytics.track({eventType, args});
      rpAnalytics.track({
        eventType: bidResponseEventType,
        args: bidResponseArgs
      });
      clock.tick(3010);

      sinon.assert.calledOnce(formatAuctionEventSpy);
      sinon.assert.calledOnce(formatResponseEventSpy);

      // Call response generation functions twice
      sinon.assert.callCount(getAccountIdSpy, 2);
      sinon.assert.callCount(getDomainSpy, 2);

      // Make a single batch request for the two calls
      sinon.assert.calledOnce(sendLogRequestSpy);
    });

  });
});