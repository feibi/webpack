var webpack = require("webpack");
var HtmlWebpackPlugin = require('html-webpack-plugin');

var path = require("path"),process = require("process");

var minSize = {
  minChunkSize: 51200,
  compress: {
    warnings: false
  }
};

var PATHS = {
  libsPath:path.resolve(process.cwd(),"./app/common")
}

module.exports = {
  entry: {
    app:"./app/modular/ctrl/ctrl.js",
   /* vendor:["zepto","iscroll","util","common"]*/
     //common: ["iscroll","zepto","jquery","util","common"],
         /*path.join(PATHS.libsPath, "/iscroll/iscroll-lite.js"),
        path.join(PATHS.libsPath, "/zepto/zepto.js"),
        path.join(PATHS.libsPath, "/util/underscore.js"),
         path.join(PATHS.libsPath, "/util/common.js"),  */

  },
  output: {
    path: __dirname + "/dist",
    filename: "bundle-[chunkhash:8].js",
    chunkFilename: 'build[name]-[chunkhash:8].js'
  },
  module: {
    loaders: [
       {test: /\.js?$/,exclude: /(node_modules)/,loader: 'babel?presets[]=es2015'},
        {test: /\.html?$/, loader: "html"},
        {test: /\.tpl$/,loader: "art-template"},

    ]
  },
  resolve: {
    root: [process.cwd() + '/app', process.cwd() + '/node_modules'],
    alias: {
      // "jquery":path.join(PATHS.libsPath, "/zepto/zepto.js"),
    }
  },
  plugins: [
    /* new CommonsChunkPlugin({
          name: "vendor",
          minChunks: Infinity//1
     }),*/
     new webpack.optimize.MinChunkSizePlugin(minSize),
     new webpack.optimize.LimitChunkCountPlugin({
        maxChunks:50,
        entryChunkMultiplicator:2
     }),
     //new webpack.optimize.CommonsChunkPlugin("common", 'common.js', Infinity),
     new webpack.optimize.UglifyJsPlugin({
        compress: {
           drop_console:true,
           warnings: false
        },
        sourceMap:true
      }),
     new HtmlWebpackPlugin({
        filename: 'index.html',
        template: __dirname + '/dist/index.html',
        inject: 'true'
      }),
       new webpack.DefinePlugin({
        // 全局debug标识
        __DEV__: "debug",
          'process.env.NODE_ENV': '"production"'
    }),


  ]

};

/*[chunkhash:8] -[chunkhash:8]*/
