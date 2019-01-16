exports.command = function(callback) {
  if (!this.proxy) {
    console.error('No proxy setup - did you call setupProxy() ?');
  }
  this.perform(function(done) {
    this.proxy.createHAR(this.proxyPort, { captureContent: 'True', captureHeaders: 'True', initialPageRef: 'foo' }, function() {
      done();
    });
  });
  if (typeof callback === 'function') {
    callback.call(this);
  }

  return this;
};