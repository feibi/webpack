  var gulp = require('gulp');
  var gutil = require("gulp-util");
  var webpack = require("webpack");
  var plumber = require("gulp-plumber");
  var sass = require('gulp-sass');
  var postcss = require('gulp-postcss');
  var autoprefixer = require('autoprefixer'); //为CSS补全浏览器前缀
  var cssgrace = require('cssgrace'); //让CSS兼容旧版IE
  var minifyHtml = require("gulp-htmlmin");
  var gulpif = require('gulp-if');
  var WebpackDevServer = require("webpack-dev-server");
  var webpackServerConfig = require("./webpack.server.js");
  var webpackConfig = require("./webpack.config.js");


  var condition = function(type) {
      if (type == 'dev') {
          return false
      }
      if (type == 'prod') {
          return true
      }
  }


//开发环境执行命令  development
  gulp.task('dev', ['compile', 'webpack-dev-server'], function() {

      gulp.watch(["webpack-dev-server"]);
  });

  gulp.task('webpack-dev-server', function(callback) {
      var myConfig = Object.create(webpackConfig);
      myConfig.devtool = "sourcemap";
      myConfig.debug = true;

      // Start a webpack-dev-server
      new WebpackDevServer(webpack(myConfig), {
          // publicPath: "/" + myConfig.output.publicPath,
          contentBase: "./build/",
          stats: {
              colors: true
          }
      }).listen(3000, "localhost", function(err) {
          if (err) throw new gutil.PluginError("webpack-dev-server", err);
          gutil.log("[webpack-dev-server]", "http://localhost:3000/webpack-dev-server/index.html");
      });
  })


  // Production build
  gulp.task("build", ["html","webpack:build"]);

  gulp.task("webpack:build", function(callback) {
  	// modify some webpack config options
  	var myConfig = Object.create(webpackServerConfig);
  	myConfig.plugins = myConfig.plugins.concat(
  		new webpack.DefinePlugin({
  			"process.env": {
  				// This has effect on the react lib size
  				"NODE_ENV": JSON.stringify("production")
  			}
  		}),
  		new webpack.optimize.DedupePlugin(),
  		new webpack.optimize.UglifyJsPlugin()
  	);

  	// run webpack
  	webpack(myConfig, function(err, stats) {
  		if(err) throw new gutil.PluginError("webpack:build", err);
  		gutil.log("[webpack:build]", stats.toString({
  			colors: true
  		}));
  		callback();
  	});
  });





  gulp.task('html', function() {
      return gulp.src("./app/**/*.html")
          .pipe(gulp.dest('./build'))
          .pipe(minifyHtml({
              removeComments: true, //清除HTML注释
              collapseWhitespace: false, //压缩HTML
          }))
          .pipe(gulp.dest('./dist'));
  });

  gulp.task('css', function() {
      var processors = [
          autoprefixer({
              browsers: ['last 3 version', 'Android >= 4.0'],
              cascade: true, //美化属性值
              remove: true //去掉不必要的前缀
          }),
          cssgrace //让CSS兼容旧版IE
      ];
      return gulp.src('./app/sass/*.scss')
          .pipe(plumber({
              errorHandler: function(err) {
                  console.log(err);
                  this.emit('end');
              }
          }))
          .pipe(sass().on('error', sass.logError))
          .pipe(postcss(processors))
          .pipe(gulp.dest('./build/css'))
          // .pipe(gulp.dest('./dist/css'));
  });

  gulp.task('compile', ['html', 'css'], function() {
      gulp.watch("./app/**/*.html", ['html']);
      gulp.watch("./app/sass/*.scss", ['css']);
  })

  // gulp.task('build',function(){
  //
  // });
