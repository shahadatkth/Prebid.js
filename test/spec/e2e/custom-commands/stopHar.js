exports.command = function(callback) {
  if (!this.proxy) {
    console.error('No proxy setup - did you call setupProxy() ?');
  }


  console.log('hi #1');
  this
    .perform(function(done) {
      console.log(done);
      console.log('hi #3');
      this.proxy.createHAR(this.proxyPort, { captureContent: 'True', captureHeaders: 'True', initialPageRef: 'foo' }, function() {
        console.log('when is this happening');
        done();
      });
    })
    .pause(5000);
  console.log('hi #2');
  if (typeof callback === 'function') {
    console.log('hi #4');
    callback.call(this);
  }

  return this;
};