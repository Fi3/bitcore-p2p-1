'use strict';

var bitcore = require('bitcore-lib');
var Inventory = require('../inventory');

function builder(options) {
  /* jshint maxstatements: 20 */
  /* jshint maxcomplexity: 10 */

  if (!options) {
    options = {};
  }

  if (!options.network) {
    options.network = bitcore.Networks.defaultNetwork;
  }

  options.Block = options.Block || bitcore.Block;
  options.BlockHeader = options.BlockHeader || bitcore.BlockHeader;
  options.Transaction = options.Transaction || bitcore.Transaction;
  options.MerkleBlock = options.MerkleBlock || bitcore.MerkleBlock;
  options.protocolVersion = options.protocolVersion || 70000;

  var exported = {
    constructors: {
      Block: options.Block,
      BlockHeader: options.BlockHeader,
      Transaction: options.Transaction,
      MerkleBlock: options.MerkleBlock
    },
    defaults: {
      protocolVersion: options.protocolVersion,
      network: options.network
    },
    inventoryCommands: [
      'getdata',
      'inv',
      'notfound'
    ],
    commandsMap: {
      version: 'Version',
      verack: 'VerAck',
      ping: 'Ping',
      pong: 'Pong',
      block: 'Block',
      tx: 'Transaction',
      getdata: 'GetData',
      headers: 'Headers',
      notfound: 'NotFound',
      inv: 'Inventory',
      addr: 'Addresses',
      alert: 'Alert',
      reject: 'Reject',
      merkleblock: 'MerkleBlock',
      filterload: 'FilterLoad',
      filteradd: 'FilterAdd',
      filterclear: 'FilterClear',
      getblocks: 'GetBlocks',
      getheaders: 'GetHeaders',
      mempool: 'MemPool',
      getaddr: 'GetAddr'
    },
    commandsMapBrowserify: {
      version: require('./commands/version.js'),
      verack: require('./commands/verack.js'),
      ping: require('./commands/ping.js'),
      pong: require('./commands/pong.js'),
      block: require('./commands/block.js'),
      tx: require('./commands/tx.js'),
      getdata: require('./commands/getdata.js'),
      headers: require('./commands/headers.js'),
      notfound: require('./commands/notfound.js'),
      inv: require('./commands/inv.js'),
      addr: require('./commands/addr.js'),
      alert: require('./commands/alert.js'),
      reject: require('./commands/reject.js'),
      merkleblock: require('./commands/merkleblock.js'),
      filterload: require('./commands/filterload.js'),
      filteradd: require('./commands/filteradd.js'),
      filterclear: require('./commands/filterclear.js'),
      getblocks: require('./commands/getblocks.js'),
      getheaders: require('./commands/getheaders.js'),
      mempool: require('./commands/mempool.js'),
      getaddr: require('./commands/getaddr.js')
    },

    commands: {}
  };

  exported.add = function(key, Command) {
    exported.commands[key] = function(obj) {
      return new Command(obj, options);
    };

    exported.commands[key]._constructor = Command;

    exported.commands[key].fromBuffer = function(buffer) {
      var message = exported.commands[key]();
      message.setPayload(buffer);
      return message;
    };
  };

  //Object.keys(exported.commandsMap).forEach(function(key) {
  //  exported.add(key, require('./commands/' + key));
  //});
  Object.keys(exported.commandsMapBrowserify).forEach(function(key) {
    exported.add(key, exported.commandsMapBrowserify[key]);
  });

  exported.inventoryCommands.forEach(function(command) {

    // add forTransaction methods
    exported.commands[command].forTransaction = function forTransaction(hash) {
      return new exported.commands[command]([Inventory.forTransaction(hash)]);
    };

    // add forBlock methods
    exported.commands[command].forBlock = function forBlock(hash) {
      return new exported.commands[command]([Inventory.forBlock(hash)]);
    };

    // add forFilteredBlock methods
    exported.commands[command].forFilteredBlock = function forFilteredBlock(hash) {
      return new exported.commands[command]([Inventory.forFilteredBlock(hash)]);
    };

  });

  return exported;

}

module.exports = builder;
