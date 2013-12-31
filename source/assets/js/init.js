define([
  'pageScroller',
  'backgroundLoader',
  'navigationHandler',
  'audioView'
  ], function(PageScroller, BackgroundLoader, NavigationHandler, AudioView){

    /**
     * Initalizing Method
     * @method init
     */
    var init = function(){

      var pageScroller      = new PageScroller(),
          backgroundLoader  = new BackgroundLoader(),
          navigationHandler = new NavigationHandler(),
          audioView         = new AudioView().render();
    };

    return init;

});