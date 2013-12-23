define([
  'pageScroller',
  'backgroundLoader',
  'navigationHandler'
  ], function(PageScroller, BackgroundLoader, NavigationHandler){

    var init = function(){

      var pageScroller      = new PageScroller(),
          backgroundLoader  = new BackgroundLoader(),
          navigationHandler = new NavigationHandler();

    };

    return init;

});