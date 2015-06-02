'use strict';

var entryPoints = [
  './src/app.js'
];

var getChunkFromEntryPoint = function(entryPoint) {
  return entryPoint.split('/').pop().replace('.js', '');
};

var getEntryFromEntryPoints = function() {
  var entry = {};

  entryPoints.forEach(function(entryPoint) {
    var chunk = getChunkFromEntryPoint(entryPoint);

    entry[chunk] = [entryPoint];
  });

  return entry;
};

var chunksFromEntryPoints = entryPoints.map(function(entryPoint) {
  return getChunkFromEntryPoint(entryPoint);
});

module.exports = {
  entry: getEntryFromEntryPoints(),
  points: entryPoints,
  chunks: chunksFromEntryPoints
};
