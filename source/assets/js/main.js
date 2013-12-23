require.config({
    paths: {
        jquery: '../libs/jquery/jquery',
        onepageScroll: '../libs/onepage-scroll/jquery.onepage-scroll',
        image: '../libs/requirejs-plugins/src/image'
    },

    shim: {
       'onepageScroll': {
           deps: ['jquery'],
           exports: 'onepageScroll'
       }
    }
});


require(['jquery','init'], function ($,init) {
    'use strict';
    $('html').removeClass('no-js');
    $(init);
});
