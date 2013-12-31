define([
  'jquery',
  'utils'
  ], function($, utils){

    /**
     * Class that controls the navigation
     * @class NavigationHandler
     */
    NavigationHandler = function() {

      /**
       * @property {jQuery} $el The Navigation itself
       */
      this.$el = $('nav');

      /**
       * @property {jQuery} $menuTrigger The button that triggers the navigation
       */
      this.$menuTrigger = $('.menu-trigger');

      /**
       * @property {jQuery} $body The documents body
       */
      this.$body = $('body');

      /**
       * @property {jQuery} $pagination The bullet point navigation of the onepage-plugin
       */
      this.$pagination = $('.onepage-pagination').find('a');

      /**
       * @property {jQuery} $logoFlag Additional Logo that appears to the right after scrolling
       */
      this.$logoFlag = $('.logo-flag');

      /**
       * @property {jQuery} $main The main Element of the onepage-plugin
       */
      this.$main = $('.main');

      this.init();
    };

    /**
     * Initializing method
     * @method init
     */
    NavigationHandler.prototype.init = function(){
      this.addListeners();
    };

    /**
     * Adds the necessary listeners
     * @method addListeners
     */
    NavigationHandler.prototype.addListeners = function() {
      this.$el.find('ul a').on('click', $.proxy(this.onNavClick, this) );
      this.$menuTrigger.on('click', $.proxy(this.prepareNavigation, this) );
      this.$pagination.on('click', $.proxy(this.removeFlag, this) );
    };

    /**
     * Resets the navigation
     * @method prepareNavigation
     */
    NavigationHandler.prototype.prepareNavigation = function() {
      this.$el.removeClass('reset');
    };

    /**
     * Handles the clicks on the navpoints
     * @method onNavClick
     * @param  {MouseEvent} evt MouseEvent of the navpoints
     */
    NavigationHandler.prototype.onNavClick = function(evt) {
      var $target  = $(evt.currentTarget),
          viewport = utils.getViewport();
      evt.preventDefault();
      this.removeFlag($target);
      if( (viewport==='desktop' || viewport==='lg-desktop') && !this.$body.hasClass('disabled-onepage-scroll') ){
        this.$main.moveTo($target.data('slide'));
      }
      else {
        var scrollTarget = $($target.attr('href')).offset().top;
        // fix chrome bug!
        $('html, body, .wrapper').animate({scrollTop: scrollTarget}, 1000);
      }
      this.$el.addClass('reset');
      window.location.hash = '';
    };

    /**
     * Removes the logo-flag when returning to the first screen
     * @method removeFlag
     * @param  {jQuery} $target The navpoint currently clicked
     */
    NavigationHandler.prototype.removeFlag = function($target) {
      // make function work for pagination dots
      if($target.originalEvent) {
        $target = $($target.currentTarget);
      }
      if($target.parent().index()===0) {
        this.$logoFlag.removeClass('show');
      }
    };

    return NavigationHandler;

  });