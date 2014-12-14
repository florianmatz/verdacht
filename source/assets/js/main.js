require.config({

    catchError: true,

    paths: {
        jquery: '../libs/jquery/dist/jquery',
        onepageScroll: '../js/jquery.onepage-scroll',
        image: '../libs/requirejs-plugins/src/image',
        text: '../libs/requirejs-text/text',
        tpl: '../libs/requirejs-tpl/tpl',
        json: '../libs/requirejs-plugins/src/json',
        backbone: '../libs/backbone/backbone',
        underscore: '../libs/underscore/underscore'
    },

    shim: {
       'onepageScroll': {
          deps: ['jquery'],
          exports: 'onepageScroll'
       },
       'underscore': {
          exports: '_'
       },
       'backbone': {
          deps: ['underscore', 'jquery'],
          exports: 'Backbone'
       }
    }
});


require(['jquery','init'], function ($,init) {
    'use strict';
    $(init);
});
