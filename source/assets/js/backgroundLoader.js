define([
  'jquery',
  'utils'
  ], function($, utils){

    /**
     * Class to load background images depending on the current viewport
     * @class BackgroundLoader
     */
    BackgroundLoader = function() {

      /**
       * @property {jQuery} $body The documents body
       */
      this.$body = $('body');

      /**
       * @property {jQuery} $sections The page section as a collection
       */
      this.$sections = $('.main').find('section');

      /**
       * @property {String} imgPath path to the images
       * @type {String}
       */
      this.imgPath = "assets/img/";

      /**
       * @property {jQuery} $loader The visual loading indicator
       * @type {[type]}
       */
      this.$loader = $('.loader');

      this.load();
    };

    /**
     * Load Method
     * @method load
     */
    BackgroundLoader.prototype.load = function() {
      var viewport    = utils.getViewport(),
          self        = this,
          itemsLoaded = 0;

      this.$loader.addClass('show');

      $.each(this.$sections, function(index, item) {
        var $item = $(item),
            path  = self.imgPath+'bg-'+$item.attr('id')+'-'+viewport+'.jpg';

        require(['image!'+path], function (img) {
          $item.css('background-image', 'url('+path+')');
          itemsLoaded++;
          if(itemsLoaded === self.$sections.length) {
            self.$loader.removeClass('show');
          }
        });
      });

    };

    return BackgroundLoader;
});