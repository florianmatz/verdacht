define([
  'jquery',
  'onepageScroll'
  ], function($, PageScroller, utils){

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

      $(document).on('mousewheel DOMMouseScroll', function(event) {

        var delta = event.originalEvent.wheelDelta || -event.originalEvent.detail;

        if(delta > 0 && self.$el.find('section.active').index() === 0 ) {
          self.$logoFlag.removeClass('show');
        }else {
          self.$logoFlag.addClass('show');
        }

      });

      $(document).on('keydown', function(evt) {
        if(evt.which === 38 && self.$el.find('section.active').index() === 0) {
          self.$logoFlag.removeClass('show');
        }else {
          self.$logoFlag.addClass('show');
        }
      });


    };

    PageScroller.prototype.showLogoFlag = function() {

      var $sectionActive = this.$el.find('section.active');

      if($sectionActive.index() > 0) {
        this.$logoFlag.addClass('show');
      }

    };

    return PageScroller;


  });