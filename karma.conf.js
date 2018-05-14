// Karma configuration
// Generated on Wed Mar 28 2018 12:22:49 GMT+0900 (JST)

module.exports = function(config) {
  var webpackConfig = require('./webpack/test.config.js');

  config.set({
    basePath: '',
    frameworks: ['mocha'],
    files: [
        { pattern: './src/*.spec.ts', watched: false },
    ],
    exclude: [],
    preprocessors: {
      './src/*.spec.ts': ['webpack', 'sourcemap'],
    },
    webpack: webpackConfig,
    reporters: ['mocha'],
    mime: {
      'text/x-typescript': ['ts'],
    },
    mochaReporter: {
      output: 'minimal',
      divider: '-',
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['PhantomJS'],
    singleRun: true,
    concurrency: Infinity
  })
}
