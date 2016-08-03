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
        loader: [{
            test: /\.js?$/,
            loader: "babel",
            exclude: /(node_modules)/,
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
            // "zepto": path.join(PATHS.libsPath, "/zepto/zepto.js")
        },
        // extensions: ['', '.js', '.css', '.scss', '.ejs', '.png', '.jpg']
    },
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
        // devServer: {
        //     hot: true,
        //     inline: true,
        //     host: "localhost", //10.188.10.29 localhost
        //     port: 3000,
        //     contentBase: "./build/",
        //     //其实很简单的，只要配置这个参数就可以了  55306ad76803fa53168b458b 555f1d3bcaa821e80e8b456a
        // },
}
