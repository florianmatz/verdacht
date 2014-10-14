define([
  'jquery',
  'onepageScroll',
  'underscore'
  ], function($, PageScroller,_){

    /**
     * Controls and extends the onepage-plugin
     * @class  PageScroller
     */
    PageScroller = function() {
      this.$el = $('.main');
      this.$logoFlag = $('.logo-flag');
      this.$window = $(window);
      this.$html = $('html');
      this.$body = $('body');
      this.$sections = $('.main').find('section');
      this.$ribbon = $('#awwwards');
      this.init();
    };

    /**
     * Initalizing Method
     * @method init
     */
    PageScroller.prototype.init = function(){
      //init Plugin
      this.$el.onepage_scroll({
        sectionContainer  : 'section',
        easing            : 'ease',
        animationTime     : 1000,
        pagination        : true,
        updateURL         : false,
        responsiveFallback: 992,
        afterMove         : $.proxy(this.showLogoFlag, this)
      });
      this.addListeners();
      this.watchResize();
    };

    /**
     * Adds the necessary listeners
     * @method addListeners
     */
    PageScroller.prototype.addListeners = function() {

      this.$ribbon.addClass('in');
      this.$el.addClass('show');
      $('.loader-page').removeClass('show');

      var self = this;

      // watch resize to handle height issues
      this.$window.on('resize', _.throttle($.proxy(this.watchResize, this), 150 ) );

      // watch scrollEvents to control the logo-flag
      $(document).on('mousewheel DOMMouseScroll', $.proxy( this.onScroll, this ));

      // watch keyEvents to control the logo-flag
      $(document).on('keydown', $.proxy( this.onKeydown, this));

      // watch the listen button on the start screen for clicks
      $('.listen').on('click', $.proxy(function(evt){
        if(!this.$body.hasClass('disabled-onepage-scroll')) {
          evt.preventDefault();
          this.$el.moveTo(2);
        }
      }, this ) );

    };

    /**
     * Checks scrolling to hide the logo flag
     * @method onScroll
     * @param  {scrollEvent} evt ScrollEvent
     */
    PageScroller.prototype.onScroll = function(evt) {
      var delta = evt.originalEvent.wheelDelta || -evt.originalEvent.detail;
      if(delta > 0 && this.$el.find('section.active').index() === 0 ) {
        this.$logoFlag.removeClass('show');
      }
    };

    /**
     * Checks keydown to hide or show the logo flag
     * @method onKeydown
     * @param  {keyEvent} evt KeyEvent
     */
    PageScroller.prototype.onKeydown = function(evt) {

      if(!this.$body.hasClass('disabled-onepage-scroll')) {
        if(evt.which === 38 && this.$el.find('section.active').index() === 0) {
          this.$logoFlag.removeClass('show');
        }else if(evt.which === 40) {
          this.$logoFlag.addClass('show');
        }
      }

    };

    /**
     * Shows the logo flag, called when next page is shown
     * @method showLogoFlag
     */
    PageScroller.prototype.showLogoFlag = function() {
      var $sectionActive = this.$el.find('section.active');
      if($sectionActive.index() > 0) {
        this.$logoFlag.addClass('show');
      }
    };

    /**
     * Checks, if the height of the containers are smaller as the available viewport
     * and, removes the plugin when necessary, adds it again, when possible
     * @method watchResize
     */
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
        this.$sections.addClass('needed-resize');
        this.$html.addClass('show-overflow');
      }else {
        this.$el.unresponsive();
        this.$sections.removeClass('needed-resize');
        this.$html.removeClass('show-overflow');
      }

    };

    return PageScroller;

  });