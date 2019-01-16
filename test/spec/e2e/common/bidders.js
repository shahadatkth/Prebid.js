adequant = {
  bidder: 'adequant',
  params: {
    publisher_id: '5000563',  // REQUIRED int or str publisher ID. To get one, register at https://control.adequant.com
    bidfloor: 0.01        // OPTIONAL float bid floor in $ CPM
  }
};
adform = {
  bidder: 'adform',
  // available params: [ 'mid', 'inv', 'pdom', 'mname', 'mkw', 'mkv', 'cat', 'bcat', 'bcatrt', 'adv', 'advt', 'cntr', 'cntrt', 'maxp', 'minp', 'sminp', 'w', 'h', 'pb', 'pos', 'cturl', 'iturl', 'cttype', 'hidedomain', 'cdims', 'test' ]
  params: {
    adxDomain: 'adx.adform.net', //optional
    mid: 74042,
    test: 1
  }
};
aol = {
  bidder: 'aol',
  params: {
    network: '10077.1',
    placement: 3671670
  }
};
appnexus = {
  bidder: 'appnexus',
  params: {
    placementId: '4799418',
    dealId: 'some deal!'
  }
};
ix = {
  bidder: 'ix',
  params: {
    id: '1',
    siteID: 123456,
    timeout: 10000
  }
};
openx = {
  bidder: 'openx',
  params: {
    jstag_url: 'http://ox-d.spanishdict.servedbyopenx.com/w/1.0/jstag?nc=1027916-SpanishDict',
    unit: 538004827
  }
};
pubmatic = {
  bidder: 'pubmatic',
  params: {
    publisherId: 39741,
    adSlot: '39620189@300x250'
  }
};
pulsepoint = {
  bidder: 'pulsepoint',
  params: {
    cf: '300X250',
    cp: 521732,
    ct: 76835
  }
};
rubicon = {
  bidder: "rubicon",
  params: {
    accountId: 1001,
    siteId: 113932,
    zoneId: 535510
  }
};
sonobi = {
  bidder: 'sonobi',
  params: {
    ad_unit: '/7780971/sparks_prebid_MR',
    dom_id: 'div-gpt-ad-1462372786781-1'
  }
};
sovrn = {
  bidder: 'sovrn',
  params: {
    tagid: "315045"
  }
};
springserve = {
  bidder: 'springserve',
  params: {
    impId: 1234,
    supplyPartnerId: 1,
    test: true // only include when testing
  }
};
triplelift = {
  bidder: 'triplelift',
  params: {
    inventoryCode: 'headerbidding_placement'
  }
};
yieldbot = {
  bidder: 'yieldbot',
  params: {
    psn: '1234',
    slot: 'medrec'
  }
};
nginad = {
  bidder: 'nginad',
  params: {
    pzoneid: '7', // <String> PublisherAdZoneID
    nginadDomain: "server.nginad.com" // the domain where you installed NginAd
  }
};
brightcom = {
  bidder: 'brightcom',
  params: {
    tagId: 16577 // Tag ID supplied by Brightcom - brightcom.com
  }
};
sekindo = {
  bidder: 'sekindo',
  params: {
    spaceId: 14071,
    bidfloor: 0.2
  }
};
kruxlink = {
  bidder: 'kruxlink',
  params: {
    impid: 36
  }
};
almedia = {
  bidder: 'admedia',
  params: {
    aid: '1234'
  }
};