define([
  'jquery',
  'onepageScroll'
  ], function($, PageScroller){

    PageScroller = function() {

      this.$el = $('.main');

      this.init();
    };

    PageScroller.prototype.init = function(){

      this.$el.onepage_scroll({
        sectionContainer: 'section',
        easing: 'ease',
        animationTime: 1000,
        pagination: true,
        updateURL: false,
        responsiveFallback: 992,
        afterMove: $.proxy(this.checkSlide, this)
      });

    };

    PageScroller.prototype.checkSlide = function(evt) {


    };

    return PageScroller;


});