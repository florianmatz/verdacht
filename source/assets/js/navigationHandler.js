define([
  'jquery',
  'utils'
  ], function($, utils){

    NavigationHandler = function() {
      this.$el = $('nav');
      this.$navToggler = $('.menu-trigger');
      this.$body = $('body');
      this.$pagination = $('.onepage-pagination').find('a');
      this.$logoFlag = $('.logo-flag');
      this.$main = $('.main');
      this.init();
    };

    NavigationHandler.prototype.init = function(){
      this.addListeners();
    };

    NavigationHandler.prototype.addListeners = function() {
      this.$el.find('ul a').on('click', $.proxy(this.onNavClick, this) );
      this.$navToggler.on('click', $.proxy(this.prepareNavigation, this) );
      this.$pagination.on('click', $.proxy(this.removeFlag, this) );
    };

    NavigationHandler.prototype.prepareNavigation = function() {
      this.$el.removeClass('reset');
    };

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
        $('html, body').animate({scrollTop: scrollTarget}, 1000);
      }
      this.$el.addClass('reset');
      window.location.hash = '';
    };

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