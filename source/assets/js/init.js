define([
  'jquery',
  'pageScroller',
  'backgroundLoader',
  'navigationHandler',
  'audioView',
  'utils'
  ], function($, PageScroller, BackgroundLoader, NavigationHandler, AudioView, utils){

    /**
     * Initalizing Method
     * @method init
     */
    var init = function(){

      var pageScroller      = new PageScroller(),
          backgroundLoader  = new BackgroundLoader(),
          navigationHandler = new NavigationHandler(),
          audioView         = new AudioView(),
          $intro            = $('.intro'),
          $hint             = $intro.find('.hint'),
          $countdown        = $intro.find('.countdown'),
          $counter          = $countdown.find('.box-countdown'),
          countDown         = function() {

            var counter  = 3,
                interval = setInterval(function() {

              $counter.text(--counter);

              if(counter === 0) {
                clearInterval(interval);

                $countdown.one(utils.prefixedTransitionEnd, function() {
                  $intro.remove();
                  audioView.render();
                });

                $countdown.addClass('out');

              }
            }, 2000);
          };

          $hint.find('a').on('click', function(evt) {
            evt.preventDefault();

            $hint.one(utils.prefixedTransitionEnd, function() {
              $hint.off(utils.prefixedTransitionEnd);
              $hint.addClass('hidden');
              $countdown.removeClass('hidden');

              setTimeout(function(){
                $countdown.removeClass('out');
                countDown();
              },50);

            });

            $hint.addClass('out');

          });


    };

    return init;

});