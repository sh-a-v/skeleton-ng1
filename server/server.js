'use strict';

var _       = require('lodash');
var path    = require('path');
var express = require('express');

var serverConfig = require('./server-config');
var entryPoints  = require('../webpack/entry-points');

var app = express();

app.use(serverConfig.assetsPath, express.static(path.join(__dirname, '../build')));

var routers = [];
var chunks  = entryPoints.chunks;

chunks = _.without(chunks, 'app');
chunks.push('app');
chunks.forEach(function(chunk) {
  var router = express.Router();
  var template = path.join(__dirname, '../build', chunk + '.index.html');
  var url = chunk === 'app' ? '*' : '/' + chunk;

  router.get('*', function(req, res) {
    res.sendFile(template);
  });

  app.use(url, router);
});

app.listen(serverConfig.expressPort, function() {
  console.log('express server run on port ' + serverConfig.expressPort);
});
