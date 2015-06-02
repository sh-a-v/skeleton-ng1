var webpack          = require('webpack');
var WebpackDevServer = require('webpack-dev-server');

var serverConfig  = require('../server/server-config');
var webpackConfig = require('./webpack-config').get({
  env: 'development',
  sync: true
});

var compiler = webpack(webpackConfig);

var server = new WebpackDevServer(compiler, {
  contentBase: 'http://localhost:' + serverConfig.expressPort,
  publicPath: 'http://localhost:' + serverConfig.webpackPort + serverConfig.assetsPath,

  historyApiFallback: true,
  hot: true,
  delay: 50,
  stats: {
    colors: true
  }
});

server.listen(serverConfig.webpackPort, 'localhost', function(err) {
  setTimeout(function() {
    console.log('Open http://localhost:' + serverConfig.expressPort);
  }, 4000);

  if (err) {
    console.log('error:', err);
  }
});
