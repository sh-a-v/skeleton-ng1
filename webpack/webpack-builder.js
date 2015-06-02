var webpack = require('webpack');

var webpackConfig = require('./webpack-config').get({
  env: process.argv[2]
});

var logError = function(err) {
  console.log('Error:', err);
};

var logStats = function(stats) {
  console.log(stats.toString({
    colors: true
  }));
};

var compiler = webpack(webpackConfig);

compiler.run(function(err, stats) {
  err ? logError(err) : logStats(stats);
});
