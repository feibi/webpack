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
  // var minimist = require('minimist');
  var clean = require('gulp-clean');
  var gulpSequence = require('gulp-sequence');
  var WebpackDevServer = require("webpack-dev-server");
  var webpackServerConfig = require("./webpack.server.js");
  var webpackConfig = require("./webpack.config.js");


  var enviroment = false; //默认false为开发环境，true为生产环境

  // var knownOptions = {
  //     string: 'env',
  //     default: {
  //         env: process.env.NODE_ENV || 'production'
  //     }
  // };
  // var options = minimist(process.argv.slice(2), knownOptions);





  gulp.task('html', function() {
      return gulp.src("./app/**/*.html")
          .pipe(gulp.dest('./build'))
          .pipe(gulpif(enviroment, minifyHtml({
              removeComments: true, //清除HTML注释
              collapseWhitespace: true, //压缩HTML
          })))
          .pipe(gulpif(enviroment, gulp.dest('./dist')));
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
          .pipe(gulpif(enviroment, gulp.dest('./dist/css')));
  });

  gulp.task('compile', ['html', 'css'], function() {

  });

  gulp.task('watch', ['compile'], function() {
      gulp.watch("./app/**/*.html", ['html']);
      gulp.watch("./app/sass/*.scss", ['css']);
  });

  gulp.task('clean', function() {
      return gulp.src(['build', 'dist'], {
              read: false
          })
          .pipe(clean({
              force: true
          }));
  });




  //------------------------开发环境执行命令  development--------------------------

  gulp.task('dev', function() {
      enviroment = false;
      gulp.run(["compile:dev"]);
  });

  gulp.task('compile:dev', gulpSequence('clean', 'watch', 'webpack-dev-server'));

  gulp.task('webpack-dev-server', function(callback) {
      var myConfig = Object.create(webpackConfig);
      myConfig.devtool = "sourcemap";
      myConfig.debug = true;

      // Start a webpack-dev-server
      new WebpackDevServer(webpack(myConfig), {
          // publicPath: "/" + myConfig.output.publicPath,
          contentBase: "./build/",
          proxy: {
                '/personal*': {
                   target: 'http://dev.personal.tunnel.yujiangongyu.com',
                    secure: false,
                    changeOrigin: true
                   /* headers:{uid:"5579518dcaa8219c3a8b4568","ddd":"hhhhhhhhh"}*/
                },
        },
        stats: {
            colors: true
        }
      }).listen(8080, "localhost", function(err) {
          if (err) throw new gutil.PluginError("webpack-dev-server", err);
          gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html");
      });
  });





  // --------------------------生产打包  Production build---------------------------

  gulp.task("build", function() {
      enviroment = true;
      gulp.run(["compile:build"]);
  });

  gulp.task('compile:build', gulpSequence('clean', 'compile', 'webpack:build'));

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
          if (err) throw new gutil.PluginError("webpack:build", err);
          gutil.log("[webpack:build]", stats.toString({
              colors: true
          }));
          callback();
      });
  });
