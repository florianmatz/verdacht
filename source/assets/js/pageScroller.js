define([
  'jquery',
  'onepageScroll',
  'underscore'
  ], function($, PageScroller,_){

    PageScroller = function() {

      this.$el = $('.main');
      this.$logoFlag = $('.logo-flag');
      this.$window = $(window);
      this.$body = $('body');
      this.$sections = $('.main').find('section');
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
      this.watchResize();
    };

    PageScroller.prototype.addListeners = function() {
      var self = this;
      this.$window.on('resize', _.throttle($.proxy(this.watchResize, this), 150 ) );
      $(document).on('mousewheel DOMMouseScroll', $.proxy( this.onScroll, this ));
      $(document).on('keydown', $.proxy( this.onKeydown, this));
      $('.listen').on('click', $.proxy(function(evt){
        evt.preventDefault();
        this.$el.moveTo(2);
      }, this ) );
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

    PageScroller.prototype.watchResize = function() {

      var self         = this,
          winHeight    = this.$window.height(),
          neededResize = null;

      $.each(this.$sections, function(index, item) {
        var $item = $(item);
        if($item.find('.container').height() > winHeight) {
          neededResize = true;
          return;
        }

      });

      if(neededResize) {
        this.$el.responsive();
        this.$sections.addClass('neededResize');
      }else {
        this.$el.unresponsive();
        this.$sections.removeClass('neededResize');
      }

    };

    return PageScroller;

  });