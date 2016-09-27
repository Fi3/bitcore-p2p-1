'use strict';

if (typeof window === 'undefined'){
  var Pool = require('./poolNode');
}
else {
  var Pool = require('./poolBrowser');
}

module.exports = Pool;
