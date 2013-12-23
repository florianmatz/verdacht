define([
  'jquery',
  'utils'
  ], function($, utils){

    BackgroundLoader = function() {
      this.$body = $('body');
      this.$sections = $('.main').find('section');
      this.imgPath = "assets/img/";
      this.$loader = $('.loader');
      this.load();
    };

    BackgroundLoader.prototype.load = function() {
      var viewport = utils.getViewport(),
          self = this,
          itemsLoaded = 0;
      this.$loader.addClass('show');

      $.each(this.$sections, function(index, item) {
        var $item = $(item),
            path = self.imgPath+'bg-'+$item.attr('id')+'-'+viewport+'.jpg';

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