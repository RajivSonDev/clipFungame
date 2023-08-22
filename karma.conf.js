// Karma configuration
// Generated on Sat Aug 19 2023 15:01:59 GMT+0200 (Central European Summer Time)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://www.npmjs.com/search?q=keywords:karma-adapter
    frameworks: ['jasmine','@angular-devkit/build-angular'],

    plugin:[
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client:{
      jasmine: {

      },
      clearContext:false
    },
    jasmineHtmlReporter:{
      suppressAll:true
    },
    coverageReporter:{
      dir:require('path').join(__dirname,'./coverage/clips'),
      subdir:'.',
      reporters:[
        {type:'html'},
        {type:'text-summary'}
      ]
    },
    reporters:['progress','kjhtml'],
    port:9876,
    colors:true,
    logLevel:config.LOG_INFO,
    autoWatch:true,
    browsers:['Chrome'],
    singleRun:false,
    restartOnFileChange:true
  });
};
