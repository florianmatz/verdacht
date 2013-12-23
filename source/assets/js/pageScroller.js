define([
  'jquery',
  'onepageScroll'
  ], function($, PageScroller){

    PageScroller = function() {
      this.$el = $('.main');
      this.$logoFlag = $('.logo-flag');
      this.$window = $(window);
      this.$body = $('body');
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
        afterMove: $.proxy(this.showLogoFlag, this)
      });
      this.addListeners();
    };

    PageScroller.prototype.addListeners = function() {
      var self = this;
      $(document).on('mousewheel DOMMouseScroll', $.proxy( this.onScroll, this ));
      $(document).on('keydown', $.proxy( this.onKeydown, this));
    };

    PageScroller.prototype.onScroll = function(evt) {
      var delta = evt.originalEvent.wheelDelta || -evt.originalEvent.detail;
      if(delta > 0 && this.$el.find('section.active').index() === 0 ) {
        this.$logoFlag.removeClass('show');
      }
    };

    PageScroller.prototype.onKeydown = function(evt) {
      if(evt.which === 38 && this.$el.find('section.active').index() === 0) {
        this.$logoFlag.removeClass('show');
      }else if(evt.which === 40) {
        this.$logoFlag.addClass('show');
      }
    };

    PageScroller.prototype.showLogoFlag = function() {
      var $sectionActive = this.$el.find('section.active');
      if($sectionActive.index() > 0) {
        this.$logoFlag.addClass('show');
      }
    };

    return PageScroller;

  });