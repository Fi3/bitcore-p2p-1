'use strict';

if (typeof window === 'undefined'){
  var Peer = require('./peerNode');
}
else {
  var Pool = require('./peerBrowser');
}

module.exports = Peer;
