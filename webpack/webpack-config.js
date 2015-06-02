var path              = require('path');
var webpack           = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var cssnext           = require('cssnext');

var serverConfig = require('../server/server-config');
var entryPoints  = require('./entry-points');

var ENV  = 'development';
var SYNC = false;

var isDevelopment = function() {
  return ENV === 'development';
};

var isSync = function() {
  return SYNC;
};

var getEntry = function() {
  var entry = entryPoints.entry;

  if (isDevelopment()) {
    for (var key in entry) {
      if (entry.hasOwnProperty(key)) {
        entry[key].unshift(
          'webpack-dev-server/client?http://localhost:' + serverConfig.webpackPort,
          'webpack/hot/dev-server'
        );
      }
    }
  }

  return entry;
};

var getAssetName = function(ext) {
  var hash = ext === 'js' ? 'chunkhash' : 'contenthash';
  var name = isDevelopment() ? '[name].build.' : '[name].build.[' + hash + '].';
  return name + ext;
};

var getPlugins = function() {
  var plugins = [];
  var chunks  = entryPoints.chunks;

  chunks.forEach(function(chunk) {
    var htmlWebpackPlugin = new HtmlWebpackPlugin({
      template: './src/index.html',
      chunks: ['commons', chunk],
      filename: chunk + '.index.html'
    });

    plugins.push(htmlWebpackPlugin);
  });

  var extractTextPlugin  = new ExtractTextPlugin(getAssetName('css'));
  var dedupePlugin       = new webpack.optimize.DedupePlugin();
  var commonsChunkPlugin = new webpack.optimize.CommonsChunkPlugin({
    name: 'commons',
    chunks: chunks
  });

  plugins.push(
    extractTextPlugin,
    dedupePlugin,
    commonsChunkPlugin
  );

  if (isDevelopment()) {
    var hotModuleReplacementPlugin = new webpack.HotModuleReplacementPlugin();
    var noErrorsPlugin             = new webpack.NoErrorsPlugin();

    plugins.push(hotModuleReplacementPlugin, noErrorsPlugin);
  } else {
    var uglifyPlugin = new webpack.optimize.UglifyJsPlugin();

    plugins.push(uglifyPlugin);
  }

  return plugins;
};

var getJSLoader = function() {
  var loaders = ['babel-loader'];

  if (isDevelopment() && isSync()) {

  }

  return loaders.join('!');
};

var getCSSLoader = function() {
  var loaders = ['css-loader', 'postcss-loader'];

  if (isDevelopment() && isSync()) {
    loaders.unshift('style-loader');

    return loaders.join('!');
  } else {
    return ExtractTextPlugin.extract(loaders.join('!'));
  }
};

module.exports = {
  get: function(options) {

    if (options && options.env) {
      ENV = options.env;
    }

    if (options && typeof options.sync === 'boolean') {
      SYNC = options.sync;
    }

    return {
      entry: getEntry(),

      resolve: {
        modulesDirectories: ['node_modules', 'src']
      },

      module: {
        loaders: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: getJSLoader()
          },
          {
            test: /\.css$/,
            loader: getCSSLoader()
          },
          {
            test: /\.(woff|jpe?g|png|gif|svg)$/,
            loader: "url-loader?limit=100000"
          },
          {
            test: /\.(woff|jpe?g|png|gif|svg)\?only-url$/,
            loader: "file-loader"
          }
        ]
      },

      postcss: [
        cssnext({
          import: {
            path: ['src']
          }
        })
      ],

      devtool: isDevelopment() ? 'eval' : '',

      output: {
        path: path.resolve('./build'),
        filename: getAssetName('js'),
        publicPath: isDevelopment() && isSync() ? 'http://localhost:' + serverConfig.webpackPort + serverConfig.assetsPath : serverConfig.assetsPath
      },

      plugins: getPlugins()
    };
  }
};
