define([

], function(){

 Utils = function() {

 };

 Utils.prototype.getViewport = function() {

       var viewport = window.getComputedStyle(
              document.querySelector('body'), ':before'
            ).getPropertyValue('content');

       return viewport.replace(/"/g,'');
 };

 Utils.prefixedTransitionEnd = 'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend';

 return new Utils();

});


