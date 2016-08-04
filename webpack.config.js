var webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require("path");
var process = require("process");


var PATHS = {
    libsPath: path.resolve(process.cwd(), "./app/common"),
    node_modules: path.resolve(__dirname, 'node_modules')
}


module.exports = {
    entry: {
        app: "./app/modular/ctrl/ctrl.js"
    },
    output: {
        // publicPath: "build/",
        path: path.join(__dirname, "/build"),
        filename: "bundle.js",
        chunkFilename: "[id].chunk.js"
    },
    module: {
        loaders: [{
            test: /\.js?$/,
            loader: "babel",
            exclude: /(node_modules)/,
        }, {
            test: /\.html?$/,
            loader: "html"
        }, {
            test: /\.(jpg|png)$/,
            loader: "url?limit=8192"
        }, {
            test: /\.json$/,
            loader: 'json'
        }, {
            test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
            loader: 'file'
        }, {
            test: /\.tpl$/,
            loader: "art-template"
        }]
    },
    resolve: {
        root: [process.cwd() + '/app', process.cwd() + '/node_modules'],
        alias: {
            "iscroll": path.join(PATHS.libsPath, "/iscroll/iscroll-lite.js"),
            "zepto": path.join(PATHS.libsPath, "/zepto/zepto.js"),
            "underscore": path.join(PATHS.libsPath, "/underscore/underscore.js"),
            'webuploader': path.join(PATHS.libsPath, "/webuploader/webuploader.js"),
            "common": path.join(PATHS.libsPath, "/util/common.js"), //validata.js
            "validata": path.join(PATHS.libsPath, "/validata/validata.js"),
            "iscrollZoom": path.join(PATHS.libsPath, "/iScroll/iscroll-zoom.js"),
            //"iscrollZoom": path.join(PATHS.libsPath, "/iScroll/iscroll-zoom.js"),

        },
        // extensions: ['', '.js', '.css', '.scss', '.ejs', '.png', '.jpg']
    },
    // externals: {
    //     "jquery": "jQuery"
    // }, //页面中已引入，不需要重复打包
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"development"'
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: __dirname + '/build/index.html',
            inject: 'true'
        }),
        /*new CommonsChunkPlugin("common.js")*/
        /* new CommonsChunkPlugin({
              name: "vendor",
              minChunks: Infinity//1
         })*/

    ]
}
