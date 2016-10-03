'use strict';

if (typeof window === 'undefined'){
  var Peer = require('./peerNode');
}
else {
  var Peer = require('./peerBrowser');
}

module.exports = Peer;
