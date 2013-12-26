require.config({
    paths: {
        jquery: '../libs/jquery/jquery',
        onepageScroll: '../libs/onepage-scroll/jquery.onepage-scroll',
        image: '../libs/requirejs-plugins/src/image',
        underscore: '../libs/underscore/underscore'
    },

    shim: {
       'onepageScroll': {
          deps: ['jquery'],
          exports: 'onepageScroll'
       },
       'underscore': {
          exports: '_'
       }
    }
});


require(['jquery','init'], function ($,init) {
    'use strict';
    $('html').removeClass('no-js');
    $(init);
});
