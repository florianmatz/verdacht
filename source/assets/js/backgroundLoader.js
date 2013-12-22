define([
  'jquery',
  'utils'
  ], function($, utils){

    BackgroundLoader = function() {
      console.log(utils);
      this.$body = $('body');
      this.$sections = $('.main').find('section');
      this.imgPath = "assets/img/";
      this.load();
    };

    BackgroundLoader.prototype.load = function() {

      var viewport = utils.getViewport(),
          self = this;

      $.each(this.$sections, function(index, item) {
        var $item = $(item),
            path = self.imgPath+'bg-'+$item.attr('id')+'-'+viewport+'.jpg';

        require(['image!'+path], function (img) {
          $item.css('background-image', 'url('+path+')');
        });

      });
    };


    return BackgroundLoader;
});