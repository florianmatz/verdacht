require.config({

    paths: {
        jquery: '../libs/jquery/jquery',
        onepageScroll: '../libs/onepage-scroll/jquery.onepage-scroll'

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
    $(init);
});
